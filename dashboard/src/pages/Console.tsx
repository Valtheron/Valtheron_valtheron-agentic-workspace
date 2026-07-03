import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Play, Square, Search, Zap, WifiOff } from 'lucide-react';
import { fetchAgents, runTask, type TaskDoneEvent } from '@/lib/api';
import type { Agent } from '@/lib/mockData';

type Phase = 'idle' | 'running' | 'done' | 'error';

export default function Console() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [live, setLive] = useState<boolean | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Agent | null>(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [meta, setMeta] = useState<TaskDoneEvent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAgents().then(({ agents, live }) => {
      setAgents(agents);
      setLive(live);
    });
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [output]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents.slice(0, 30);
    return agents
      .filter(
        (a) =>
          a.display_name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 30);
  }, [agents, query]);

  const run = async () => {
    if (!selected || !prompt.trim() || phase === 'running') return;
    setPhase('running');
    setOutput('');
    setMeta(null);
    setErrorMsg('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await runTask(
        selected.id,
        prompt,
        {
          onDelta: (text) => setOutput((prev) => prev + text),
          onDone: (e) => {
            setMeta(e);
            setPhase('done');
          },
          onError: (message) => {
            setErrorMsg(message);
            setPhase('error');
          },
        },
        controller.signal,
      );
      setPhase((p) => (p === 'running' ? 'done' : p));
    } catch (err) {
      if (!controller.signal.aborted) {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setPhase('error');
      } else {
        setPhase('idle');
      }
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setPhase('idle');
  };

  return (
    <div className="space-y-6" data-testid="console-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Console</h1>
          <p className="text-muted-foreground">
            Führe echte Agenten-Tasks über das Valtheron-Backend aus
          </p>
        </div>
        {live === false && (
          <Badge variant="outline" className="gap-1.5 border-amber-500/50 text-amber-500">
            <WifiOff className="h-3.5 w-3.5" />
            Backend offline — Mock-Daten
          </Badge>
        )}
        {live === true && (
          <Badge variant="outline" className="gap-1.5 border-emerald-500/50 text-emerald-500">
            <Zap className="h-3.5 w-3.5" />
            Backend verbunden
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,1fr)_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" /> Agent wählen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen (Name, Rolle, Kategorie)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
                data-testid="agent-search"
              />
            </div>
            <ScrollArea className="h-[380px] pr-2">
              <div className="space-y-1.5">
                {filtered.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    data-testid={`agent-option-${a.id}`}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      selected?.id === a.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{a.display_name}</span>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {a.llmModelShort}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.category} · {a.id}
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-1 py-4 text-sm text-muted-foreground">Keine Treffer.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>
                {selected ? (
                  <>
                    Task für <span className="text-primary">{selected.display_name}</span>
                  </>
                ) : (
                  'Task'
                )}
              </span>
              {meta && (
                <span className="text-xs font-normal text-muted-foreground">
                  {meta.model} · {meta.input_tokens} in / {meta.output_tokens} out
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={
                selected
                  ? `Aufgabe für ${selected.display_name} beschreiben…`
                  : 'Zuerst links einen Agenten wählen…'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              disabled={!selected || phase === 'running'}
              data-testid="prompt-input"
            />
            <div className="flex gap-2">
              {phase !== 'running' ? (
                <Button
                  onClick={run}
                  disabled={!selected || !prompt.trim() || live !== true}
                  className="gap-2"
                  data-testid="run-button"
                >
                  <Play className="h-4 w-4" /> Ausführen
                </Button>
              ) : (
                <Button onClick={stop} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" /> Stoppen
                </Button>
              )}
              {live === false && (
                <p className="self-center text-xs text-muted-foreground">
                  Backend starten: <code>cd server && npm start</code>
                </p>
              )}
            </div>

            <div
              ref={outputRef}
              data-testid="task-output"
              className="min-h-[280px] max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed"
            >
              {output ||
                (phase === 'running' ? (
                  <span className="animate-pulse text-muted-foreground">
                    Agent arbeitet…
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Die Antwort des Agenten erscheint hier (live gestreamt).
                  </span>
                ))}
              {phase === 'running' && output && <span className="animate-pulse">▍</span>}
            </div>
            {errorMsg && (
              <p className="text-sm text-red-500" data-testid="task-error">
                Fehler: {errorMsg}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
