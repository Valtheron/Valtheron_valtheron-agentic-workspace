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
import { runAgent, modelFor, type AgentRow } from './agent.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const startedAt = Date.now();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime_seconds: Math.round((Date.now() - startedAt) / 1000) });
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
  res.json({ agents, tasks });
});

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

// Runs an agent task; the response is an SSE stream (consumed via fetch).
// Events: start {task_id, model} | delta {text} | done {usage} | error {message}
app.post('/api/tasks', (req, res) => {
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

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  send('start', { task_id: taskId, agent: agent.display_name, model: modelFor(agent) });

  const finish = db.prepare(`
    UPDATE tasks SET result = ?, status = ?, model = ?, input_tokens = ?, output_tokens = ?, error = ?,
    finished_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?
  `);

  const run = runAgent(agent, prompt, {
    onText: (delta) => send('delta', { text: delta }),
    onDone: ({ text, model, inputTokens, outputTokens, stopReason }) => {
      const status = stopReason === 'refusal' ? 'refused' : 'done';
      finish.run(text, status, model, inputTokens, outputTokens, null, taskId);
      send('done', { task_id: taskId, status, model, input_tokens: inputTokens, output_tokens: outputTokens, stop_reason: stopReason });
      res.end();
    },
    onError: (err) => {
      finish.run(null, 'error', modelFor(agent), null, null, err.message, taskId);
      send('error', { task_id: taskId, message: err.message });
      res.end();
    },
  });

  // Abort the model request if the client disconnects mid-stream.
  res.on('close', () => {
    if (!res.writableEnded) run.abort();
  });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Valtheron server listening on http://localhost:${port}`);
});
