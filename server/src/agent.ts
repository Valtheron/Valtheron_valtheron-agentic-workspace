import Anthropic from '@anthropic-ai/sdk';

export interface AgentRow {
  id: string;
  display_name: string;
  category: string;
  role: string;
  llm_model_short: string;
  personality: string;
  description: string;
  tags: string;
}

const client = new Anthropic();

// Model tiers per Handbuch v2.0: Opus categories run on Opus, Sonnet
// categories on Sonnet. Overridable via env for cost control.
export function modelFor(agent: AgentRow): string {
  if (process.env.ANTHROPIC_MODEL) return process.env.ANTHROPIC_MODEL;
  return agent.llm_model_short === 'Sonnet' ? 'claude-sonnet-5' : 'claude-opus-4-8';
}

export function systemPromptFor(agent: AgentRow): string {
  const tags = JSON.parse(agent.tags) as string[];
  return [
    `Du bist "${agent.display_name}" (${agent.id}), ein spezialisierter Agent im Valtheron Agentic Workspace.`,
    `Rolle: ${agent.role}. Kategorie: ${agent.category}. Persönlichkeits-Archetyp: ${agent.personality}.`,
    `Beschreibung: ${agent.description}. Fachgebiete: ${tags.join(', ')}.`,
    `Antworte in der Sprache des Nutzers, bleibe in deiner Fachrolle und sei präzise und hilfreich.`,
    `Wenn eine Anfrage außerhalb deines Fachgebiets liegt, sage das kurz und verweise auf die passende Agenten-Kategorie.`,
  ].join('\n');
}

export interface RunCallbacks {
  onText: (delta: string) => void;
  onDone: (result: { text: string; model: string; inputTokens: number; outputTokens: number; stopReason: string | null }) => void;
  onError: (err: Error) => void;
}

export function runAgent(agent: AgentRow, prompt: string, cb: RunCallbacks): { abort: () => void } {
  // Dev-only: MOCK_LLM=1 streamt eine kanonische Antwort ohne API-Aufruf —
  // für Tests von Orchestrierung, Kill-Switch und UI ohne API-Key/Kosten.
  if (process.env.MOCK_LLM === '1') return runMockAgent(agent, prompt, cb);
  const model = modelFor(agent);
  const stream = client.messages.stream({
    model,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: systemPromptFor(agent),
    messages: [{ role: 'user', content: prompt }],
  });

  stream.on('text', (delta) => cb.onText(delta));

  stream
    .finalMessage()
    .then((message) => {
      const text = message.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
      cb.onDone({
        text,
        model: message.model,
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        stopReason: message.stop_reason,
      });
    })
    .catch((err: Error) => cb.onError(err));

  return { abort: () => stream.abort() };
}

function runMockAgent(agent: AgentRow, prompt: string, cb: RunCallbacks): { abort: () => void } {
  const words = `[MOCK] ${agent.display_name} (${agent.role}) bearbeitet: "${prompt.slice(0, 80)}" — Analyse abgeschlossen, Empfehlung: schrittweise vorgehen und Ergebnisse validieren.`.split(' ');
  let i = 0;
  let aborted = false;
  const timer = setInterval(() => {
    if (aborted) return;
    if (i < words.length) {
      cb.onText(words[i] + ' ');
      i += 1;
    } else {
      clearInterval(timer);
      cb.onDone({
        text: words.join(' ') + ' ',
        model: 'mock-model',
        inputTokens: 10 + prompt.length,
        outputTokens: words.length,
        stopReason: 'end_turn',
      });
    }
  }, 120);
  return {
    abort: () => {
      aborted = true;
      clearInterval(timer);
      cb.onError(new Error('Request was aborted.'));
    },
  };
}
