import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Search,
  Shield,
  Zap,
  Brain,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Award,
  Code,
  Cpu,
  TrendingUp,
  Layers,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  agentsData,
  tasksData,
  workflowsData,
  personalityData,
  certificationData,
} from '@/lib/mockData';
import type {
  Agent,
  AgentCategory,
  AgentStatus,
  CertLevel,
  ArchetypeName,
  PersonalityProfile,
} from '@/lib/mockData';

/* ─────────────────────── category config ─────────────────────── */

interface CategoryConfig {
  color: string;
  label: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  // Basis-Set (200 agents, 20 per category) — Opus: ANA,GES,ENT,SCH | Sonnet: DEV,MKT,PRO,ECO,LEH,ETR
  GES: { color: '#EF4444', label: 'Gesundheitsexperten' },
  ANA: { color: '#3B82F6', label: 'Analytiker' },
  MKT: { color: '#F59E0B', label: 'Marketer' },
  PRO: { color: '#10B981', label: 'Produzenten' },
  ENT: { color: '#8B5CF6', label: 'Entrepreneure' },
  ETR: { color: '#EC4899', label: 'Entertainer' },
  LEH: { color: '#06B6D4', label: 'Lehrer' },
  SCH: { color: '#F97316', label: 'Schriftsteller' },
  ECO: { color: '#14B8A6', label: 'E-Commerce' },
  DEV: { color: '#6366F1', label: 'Entwickler' },
  // Extended-Set (91 agents) — Opus: AIN,MET,FIN,DAT | Sonnet: HYB,HUM
  AIN: { color: '#0EA5E9', label: 'AI-Native' },
  MET: { color: '#22C55E', label: 'Meta' },
  FIN: { color: '#EAB308', label: 'FinTech' },
  HYB: { color: '#D946EF', label: 'Hybrid' },
  HUM: { color: '#F43F5E', label: 'Human-Centric' },
  DAT: { color: '#64748B', label: 'Data-Specialist' },
  MED: { color: '#0EA5E9', label: 'Medical' },
  SYS: { color: '#64748B', label: 'Systems' },
};

/** 16 Categories per Handbuch v2.0 — 10 Basis + 6 Extended */
const CATEGORIES: string[] = [
  // Basis-Set (200 agents)
  'GES', 'ANA', 'MKT', 'PRO', 'ENT', 'ETR', 'LEH', 'SCH', 'ECO', 'DEV',
  // Extended-Set (91 agents)
  'AIN', 'MET', 'FIN', 'HYB', 'HUM', 'DAT',
];

/* ─────────────────────── status config ─────────────────────── */

