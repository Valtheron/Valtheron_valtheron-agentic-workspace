// API-Client für das Valtheron-Backend (server/).
// Fällt auf die Mock-Daten zurück, wenn kein Backend erreichbar ist —
// so bleibt die statische Demo (GitHub Pages) voll funktionsfähig.
import { agentsData, type Agent } from './mockData';

// Prod-Build (vom Backend selbst ausgeliefert): Same-Origin, relative /api-Pfade.
// Dev: getrennter Vite-Server → Backend auf :3001. Override via VITE_API_URL.
// Auf GitHub Pages (kein Backend) schlägt der relative Fetch fehl → Mock-Fallback.
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

export interface TaskStartEvent { task_id: string; agent: string; model: string }
export interface TaskDoneEvent {
  task_id: string;
  status: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  stop_reason: string | null;
}

export async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(2500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAgents(): Promise<{ agents: Agent[]; live: boolean }> {
  try {
    const res = await fetch(`${API_URL}/api/agents`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as Array<Record<string, unknown>>;
    const agents: Agent[] = rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      display_name: r.display_name as string,
      category: r.category as Agent['category'],
      llmModelShort: r.llm_model_short as Agent['llmModelShort'],
      status: r.status as Agent['status'],
      role: r.role as string,
      llmProvider: r.llm_provider as Agent['llmProvider'],
      llmModel: r.llm_model as string,
      personality: r.personality as Agent['personality'],
      certificationLevel: r.certification_level as Agent['certificationLevel'],
      powerLevel: r.power_level as number,
      tasksCompleted: r.tasks_completed as number,
      successRate: r.success_rate as number,
      lastActive: r.last_active as string,
      description: r.description as string,
      tags: r.tags as string[],
    }));
    return { agents, live: true };
  } catch {
    return { agents: agentsData, live: false };
  }
}

export interface RunTaskCallbacks {
  onStart?: (e: TaskStartEvent) => void;
  onDelta: (text: string) => void;
  onDone?: (e: TaskDoneEvent) => void;
  onError?: (message: string) => void;
}

// Startet einen Agenten-Task und konsumiert den SSE-Stream der POST-Response.
export async function runTask(
  agentId: string,
  prompt: string,
  cb: RunTaskCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ agentId, prompt }),
    signal,
  });
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Backend-Fehler (HTTP ${res.status}) ${detail}`.trim());
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handle = (event: string, data: string) => {
    switch (event) {
      case 'start': cb.onStart?.(JSON.parse(data) as TaskStartEvent); break;
      case 'delta': cb.onDelta((JSON.parse(data) as { text: string }).text); break;
      case 'done': cb.onDone?.(JSON.parse(data) as TaskDoneEvent); break;
      case 'error': cb.onError?.((JSON.parse(data) as { message: string }).message); break;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let event = 'message';
      const dataLines: string[] = [];
      for (const line of frame.split('\n')) {
        if (line.startsWith('event: ')) event = line.slice(7).trim();
        else if (line.startsWith('data: ')) dataLines.push(line.slice(6));
      }
      if (dataLines.length) handle(event, dataLines.join('\n'));
    }
  }
}

/* ── Auth ── */

const TOKEN_KEY = 'valtheron_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface LoginResult {
  ok: boolean;
  error?: string;
  mfaRequired?: boolean;
  user?: { email: string; displayName: string; role: string; mfaEnabled: boolean };
}

export async function apiLogin(email: string, password: string, totp?: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totp }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error, mfaRequired: !!data.mfa_required };
    localStorage.setItem(TOKEN_KEY, data.token);
    return { ok: true, user: data.user };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function fetchMe(): Promise<{ email: string; role: string } | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) { logout(); return null; }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

/* ── Kill-Switch ── */

export async function activateKillSwitch(totp?: string): Promise<{ ok: boolean; terminated?: number; error?: string }> {
  const res = await fetch(`${API_URL}/api/kill-switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ totp }),
  });
  const data = await res.json();
  return res.ok ? { ok: true, terminated: data.terminated } : { ok: false, error: data.error };
}

export async function resetKillSwitch(): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/kill-switch/reset`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
}

export async function killSwitchStatus(): Promise<{ active: boolean }> {
  try {
    const res = await fetch(`${API_URL}/api/kill-switch`, { signal: AbortSignal.timeout(2500) });
    return await res.json();
  } catch {
    return { active: false };
  }
}

/* ── Workflows ── */

export type WorkflowType = 'sequential' | 'hierarchical' | 'debate';

export interface WorkflowCallbacks {
  onWorkflowStart?: (e: { workflow_id: string; type: string; agents: string[] }) => void;
  onStepStart?: (e: { index: number; role: string; agent_id: string; agent: string }) => void;
  onDelta: (e: { index: number; text: string }) => void;
  onStepDone?: (e: { index: number; role: string; agent: string; input_tokens: number; output_tokens: number }) => void;
  onWorkflowDone?: (e: { workflow_id: string; status: string; steps?: number; error?: string }) => void;
}

export async function runWorkflow(
  type: WorkflowType,
  task: string,
  agentIds: string[],
  cb: WorkflowCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/workflows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ type, task, agentIds }),
    signal,
  });
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Backend-Fehler (HTTP ${res.status}) ${detail}`.trim());
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handle = (event: string, data: string) => {
    const parsed = JSON.parse(data);
    switch (event) {
      case 'workflow_start': cb.onWorkflowStart?.(parsed); break;
      case 'step_start': cb.onStepStart?.(parsed); break;
      case 'delta': cb.onDelta(parsed); break;
      case 'step_done': cb.onStepDone?.(parsed); break;
      case 'workflow_done': cb.onWorkflowDone?.(parsed); break;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let event = 'message';
      const dataLines: string[] = [];
      for (const line of frame.split('\n')) {
        if (line.startsWith('event: ')) event = line.slice(7).trim();
        else if (line.startsWith('data: ')) dataLines.push(line.slice(6));
      }
      if (dataLines.length) handle(event, dataLines.join('\n'));
    }
  }
}
