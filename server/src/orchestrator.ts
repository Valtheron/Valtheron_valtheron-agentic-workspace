import crypto from 'node:crypto';
import { db } from './db.js';
import { runAgent, type AgentRow } from './agent.js';

/* ── Laufzeit-Registry: alles, was gerade läuft, ist hier abbrechbar ── */
interface RunningEntry { abort: () => void; label: string }
export const running = new Map<string, RunningEntry>();

let killSwitchState = { active: false, activatedBy: null as string | null, activatedAt: null as string | null };

export function getKillSwitch() { return killSwitchState; }

export function activateKillSwitch(byEmail: string): { terminated: number } {
  killSwitchState = { active: true, activatedBy: byEmail, activatedAt: new Date().toISOString() };
  let terminated = 0;
  for (const [id, entry] of running) {
    entry.abort();
    running.delete(id);
    terminated += 1;
  }
  return { terminated };
}

export function resetKillSwitch(): void {
  killSwitchState = { active: false, activatedBy: null, activatedAt: null };
}

/* ── Promise-Wrapper um runAgent, registriert in der Registry ── */
export interface StepResult { text: string; model: string; inputTokens: number; outputTokens: number }

export function runAgentStep(
  registryId: string,
  agent: AgentRow,
  prompt: string,
  onDelta: (text: string) => void,
): Promise<StepResult> {
  return new Promise((resolve, reject) => {
    const run = runAgent(agent, prompt, {
      onText: onDelta,
      onDone: (r) => {
        running.delete(registryId);
        resolve({ text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens });
      },
      onError: (err) => {
        running.delete(registryId);
        reject(err);
      },
    });
    running.set(registryId, { abort: run.abort, label: `${agent.display_name}` });
  });
}

/* ── Workflow-Engine: sequential | hierarchical | debate (Handbuch v2.0) ── */
export type WorkflowType = 'sequential' | 'hierarchical' | 'debate';

export interface WorkflowEmit {
  (event: string, data: unknown): void;
}

interface PlannedStep { role: string; agent: AgentRow; buildPrompt: (ctx: Record<number, string>) => string }