const STATUS_CONFIG: Record<AgentStatus, { color: string; bg: string; label: string; icon: typeof CheckCircle }> = {
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Active', icon: CheckCircle },
  idle:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Idle',   icon: Clock },
  busy:   { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Busy',   icon: AlertCircle },
  offline:{ color: '#64748B', bg: 'rgba(100,116,139,0.15)', label: 'Offline',icon: XCircle },
};

const STATUSES: AgentStatus[] = ['active', 'idle', 'busy', 'offline'];

/* ─────────────────────── certification config ─────────────────────── */

const CERT_CONFIG: Record<CertLevel, { color: string; bg: string }> = {
  UNCERTIFIED:           { color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' },
  TECHNICAL_VALID:       { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  FORSETI_VERIFIED:      { color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
  EXPERT_REVIEWED:       { color: '#F5A623', bg: 'rgba(245,166,35,0.15)' },
  FIELD_TESTED:          { color: '#14B8A6', bg: 'rgba(20,184,166,0.15)' },
  CERTIFIED_PROFESSIONAL:{ color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
};

const CERT_LEVELS: CertLevel[] = [
  'UNCERTIFIED',
  'TECHNICAL_VALID',
  'FORSETI_VERIFIED',
  'EXPERT_REVIEWED',
  'FIELD_TESTED',
  'CERTIFIED_PROFESSIONAL',
];

/* ─────────────────────── personality parameter meta ─────────────────────── */

/** 12 Personality Parameters per Handbuch v2.0 */
const PERSONALITY_PARAMS: { key: keyof PersonalityProfile; label: string; color: string }[] = [
  { key: 'formality',        label: 'Formality',         color: '#EC4899' },
  { key: 'verbosity',        label: 'Verbosity',         color: '#6366F1' },
  { key: 'warmth',           label: 'Warmth',            color: '#14B8A6' },
  { key: 'creativity',       label: 'Creativity',        color: '#8B5CF6' },
  { key: 'structure',        label: 'Structure',         color: '#3B82F6' },
  { key: 'risk_tolerance',   label: 'Risk Tolerance',    color: '#EF4444' },
  { key: 'proactivity',      label: 'Proactivity',       color: '#F59E0B' },
  { key: 'curiosity',        label: 'Curiosity',         color: '#F97316' },
  { key: 'collaboration',    label: 'Collaboration',     color: '#06B6D4' },
  { key: 'depth',            label: 'Depth',             color: '#22C55E' },
  { key: 'confidence',       label: 'Confidence',        color: '#D946EF' },
  { key: 'adaptability',     label: 'Adaptability',      color: '#0EA5E9' },
];

/* ─────────────────────── helpers ─────────────────────── */

function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getAgentTasks(agentId: string) {
  return tasksData.filter((t) => t.assignedAgentId === agentId);
}

function getAgentWorkflows(agentId: string) {
  return workflowsData.filter((w) => w.steps.some((s) => s.agentId === agentId));
}

function getPersonalityForArchetype(archetype: ArchetypeName): PersonalityProfile | null {
  const archetypeData = personalityData.find((p) => p.name === archetype);
  return archetypeData ? archetypeData.traits : null;
}

function abbreviateModel(model: string): string {
  if (model.includes('claude-')) return model.replace('claude-', 'claude-');
  if (model.includes('gpt-')) return model;
  if (model.length > 24) return model.slice(0, 24) + '...';
  return model;
}

/* ─────────────────────── ease curve ─────────────────────── */

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════════════════════
   AGENTS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Agents() {
  /* ── local state ── */
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');
  const [certFilter, setCertFilter] = useState<CertLevel | 'all'>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  /* ── filter logic ── */
  const filteredAgents = useMemo(() => {
    const q = search.toLowerCase().trim();
    return agentsData.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchCert = certFilter === 'all' || a.certificationLevel === certFilter;
      return matchSearch && matchCat && matchStatus && matchCert;
    });
  }, [search, categoryFilter, statusFilter, certFilter]);

  const activeCount = useMemo(
    () => agentsData.filter((a) => a.status === 'active').length,
    []
  );

  const handleOpenAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setSheetOpen(true);
  }, []);

  /* ── counts per category ── */
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    CATEGORIES.forEach((c) => map.set(c, agentsData.filter((a) => a.category === c).length));
    return map;
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ background: '#070A0E' }}>
      {/* ═══════ HEADER ═══════ */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="shrink-0 px-6 pt-6 pb-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(61,220,151,0.15)',
                }}
              >
                <Bot size={18} style={{ color: '#3DDC97' }} />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#F0F2F5',
                  letterSpacing: '-0.02em',
                }}
              >
                Agents
              </h1>
              <Badge
                variant="outline"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: '#8B95A5',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {activeCount} active &middot; {filteredAgents.length} shown
              </Badge>
            </div>
            <p style={{ color: '#4A5568', fontSize: 13, marginLeft: 48 }}>
              {agentsData.length} agents across {CATEGORIES.length} categories
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#4A5568' }}
            />
            <Input
              placeholder="Search name, ID, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm border-0"
              style={{
                background: '#0C1117',
                color: '#F0F2F5',
                fontFamily: 'var(--font-primary)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={14} style={{ color: '#4A5568' }} />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* ═══════ FILTER BAR ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
        className="shrink-0 px-6 pb-3 flex flex-col gap-3"
      >
        {/* Category pills */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-1.5 pb-1">
            <FilterPill
              label="All"
              count={agentsData.length}
              active={categoryFilter === 'all'}
              onClick={() => setCategoryFilter('all')}
              dotColor="#3DDC97"
            />
            {CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                count={categoryCounts.get(cat) ?? 0}
                active={categoryFilter === cat}
                onClick={() => setCategoryFilter(cat)}
                dotColor={(CATEGORY_MAP[cat] || { color: '#64748B' }).color}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Status + Certification */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span style={{ color: '#4A5568', fontSize: 11, fontWeight: 500, marginRight: 4 }}>
              STATUS
            </span>
            {(['all', ...STATUSES] as const).map((s) => {
              if (s === 'all') {
                return (
                  <FilterMiniPill
                    key="status-all"
                    label="All"
                    active={statusFilter === 'all'}
                    onClick={() => setStatusFilter('all')}
                  />
                );
              }
              const cfg = STATUS_CONFIG[s];
              const StatusIcon = cfg.icon;
              return (
                <FilterMiniPill
                  key={s}
                  label={cfg.label}
                  active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                  dot={<StatusIcon size={10} style={{ color: cfg.color }} />}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: '#4A5568', fontSize: 11, fontWeight: 500, marginRight: 4 }}>
              CERT
            </span>
            {(['all', ...CERT_LEVELS] as const).map((c) => {
              if (c === 'all') {
                return (
                  <FilterMiniPill
                    key="cert-all"
                    label="All"
                    active={certFilter === 'all'}
                    onClick={() => setCertFilter('all')}
                  />
                );
              }
              return (
                <FilterMiniPill
                  key={c}
                  label={c.replace(/_/g, ' ')}
                  active={certFilter === c}
                  onClick={() => setCertFilter(c)}
                  dot={
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: CERT_CONFIG[c].color,
                      }}
                    />
                  }
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══════ AGENT GRID ═══════ */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                onClick={() => handleOpenAgent(agent)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredAgents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Bot size={40} style={{ color: '#4A5568', marginBottom: 12 }} />
            <p style={{ color: '#8B95A5', fontSize: 14 }}>No agents match your filters.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setCertFilter('all');
              }}
              style={{ color: '#3DDC97' }}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* ═══════ DETAIL SHEET ═══════ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="w-full sm:max-w-xl overflow-hidden p-0 border-0"
          style={{
            background: '#070A0E',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {selectedAgent && (
            <AgentDetailPanel
              agent={selectedAgent}
              onClose={() => setSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function AgentCard({
  agent,
  index,
  onClick,
}: {
  agent: Agent;
  index: number;
  onClick: () => void;
}) {
  const cat = CATEGORY_MAP[agent.category] || { color: '#64748B', label: agent.category };
  const statusCfg = STATUS_CONFIG[agent.status];
  const certCfg = CERT_CONFIG[agent.certificationLevel];
  const initials = getInitials(agent.name);

  /* top 3 personality bars from archetype */
  const archetypeTraits = getPersonalityForArchetype(agent.personality);
  const top3 = archetypeTraits
    ? (Object.entries(archetypeTraits) as [keyof PersonalityProfile, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    : [];
  const top3Sum = top3.reduce((s, [, v]) => s + v, 0) || 1;

  const agentTasks = getAgentTasks(agent.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="cursor-pointer group"
      style={{
        background: '#0C1117',
        borderRadius: 12,
        padding: 20,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          borderRadius: 12,
          boxShadow: `inset 0 0 0 1px ${cat.color}30, 0 0 20px ${cat.color}10`,
        }}
      />

      <div className="relative">
        {/* Top row: Avatar + Name + Status */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              background: `${cat.color}18`,
              color: cat.color,
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3
                className="truncate"
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#F0F2F5',
                }}
              >
                {agent.name}
              </h3>
              <StatusDot status={agent.status} />
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4A5568' }}>
                {agent.id}
              </span>
              <span style={{ color: '#4A5568', fontSize: 10 }}>&middot;</span>
              <Badge
                variant="outline"
                className="px-1.5 py-0 h-4 text-[10px]"
                style={{
                  borderColor: `${cat.color}40`,
                  color: cat.color,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                }}
              >
                {agent.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Role */}
        <p style={{ color: '#8B95A5', fontSize: 13, marginBottom: 10 }}>
          {agent.role}
        </p>

        {/* Certification + LLM */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              background: certCfg.bg,
              color: certCfg.color,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Shield size={9} />
            {agent.certificationLevel.replace(/_/g, ' ')}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A5568' }}>
            {agent.llmProvider} &middot; {abbreviateModel(agent.llmModel)}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3">
          <MiniStat icon={CheckCircle} value={agentTasks.length} label="Tasks" />
          <MiniStat icon={TrendingUp} value={`${agent.successRate}%`} label="Success" />
          <MiniStat icon={Zap} value={agent.powerLevel} label="Power" />
        </div>

        {/* Mini personality bar */}
        <div className="flex items-center gap-2">
          <Brain size={11} style={{ color: '#4A5568', flexShrink: 0 }} />
          <div className="flex-1 flex h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {top3.map(([key, val], i) => {
              const meta = PERSONALITY_PARAMS.find((p) => p.key === key);
              const pct = Math.round((val / top3Sum) * 100);
              return (
                <div
                  key={key}
                  style={{
                    width: `${pct}%`,
                    background: meta?.color || '#8B95A5',
                    opacity: 1 - i * 0.2,
                  }}
                  title={`${meta?.label || key}: ${Math.round(val * 100)}`}
                />
              );
            })}
          </div>
          <ChevronRight size={12} style={{ color: '#4A5568' }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mini Stat ─── */

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof CheckCircle;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={11} style={{ color: '#4A5568' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8B95A5', fontWeight: 500 }}>
        {value}
      </span>
      <span style={{ fontSize: 10, color: '#4A5568' }}>{label}</span>
    </div>
  );
}

/* ─── Status Dot ─── */

function StatusDot({ status }: { status: AgentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: 7,
        height: 7,
        background: cfg.color,
        boxShadow: `0 0 6px ${cfg.color}60`,
      }}
      title={cfg.label}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER PILLS
   ═══════════════════════════════════════════════════════════════════════════ */

function FilterPill({
  label,
  count,
  active,
  onClick,
  dotColor,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dotColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0"
      style={{
        background: active ? `${dotColor}20` : 'transparent',
        border: `1px solid ${active ? `${dotColor}50` : 'rgba(255,255,255,0.06)'}`,
        color: active ? dotColor : '#8B95A5',
        fontFamily: 'var(--font-primary)',
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 7, height: 7, background: dotColor }}
      />
      {label}
      <span style={{ color: active ? `${dotColor}90` : '#4A5568', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        {count}
      </span>
    </button>
  );
}

function FilterMiniPill({
  label,
  active,
  onClick,
  dot,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dot?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200"
      style={{
        background: active ? 'rgba(61,220,151,0.12)' : 'transparent',
        border: `1px solid ${active ? 'rgba(61,220,151,0.35)' : 'rgba(255,255,255,0.06)'}`,
        color: active ? '#3DDC97' : '#8B95A5',
        fontFamily: 'var(--font-primary)',
      }}
    >
      {dot}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT DETAIL PANEL (inside Sheet)
   ═══════════════════════════════════════════════════════════════════════════ */

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const cat = CATEGORY_MAP[agent.category] || { color: '#64748B', label: agent.category };
  const certCfg = CERT_CONFIG[agent.certificationLevel];
  const statusCfg = STATUS_CONFIG[agent.status];
  const initials = getInitials(agent.name);
  const agentTasks = getAgentTasks(agent.id);
  const agentWorkflows = getAgentWorkflows(agent.id);
  const archetypeTraits = getPersonalityForArchetype(agent.personality);

  /* Derive closest matching archetype from trait proximity */
  const closestArchetype = useMemo(() => {
    if (!archetypeTraits) return agent.personality;
    let bestMatch = agent.personality;
    let bestScore = -1;
    personalityData.forEach((p) => {
      const traitKeys = Object.keys(p.traits) as (keyof PersonalityProfile)[];
      const score = traitKeys.reduce((sum, k) => {
        return sum - Math.abs((archetypeTraits[k] || 0) - p.traits[k]);
      }, 0);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = p.name;
      }
    });
    return bestMatch;
  }, [archetypeTraits, agent.personality]);

  /* Certification level index */
  const certIndex = CERT_LEVELS.indexOf(agent.certificationLevel);

  return (
    <div className="flex flex-col h-full" style={{ background: '#070A0E' }}>
      {/* Header */}
      <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 56,
                height: 56,
                background: `${cat.color}18`,
                color: cat.color,
                fontFamily: 'var(--font-mono)',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <div>
              <SheetTitle
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#F0F2F5',
                }}
              >
                {agent.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4A5568' }}>
                  {agent.id}
                </span>
                <Badge
                  variant="outline"
                  className="px-1.5 py-0 h-4 text-[10px]"
                  style={{
                    borderColor: `${cat.color}40`,
                    color: cat.color,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {agent.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <StatusDot status={agent.status} />
                  <span style={{ fontSize: 11, color: statusCfg.color }}>{statusCfg.label}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            style={{ color: '#4A5568' }}
          >
            <X size={16} />
          </Button>
        </div>

        {/* Cert badge */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: certCfg.bg,
              color: certCfg.color,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Shield size={11} />
            {agent.certificationLevel.replace(/_/g, ' ')}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${cat.color}15`,
              color: cat.color,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Brain size={11} />
            {agent.personality}
          </span>
        </div>
      </SheetHeader>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-5 space-y-6">
          {/* Info Grid */}
          <InfoGrid agent={agent} />

          {/* Tabs */}
          <Tabs defaultValue="personality" className="w-full">
            <TabsList
              className="w-full h-9 p-0.5 mb-4"
              style={{ background: '#0C1117', borderRadius: 8 }}
            >
              {['personality', 'certification', 'tasks', 'workflows'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 h-full text-[11px] font-medium capitalize data-[state=active]:shadow-none"
                  style={{
                    fontFamily: 'var(--font-primary)',
                    borderRadius: 6,
                    color: '#8B95A5',
                  }}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personality" className="mt-0">
              <PersonalityTab
                archetypeTraits={archetypeTraits}
                archetypeName={agent.personality}
                closestArchetype={closestArchetype}
              />
            </TabsContent>

            <TabsContent value="certification" className="mt-0">
              <CertificationTab
                certLevel={agent.certificationLevel}
                certIndex={certIndex}
                agentId={agent.id}
              />
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <TasksTab tasks={agentTasks} />
            </TabsContent>

            <TabsContent value="workflows" className="mt-0">
              <WorkflowsTab workflows={agentWorkflows} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

/* ─── Info Grid ─── */

function InfoGrid({ agent }: { agent: Agent }) {
  const items = [
    { icon: Code, label: 'Role', value: agent.role },
    { icon: Cpu, label: 'LLM Provider', value: agent.llmProvider },
    { icon: Brain, label: 'Model', value: abbreviateModel(agent.llmModel) },
    { icon: CheckCircle, label: 'Tasks Completed', value: agent.tasksCompleted.toLocaleString() },
    { icon: TrendingUp, label: 'Success Rate', value: `${agent.successRate}%` },
    { icon: Zap, label: 'Power Level', value: `${agent.powerLevel} / 10` },
    { icon: Clock, label: 'Last Active', value: formatDate(agent.lastActive) },
    { icon: Layers, label: 'Archetype', value: agent.personality },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 p-2.5 rounded-lg"
          style={{ background: '#0C1117', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <Icon size={14} style={{ color: '#4A5568', flexShrink: 0 }} />
          <div className="min-w-0">
            <p style={{ fontSize: 10, color: '#4A5568', marginBottom: 1 }}>{label}</p>
            <p
              className="truncate"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8B95A5', fontWeight: 500 }}
            >
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Personality Tab ─── */

function PersonalityTab({
  archetypeTraits,
  archetypeName,
  closestArchetype,
}: {
  archetypeTraits: PersonalityProfile | null;
  archetypeName: ArchetypeName;
  closestArchetype: ArchetypeName;
}) {
  if (!archetypeTraits) {
    return (
      <div className="py-8 text-center">
        <Brain size={28} style={{ color: '#4A5568', margin: '0 auto 8px' }} />
        <p style={{ color: '#8B95A5', fontSize: 13 }}>No personality data available.</p>
      </div>
    );
  }

  const traitEntries = (Object.entries(archetypeTraits) as [keyof PersonalityProfile, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="space-y-4">
      {/* Archetype banner */}
      <div
        className="flex items-center gap-3 p-3 rounded-lg"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
      >
        <Brain size={18} style={{ color: '#A78BFA' }} />
        <div>
          <p style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600 }}>
            {archetypeName} Archetype
          </p>
          <p style={{ fontSize: 11, color: '#8B95A5' }}>
            Closest match: {closestArchetype}
          </p>
        </div>
      </div>

      {/* 12 parameter bars */}
      <div className="space-y-2.5">
        {traitEntries.map(([key, value]) => {
          const meta = PERSONALITY_PARAMS.find((p) => p.key === key);
          const pct = Math.round(value * 100);
          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className="text-right shrink-0"
                style={{
                  width: 110,
                  fontSize: 11,
                  color: '#8B95A5',
                  fontFamily: 'var(--font-primary)',
                }}
              >
                {meta?.label || key}
              </span>
              <div className="flex-1">
                <Progress
                  value={pct}
                  className="h-1.5"
                  style={
                    {
                      '--progress-bg': 'rgba(255,255,255,0.04)',
                      '--progress-fg': meta?.color || '#8B95A5',
                    } as React.CSSProperties
                  }
                />
              </div>
              <span
                className="shrink-0"
                style={{
                  width: 32,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: meta?.color || '#8B95A5',
                  fontWeight: 500,
                }}
              >
                {pct}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Certification Tab ─── */

function CertificationTab({
  certLevel,
  certIndex,
  agentId,
}: {
  certLevel: CertLevel;
  certIndex: number;
  agentId: string;
}) {
  const certInfo = certificationData.find((c) => c.level === certLevel);

  return (
    <div className="space-y-5">
      {/* Progress steps */}
      <div>
        <h4
          className="mb-3"
          style={{ fontSize: 12, color: '#8B95A5', fontWeight: 500, textTransform: 'uppercase' }}
        >
          Certification Progress
        </h4>
        <div className="flex items-center gap-1">
          {CERT_LEVELS.map((level, i) => {
            const cfg = CERT_CONFIG[level];
            const isActive = i <= certIndex;
            const isCurrent = i === certIndex;
            return (
              <div key={level} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full h-1.5 rounded-full transition-all"
                  style={{
                    background: isActive ? cfg.color : 'rgba(255,255,255,0.04)',
                    boxShadow: isCurrent ? `0 0 8px ${cfg.color}60` : 'none',
                  }}
                />
                <span
                  style={{
                    fontSize: 8,
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? cfg.color : '#4A5568',
                    fontWeight: isCurrent ? 600 : 400,
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {level.replace(/_/g, ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current level details */}
      {certInfo && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: `${certInfo.color}08`,
            border: `1px solid ${certInfo.color}20`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award size={14} style={{ color: certInfo.color }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: certInfo.color }}>
              {certInfo.level.replace(/_/g, ' ')}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#8B95A5', lineHeight: 1.5 }}>
            {certInfo.requirements}
          </p>
          <div className="flex gap-4 mt-3">
            <div>
              <p style={{ fontSize: 10, color: '#4A5568' }}>AVG TIME</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8B95A5' }}>
                {certInfo.avgTime}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: '#4A5568' }}>% OF AGENTS</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8B95A5' }}>
                {certInfo.percentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History mock */}
      <div>
        <h4
          className="mb-2"
          style={{ fontSize: 12, color: '#8B95A5', fontWeight: 500, textTransform: 'uppercase' }}
        >
          Certification History
        </h4>
        <div className="space-y-2">
          {[...Array(certIndex + 1)].map((_, i) => {
            const level = CERT_LEVELS[i];
            const cfg = CERT_CONFIG[level];
            const date = new Date();
            date.setDate(date.getDate() - (certIndex - i) * 30);
            return (
              <div
                key={level}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: '#0C1117', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <Shield size={12} style={{ color: cfg.color }} />
                <div className="flex-1">
                  <p style={{ fontSize: 11, color: '#8B95A5' }}>
                    {level.replace(/_/g, ' ')}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A5568' }}>
                  {formatDate(date.toISOString())}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        className="w-full h-9 text-xs font-medium"
        style={{
          background: CERT_CONFIG[certLevel].bg,
          color: CERT_CONFIG[certLevel].color,
          border: `1px solid ${CERT_CONFIG[certLevel].color}30`,
          fontFamily: 'var(--font-primary)',
        }}
        variant="outline"
        onClick={() => alert(`Initiate review for ${agentId}`)}
      >
        <Shield size={13} className="mr-1.5" />
        Initiate Review
      </Button>
    </div>
  );
}

/* ─── Tasks Tab ─── */

function TasksTab({ tasks }: { tasks: typeof tasksData }) {
  const TASK_STATUS_COLORS: Record<string, string> = {
    'todo': '#64748B',
    'in-progress': '#3B82F6',
    'review': '#F5A623',
    'done': '#22C55E',
    'blocked': '#EF4444',
  };

  const TASK_PRIORITY_COLORS: Record<string, string> = {
    'critical': '#EF4444',
    'high': '#F59E0B',
    'medium': '#3B82F6',
    'low': '#64748B',
  };

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center">
        <CheckCircle size={28} style={{ color: '#4A5568', margin: '0 auto 8px' }} />
        <p style={{ color: '#8B95A5', fontSize: 13 }}>No tasks assigned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-3 rounded-lg"
          style={{ background: '#0C1117', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p
              className="flex-1 text-sm truncate"
              style={{ color: '#F0F2F5', fontWeight: 500 }}
              title={task.title}
            >
              {task.title}
            </p>
            <div className="flex gap-1 shrink-0">
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px]"
                style={{
                  borderColor: `${TASK_STATUS_COLORS[task.status]}40`,
                  color: TASK_STATUS_COLORS[task.status],
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {task.status}
              </Badge>
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px]"
                style={{
                  borderColor: `${TASK_PRIORITY_COLORS[task.priority]}40`,
                  color: TASK_PRIORITY_COLORS[task.priority],
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          <p
            className="text-xs mb-2"
            style={{ color: '#4A5568', lineHeight: 1.4 }}
          >
            {task.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Progress value={task.progress} className="h-1" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A5568' }}>
              {task.progress}%
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A5568' }}>
              {task.id}
            </span>
            <span style={{ fontSize: 10, color: '#4A5568' }}>Due: {formatDate(task.dueDate)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Workflows Tab ─── */

function WorkflowsTab({ workflows }: { workflows: typeof workflowsData }) {
  const WF_TYPE_COLORS: Record<string, string> = {
    'sequential': '#3B82F6',
    'hierarchical': '#8B5CF6',
    'debate': '#F59E0B',
    'parallel': '#22C55E',
  };

  if (workflows.length === 0) {
    return (
      <div className="py-8 text-center">
        <Layers size={28} style={{ color: '#4A5568', margin: '0 auto 8px' }} />
        <p style={{ color: '#8B95A5', fontSize: 13 }}>No workflow participation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {workflows.map((wf) => {
        const agentStep = wf.steps.find((s) => agentsData.some((a) => a.id === s.agentId));
        return (
          <div
            key={wf.id}
            className="p-3 rounded-lg"
            style={{ background: '#0C1117', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p
                className="text-sm truncate"
                style={{ color: '#F0F2F5', fontWeight: 500 }}
                title={wf.name}
              >
                {wf.name}
              </p>
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px] shrink-0"
                style={{
                  borderColor: `${WF_TYPE_COLORS[wf.type]}40`,
                  color: WF_TYPE_COLORS[wf.type],
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {wf.type}
              </Badge>
            </div>
            <p
              className="text-xs mb-2"
              style={{ color: '#4A5568', lineHeight: 1.4 }}
            >
              {wf.description}
            </p>
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A5568' }}>
                {wf.id}
              </span>
              {agentStep && (
                <span style={{ fontSize: 10, color: '#8B95A5' }}>
                  Role: <span style={{ color: '#3DDC97' }}>{agentStep.role}</span>
                </span>
              )}
              <span style={{ fontSize: 10, color: '#8B95A5' }}>
                <BarChart3 size={10} className="inline mr-1" />
                {wf.successRate}%
              </span>
              <span style={{ fontSize: 10, color: '#8B95A5' }}>
                {wf.usageCount} runs
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
