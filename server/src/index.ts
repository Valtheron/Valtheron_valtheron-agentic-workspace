import 'dotenv/config';
// Corporate/sandbox proxies: Node's fetch ignores HTTPS_PROXY by default.
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  const { EnvHttpProxyAgent, setGlobalDispatcher } = await import('undici');
  setGlobalDispatcher(new EnvHttpProxyAgent());
}
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { db } from './db.js';
import { modelFor, type AgentRow } from './agent.js';
import {
  ensureAdminUser, login, requireAuth, logAudit, mfaEnroll, mfaVerify,
  verifySensitiveOp, type AuthedRequest,
} from './auth.js';
import {
  running, runAgentStep, runWorkflow, getKillSwitch, activateKillSwitch,
  resetKillSwitch, type WorkflowType,
} from './orchestrator.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
ensureAdminUser();

const startedAt = Date.now();

const sseHead = (res: express.Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  return (event: string, data: unknown) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

/* ── Öffentlich: Health + Lesezugriffe ── */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime_seconds: Math.round((Date.now() - startedAt) / 1000),
    kill_switch: getKillSwitch().active,
    running_tasks: running.size,
  });
});

app.get('/api/agents', (_req, res) => {
  const rows = db.prepare('SELECT * FROM agents ORDER BY category, display_name').all() as Array<AgentRow & Record<string, unknown>>;
  res.json(rows.map((r) => ({ ...r, tags: JSON.parse(r.tags as string) })));
});

app.get('/api/metrics', (_req, res) => {
  const agents = db.prepare(`
    SELECT COUNT(*) AS total,
           SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
           SUM(CASE WHEN status = 'idle' THEN 1 ELSE 0 END) AS idle,
           SUM(CASE WHEN status = 'busy' THEN 1 ELSE 0 END) AS busy,
           SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) AS offline
    FROM agents
  `).get();
  const tasks = db.prepare(`
    SELECT COUNT(*) AS total,
           SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done,
           SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) AS errored,
           COALESCE(SUM(input_tokens), 0) AS input_tokens,
           COALESCE(SUM(output_tokens), 0) AS output_tokens
    FROM tasks
  `).get();
  const workflows = db.prepare(`
    SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done FROM workflows
  `).get();
  res.json({ agents, tasks, workflows, kill_switch: getKillSwitch().active });
});

/* ── Auth ── */

app.post('/api/auth/login', (req, res) => {
  const { email, password, totp } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'email und password erforderlich' });
    return;
  }
  const result = login(email, password, typeof totp === 'string' ? totp : undefined);
  if (!result.ok) {
    logAudit(email, 'auth.login.failed', result.error, req.ip);
    res.status(result.status).json({ error: result.error, mfa_required: result.error.includes('MFA') });
    return;
  }
  logAudit(email, 'auth.login', 'Anmeldung erfolgreich', req.ip);
  res.json({ token: result.token, user: result.user });
});

app.get('/api/auth/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/mfa/enroll', requireAuth, (req: AuthedRequest, res) => {
  const enrollment = mfaEnroll(req.user!.id);
  logAudit(req.user!.email, 'auth.mfa.enroll', 'MFA-Setup gestartet', req.ip);
  res.json(enrollment);
});

app.post('/api/auth/mfa/verify', requireAuth, (req: AuthedRequest, res) => {
  const { code } = req.body ?? {};
  if (typeof code !== 'string' || !mfaVerify(req.user!.id, code)) {
    res.status(400).json({ error: 'Code ungültig' });
    return;
  }
  logAudit(req.user!.email, 'auth.mfa.enabled', 'MFA aktiviert', req.ip);
  res.json({ mfa_enabled: true });
});

/* ── Audit-Trail ── */

app.get('/api/audit', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 100').all());
});

/* ── Kill-Switch ── */

app.get('/api/kill-switch', (_req, res) => {
  res.json(getKillSwitch());
});

app.post('/api/kill-switch', requireAuth, (req: AuthedRequest, res) => {
  const check = verifySensitiveOp(req.user!.id, req.body?.totp);
  if (!check.ok) {
    res.status(401).json({ error: check.error, mfa_required: true });
    return;
  }
  const { terminated } = activateKillSwitch(req.user!.email);
  logAudit(req.user!.email, 'killswitch.activated', `${terminated} laufende Prozesse beendet`, req.ip);
  res.json({ active: true, terminated });
});

app.post('/api/kill-switch/reset', requireAuth, (req: AuthedRequest, res) => {
  resetKillSwitch();
  logAudit(req.user!.email, 'killswitch.reset', 'System reaktiviert', req.ip);
  res.json({ active: false });
});

/* ── Tasks (einzelner Agent) ── */

