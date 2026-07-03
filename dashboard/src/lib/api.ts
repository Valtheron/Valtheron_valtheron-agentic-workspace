// API-Client für das Valtheron-Backend (server/).
// Fällt auf die Mock-Daten zurück, wenn kein Backend erreichbar ist —
// so bleibt die statische Demo (GitHub Pages) voll funktionsfähig.
import { agentsData, type Agent } from './mockData';

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

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
    headers: { 'Content-Type': 'application/json' },
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