export async function runWorkflow(
  type: WorkflowType,
  task: string,
  agents: AgentRow[],
  createdBy: string,
  emit: WorkflowEmit,
  isClientGone: () => boolean,
): Promise<void> {
  const workflowId = crypto.randomUUID();
  db.prepare('INSERT INTO workflows (id, type, task, status, created_by) VALUES (?, ?, ?, ?, ?)')
    .run(workflowId, type, task, 'running', createdBy);

  const insertStep = db.prepare(`
    INSERT INTO workflow_steps (workflow_id, step_index, step_role, agent_id, prompt, status)
    VALUES (?, ?, ?, ?, ?, 'running')
  `);
  const finishStep = db.prepare(`
    UPDATE workflow_steps SET result = ?, status = ?, input_tokens = ?, output_tokens = ?
    WHERE workflow_id = ? AND step_index = ?
  `);
  const finishWorkflow = db.prepare(`
    UPDATE workflows SET status = ?, finished_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?
  `);

  const results: Record<number, string> = {};

  const runStep = async (index: number, role: string, agent: AgentRow, prompt: string): Promise<string> => {
    insertStep.run(workflowId, index, role, agent.id, prompt);
    emit('step_start', { index, role, agent_id: agent.id, agent: agent.display_name });
    try {
      const r = await runAgentStep(`${workflowId}:${index}`, agent, prompt, (text) =>
        emit('delta', { index, text }),
      );
      finishStep.run(r.text, 'done', r.inputTokens, r.outputTokens, workflowId, index);
      emit('step_done', { index, role, agent: agent.display_name, input_tokens: r.inputTokens, output_tokens: r.outputTokens });
      results[index] = r.text;
      return r.text;
    } catch (err) {
      finishStep.run(null, 'error', null, null, workflowId, index);
      throw err;
    }
  };

  emit('workflow_start', { workflow_id: workflowId, type, agents: agents.map((a) => a.display_name) });

  try {
    let stepIndex = 0;

    if (type === 'sequential') {
      // Pipeline: jedes Ergebnis fließt in den nächsten Agenten.
      let context = '';
      for (const agent of agents) {
        if (isClientGone()) throw new Error('Client getrennt');
        const prompt = context
          ? `Auftrag: ${task}\n\nErgebnis des vorherigen Agenten:\n${context}\n\nFühre nun deinen Teil aus: Prüfe, verbessere und ergänze das Ergebnis aus deiner fachlichen Perspektive. Liefere das vollständige, verbesserte Ergebnis.`
          : `Auftrag: ${task}\n\nDu bist der erste Agent in einer Pipeline. Erstelle einen fundierten ersten Entwurf.`;
        context = await runStep(stepIndex++, `pipeline-${stepIndex}`, agent, prompt);
      }
    }

    if (type === 'hierarchical') {
      // Koordinator zerlegt, Worker arbeiten, Koordinator synthetisiert.
      const [coordinator, ...workers] = agents;
      const planPrompt = `Auftrag: ${task}\n\nDu bist der Koordinator. Zerlege den Auftrag in genau ${workers.length} Teilaufgaben — eine pro Worker:\n${workers.map((w, i) => `${i + 1}. ${w.display_name} (${w.role})`).join('\n')}\n\nAntworte NUR mit der nummerierten Liste der Teilaufgaben (1.–${workers.length}.), jeweils in 1–2 Sätzen.`;
      const plan = await runStep(stepIndex++, 'koordinator-plan', coordinator, planPrompt);

      const subtasks = plan
        .split('\n')
        .map((l) => /^\s*\d+[.)]\s*(.+)$/.exec(l)?.[1]?.trim())
        .filter((s): s is string => !!s);

      const workerResults: string[] = [];
      for (let w = 0; w < workers.length; w++) {
        if (isClientGone()) throw new Error('Client getrennt');
        const sub = subtasks[w] ?? task;
        const text = await runStep(stepIndex++, `worker-${w + 1}`, workers[w],
          `Gesamtauftrag: ${task}\n\nDeine Teilaufgabe vom Koordinator: ${sub}\n\nBearbeite genau diese Teilaufgabe präzise und kompakt.`);
        workerResults.push(`### ${workers[w].display_name}\n${text}`);
      }

      await runStep(stepIndex++, 'koordinator-synthese', coordinator,
        `Auftrag: ${task}\n\nDeine Worker haben geliefert:\n\n${workerResults.join('\n\n')}\n\nFühre alles zu einem stimmigen Gesamtergebnis zusammen.`);
    }

    if (type === 'debate') {
      // Positionen, Repliken, Fazit — Moderator ist der letzte Agent.
      const debaters = agents.length > 2 ? agents.slice(0, -1) : agents;
      const moderator = agents.length > 2 ? agents[agents.length - 1] : agents[0];
      const positions: string[] = [];
      for (let d = 0; d < debaters.length; d++) {
        if (isClientGone()) throw new Error('Client getrennt');
        const text = await runStep(stepIndex++, `position-${d + 1}`, debaters[d],
          `Debatte zum Thema: ${task}\n\nGib deine fachliche Position in 3–5 prägnanten Sätzen ab. Beziehe klar Stellung aus deiner Rolle heraus.`);
        positions.push(`Position von ${debaters[d].display_name}:\n${text}`);
      }
      const rebuttals: string[] = [];
      for (let d = 0; d < debaters.length; d++) {
        if (isClientGone()) throw new Error('Client getrennt');
        const others = positions.filter((_, i) => i !== d).join('\n\n');
        const text = await runStep(stepIndex++, `replik-${d + 1}`, debaters[d],
          `Debatte zum Thema: ${task}\n\nDie Gegenpositionen:\n${others}\n\nGib eine kurze Replik (2–4 Sätze): Wo stimmst du zu, wo widersprichst du und warum?`);
        rebuttals.push(`Replik von ${debaters[d].display_name}:\n${text}`);
      }
      await runStep(stepIndex++, 'moderator-fazit', moderator,
        `Debatte zum Thema: ${task}\n\n${positions.join('\n\n')}\n\n${rebuttals.join('\n\n')}\n\nDu bist der Moderator. Ziehe ein ausgewogenes Fazit mit einer klaren Empfehlung.`);
    }

    finishWorkflow.run('done', workflowId);
    emit('workflow_done', { workflow_id: workflowId, status: 'done', steps: stepIndex });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status = getKillSwitch().active ? 'killed' : 'error';
    finishWorkflow.run(status, workflowId);
    emit('workflow_done', { workflow_id: workflowId, status, error: message });
  }
}