app.get('/api/tasks', (_req, res) => {
  const rows = db.prepare(`
    SELECT t.id, t.agent_id, a.display_name AS agent_name, t.prompt, t.status,
           t.model, t.input_tokens, t.output_tokens, t.created_at, t.finished_at
    FROM tasks t JOIN agents a ON a.id = t.agent_id
    ORDER BY t.created_at DESC LIMIT 50
  `).all();
  res.json(rows);
});

app.get('/api/tasks/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ error: 'task not found' }); return; }
  res.json(row);
});

app.post('/api/tasks', requireAuth, (req: AuthedRequest, res) => {
  if (getKillSwitch().active) {
    res.status(423).json({ error: 'Kill-Switch aktiv — System gesperrt. Erst zurücksetzen.' });
    return;
  }
  const { agentId, prompt } = req.body ?? {};
  if (typeof agentId !== 'string' || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'agentId and prompt are required' });
    return;
  }
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as AgentRow | undefined;
  if (!agent) { res.status(404).json({ error: `agent ${agentId} not found` }); return; }

  const taskId = crypto.randomUUID();
  db.prepare('INSERT INTO tasks (id, agent_id, prompt, status, model) VALUES (?, ?, ?, ?, ?)')
    .run(taskId, agentId, prompt, 'running', modelFor(agent));
  logAudit(req.user!.email, 'task.started', `${agent.display_name}: ${prompt.slice(0, 120)}`, req.ip);

  const send = sseHead(res);
  send('start', { task_id: taskId, agent: agent.display_name, model: modelFor(agent) });

  const finish = db.prepare(`
    UPDATE tasks SET result = ?, status = ?, model = ?, input_tokens = ?, output_tokens = ?, error = ?,
    finished_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?
  `);

  runAgentStep(taskId, agent, prompt, (text) => send('delta', { text }))
    .then((r) => {
      finish.run(r.text, 'done', r.model, r.inputTokens, r.outputTokens, null, taskId);
      send('done', { task_id: taskId, status: 'done', model: r.model, input_tokens: r.inputTokens, output_tokens: r.outputTokens, stop_reason: 'end_turn' });
      res.end();
    })
    .catch((err: Error) => {
      const status = getKillSwitch().active ? 'killed' : 'error';
      finish.run(null, status, modelFor(agent), null, null, err.message, taskId);
      logAudit(req.user!.email, `task.${status}`, `${agent.display_name}: ${err.message}`, req.ip);
      send('error', { task_id: taskId, status, message: err.message });
      res.end();
    });

  // Abort the model request if the client disconnects mid-stream.
  res.on('close', () => {
    if (!res.writableEnded) running.get(taskId)?.abort();
  });
});

/* ── Workflows (Multi-Agent-Orchestrierung) ── */

app.get('/api/workflows', (_req, res) => {
  const workflows = db.prepare('SELECT * FROM workflows ORDER BY created_at DESC LIMIT 25').all() as Array<Record<string, unknown>>;
  const stepsFor = db.prepare('SELECT step_index, step_role, agent_id, status, input_tokens, output_tokens FROM workflow_steps WHERE workflow_id = ? ORDER BY step_index');
  res.json(workflows.map((w) => ({ ...w, steps: stepsFor.all(w.id) })));
});

app.post('/api/workflows', requireAuth, (req: AuthedRequest, res) => {
  if (getKillSwitch().active) {
    res.status(423).json({ error: 'Kill-Switch aktiv — System gesperrt. Erst zurücksetzen.' });
    return;
  }
  const { type, task, agentIds } = req.body ?? {};
  const validTypes: WorkflowType[] = ['sequential', 'hierarchical', 'debate'];
  if (!validTypes.includes(type) || typeof task !== 'string' || !task.trim() || !Array.isArray(agentIds)) {
    res.status(400).json({ error: 'type (sequential|hierarchical|debate), task und agentIds[] erforderlich' });
    return;
  }
  if (agentIds.length < 2 || agentIds.length > 4) {
    res.status(400).json({ error: 'Bitte 2–4 Agenten wählen' });
    return;
  }
  const byId = db.prepare('SELECT * FROM agents WHERE id = ?');
  const agents = agentIds.map((id: string) => byId.get(id) as AgentRow | undefined);
  const missing = agentIds.filter((_, i) => !agents[i]);
  if (missing.length) {
    res.status(404).json({ error: `Agenten nicht gefunden: ${missing.join(', ')}` });
    return;
  }
  logAudit(req.user!.email, 'workflow.started', `${type}: ${task.slice(0, 120)} [${agentIds.join(', ')}]`, req.ip);

  const send = sseHead(res);
  let clientGone = false;
  res.on('close', () => { clientGone = !res.writableEnded; });

  runWorkflow(type, task, agents as AgentRow[], req.user!.email, send, () => clientGone)
    .finally(() => res.end());
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Valtheron server listening on http://localhost:${port}`);
  if (process.env.MOCK_LLM === '1') console.warn('[dev] MOCK_LLM aktiv — es werden keine echten Modell-Aufrufe gemacht.');
});
