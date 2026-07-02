import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, Square, Search, Zap, WifiOff, LogIn, LogOut, Network, User } from 'lucide-react';
import {
  fetchAgents, runTask, runWorkflow, apiLogin, fetchMe, logout,
  type TaskDoneEvent, type WorkflowType,
} from '@/lib/api';
import type { Agent } from '@/lib/mockData';

type Phase = 'idle' | 'running' | 'done' | 'error';

/* ── Agent-Suchliste (Einzel- und Mehrfachauswahl) ── */
function AgentList({ agents, selectedIds, onToggle, multi }: {
  agents: Agent[];
  selectedIds: string[];
  onToggle: (a: Agent) => void;
  multi: boolean;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents.slice(0, 30);
    return agents
      .filter((a) =>
        a.display_name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 30);
  }, [agents, query]);

  return (
    <div className="space-y-3">
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
      {multi && (
        <p className="text-xs text-muted-foreground">
          {selectedIds.length}/4 gewählt — Reihenfolge bestimmt die Rollen
          (1. Agent = Koordinator bzw. Pipeline-Start, letzter = Moderator).
        </p>
      )}
      <ScrollArea className="h-[340px] pr-2">
        <div className="space-y-1.5">
          {filtered.map((a) => {
            const pos = selectedIds.indexOf(a.id);
            return (
              <button
                key={a.id}
                onClick={() => onToggle(a)}
                data-testid={`agent-option-${a.id}`}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  pos >= 0 ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{a.display_name}</span>
                  <span className="flex items-center gap-1.5">
                    {multi && pos >= 0 && (
                      <Badge className="h-5 w-5 justify-center p-0 text-[10px]">{pos + 1}</Badge>
                    )}
                    <Badge variant="secondary" className="shrink-0 text-[10px]">{a.llmModelShort}</Badge>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{a.category} · {a.id}</div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-1 py-4 text-sm text-muted-foreground">Keine Treffer.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ── Login ── */
function LoginCard({ onLoggedIn }: { onLoggedIn: (me: { email: string; role: string }) => void }) {
  const [email, setEmail] = useState('admin@valtheron.ai');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [mfaNeeded, setMfaNeeded] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    const result = await apiLogin(email, password, totp || undefined);
    setBusy(false);
    if (result.ok && result.user) {
      onLoggedIn({ email: result.user.email, role: result.user.role });
    } else {
      setMfaNeeded(!!result.mfaRequired);
      setError(result.error ?? 'Anmeldung fehlgeschlagen');
    }
  };

  return (
    <Card className="mx-auto max-w-md" data-testid="login-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LogIn className="h-4 w-4" /> Anmelden
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" />
        <Input
          placeholder="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          data-testid="login-password"
        />
        {mfaNeeded && (
          <Input placeholder="MFA-Code (6 Ziffern)" value={totp} onChange={(e) => setTotp(e.target.value)} data-testid="login-totp" />
        )}
        <Button onClick={submit} disabled={busy || !password} className="w-full gap-2" data-testid="login-submit">
          <LogIn className="h-4 w-4" /> Anmelden
        </Button>
        {error && <p className="text-sm text-red-500" data-testid="login-error">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Standard-Zugang: <code>admin@valtheron.ai</code> — Passwort siehe <code>server/README.md</code>
          (Default <code>valtheron2026</code>, via <code>ADMIN_PASSWORD</code> änderbar).
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Workflow-Schritt-Anzeige ── */
interface StepView { index: number; role: string; agent: string; text: string; done: boolean; tokens?: string }

const WORKFLOW_INFO: Record<WorkflowType, { label: string; hint: string }> = {
  sequential: { label: 'Sequential', hint: 'Pipeline: Jeder Agent verbessert das Ergebnis des vorherigen.' },
  hierarchical: { label: 'Hierarchical', hint: 'Agent 1 koordiniert: zerlegt den Auftrag, Worker arbeiten, Synthese am Ende.' },
  debate: { label: 'Debate', hint: 'Agenten beziehen Position und replizieren, der letzte moderiert das Fazit.' },
};

export default function Console() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [live, setLive] = useState<boolean | null>(null);
  const [me, setMe] = useState<{ email: string; role: string } | null>(null);

  /* Einzel-Agent */
  const [selected, setSelected] = useState<Agent | null>(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [meta, setMeta] = useState<TaskDoneEvent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  /* Workflow */
  const [wfType, setWfType] = useState<WorkflowType>('sequential');
  const [wfTask, setWfTask] = useState('');
  const [wfAgents, setWfAgents] = useState<string[]>([]);
  const [wfSteps, setWfSteps] = useState<StepView[]>([]);
  const [wfPhase, setWfPhase] = useState<Phase>('idle');
  const [wfError, setWfError] = useState('');
  const wfAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchAgents().then(({ agents, live }) => { setAgents(agents); setLive(live); });
    fetchMe().then(setMe);
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [output]);

  const runSingle = async () => {
    if (!selected || !prompt.trim() || phase === 'running') return;
    setPhase('running'); setOutput(''); setMeta(null); setErrorMsg('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await runTask(selected.id, prompt, {
        onDelta: (text) => setOutput((prev) => prev + text),
        onDone: (e) => { setMeta(e); setPhase('done'); },
        onError: (message) => { setErrorMsg(message); setPhase('error'); },
      }, controller.signal);
      setPhase((p) => (p === 'running' ? 'done' : p));
    } catch (err) {
      if (!controller.signal.aborted) {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setPhase('error');
      } else setPhase('idle');
    }
  };

  const runWf = async () => {
    if (wfAgents.length < 2 || !wfTask.trim() || wfPhase === 'running') return;
    setWfPhase('running'); setWfSteps([]); setWfError('');
    const controller = new AbortController();
    wfAbortRef.current = controller;
    try {
      await runWorkflow(wfType, wfTask, wfAgents, {
        onStepStart: (e) => setWfSteps((prev) => [...prev, { index: e.index, role: e.role, agent: e.agent, text: '', done: false }]),
        onDelta: (e) => setWfSteps((prev) => prev.map((s) => (s.index === e.index ? { ...s, text: s.text + e.text } : s))),
        onStepDone: (e) => setWfSteps((prev) => prev.map((s) =>
          s.index === e.index ? { ...s, done: true, tokens: `${e.input_tokens} in / ${e.output_tokens} out` } : s,
        )),
        onWorkflowDone: (e) => {
          if (e.status === 'done') setWfPhase('done');
          else { setWfError(e.error ?? e.status); setWfPhase('error'); }
        },
      }, controller.signal);
      setWfPhase((p) => (p === 'running' ? 'done' : p));
    } catch (err) {
      if (!controller.signal.aborted) {
        setWfError(err instanceof Error ? err.message : String(err));
        setWfPhase('error');
      } else setWfPhase('idle');
    }
  };

  const toggleWfAgent = (a: Agent) => {
    setWfAgents((prev) =>
      prev.includes(a.id) ? prev.filter((id) => id !== a.id) : prev.length < 4 ? [...prev, a.id] : prev,
    );
  };

  const needsLogin = live === true && !me;

  return (
    <div className="space-y-6" data-testid="console-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Console</h1>
          <p className="text-muted-foreground">Echte Agenten-Tasks und Multi-Agent-Workflows</p>
        </div>
        <div className="flex items-center gap-2">
          {me && (
            <Badge variant="outline" className="gap-1.5">
              <User className="h-3.5 w-3.5" /> {me.email}
              <button onClick={() => { logout(); setMe(null); }} title="Abmelden" className="ml-1 opacity-70 hover:opacity-100">
                <LogOut className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {live === false && (
            <Badge variant="outline" className="gap-1.5 border-amber-500/50 text-amber-500">
              <WifiOff className="h-3.5 w-3.5" /> Backend offline — Mock-Daten
            </Badge>
          )}
          {live === true && (
            <Badge variant="outline" className="gap-1.5 border-emerald-500/50 text-emerald-500">
              <Zap className="h-3.5 w-3.5" /> Backend verbunden
            </Badge>
          )}
        </div>
      </div>

      {needsLogin && <LoginCard onLoggedIn={setMe} />}

      {!needsLogin && (
        <Tabs defaultValue="single">
          <TabsList>
            <TabsTrigger value="single" className="gap-1.5" data-testid="tab-single">
              <Bot className="h-4 w-4" /> Einzel-Agent
            </TabsTrigger>
            <TabsTrigger value="workflow" className="gap-1.5" data-testid="tab-workflow">
              <Network className="h-4 w-4" /> Workflow
            </TabsTrigger>
          </TabsList>

          {/* ── Einzel-Agent ── */}
          <TabsContent value="single" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(280px,1fr)_2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4" /> Agent wählen</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentList
                    agents={agents}
                    selectedIds={selected ? [selected.id] : []}
                    onToggle={(a) => setSelected(a)}
                    multi={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{selected ? <>Task für <span className="text-primary">{selected.display_name}</span></> : 'Task'}</span>
                    {meta && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {meta.model} · {meta.input_tokens} in / {meta.output_tokens} out
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={selected ? `Aufgabe für ${selected.display_name} beschreiben…` : 'Zuerst links einen Agenten wählen…'}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    disabled={!selected || phase === 'running'}
                    data-testid="prompt-input"
                  />
                  <div className="flex gap-2">
                    {phase !== 'running' ? (
                      <Button onClick={runSingle} disabled={!selected || !prompt.trim() || live !== true} className="gap-2" data-testid="run-button">
                        <Play className="h-4 w-4" /> Ausführen
                      </Button>
                    ) : (
                      <Button onClick={() => { abortRef.current?.abort(); setPhase('idle'); }} variant="destructive" className="gap-2">
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
                    className="min-h-[260px] max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed"
                  >
                    {output || (phase === 'running'
                      ? <span className="animate-pulse text-muted-foreground">Agent arbeitet…</span>
                      : <span className="text-muted-foreground">Die Antwort des Agenten erscheint hier (live gestreamt).</span>)}
                    {phase === 'running' && output && <span className="animate-pulse">▍</span>}
                  </div>
                  {errorMsg && <p className="text-sm text-red-500" data-testid="task-error">Fehler: {errorMsg}</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Workflow ── */}
          <TabsContent value="workflow" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(280px,1fr)_2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><Network className="h-4 w-4" /> 2–4 Agenten wählen</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentList agents={agents} selectedIds={wfAgents} onToggle={toggleWfAgent} multi />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Multi-Agent-Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(WORKFLOW_INFO) as WorkflowType[]).map((t) => (
                      <Button
                        key={t}
                        variant={wfType === t ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setWfType(t)}
                        disabled={wfPhase === 'running'}
                        data-testid={`wf-type-${t}`}
                      >
                        {WORKFLOW_INFO[t].label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{WORKFLOW_INFO[wfType].hint}</p>
                  <Textarea
                    placeholder="Auftrag für das Agenten-Team…"
                    value={wfTask}
                    onChange={(e) => setWfTask(e.target.value)}
                    rows={3}
                    disabled={wfPhase === 'running'}
                    data-testid="wf-task-input"
                  />
                  <div className="flex gap-2">
                    {wfPhase !== 'running' ? (
                      <Button
                        onClick={runWf}
                        disabled={wfAgents.length < 2 || !wfTask.trim() || live !== true}
                        className="gap-2"
                        data-testid="wf-run-button"
                      >
                        <Play className="h-4 w-4" /> Workflow starten
                      </Button>
                    ) : (
                      <Button onClick={() => { wfAbortRef.current?.abort(); setWfPhase('idle'); }} variant="destructive" className="gap-2">
                        <Square className="h-4 w-4" /> Stoppen
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3" data-testid="wf-steps">
                    {wfSteps.length === 0 && wfPhase === 'idle' && (
                      <p className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                        Die Schritte des Workflows erscheinen hier — jeder Agent streamt live.
                      </p>
                    )}
                    {wfSteps.map((s) => (
                      <div key={s.index} className="rounded-md border bg-muted/30 p-3" data-testid={`wf-step-${s.index}`}>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-medium">
                            <Badge variant="secondary" className="mr-2 text-[10px]">{s.role}</Badge>
                            {s.agent}
                          </span>
                          <span className="text-muted-foreground">
                            {s.done ? s.tokens : <span className="animate-pulse">läuft…</span>}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                          {s.text}{!s.done && <span className="animate-pulse">▍</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {wfError && <p className="text-sm text-red-500" data-testid="wf-error">Fehler: {wfError}</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
