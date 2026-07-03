import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Activity,
  Zap,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Settings,
  PlusCircle,
  Power,
  MessageSquare,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Shield,
  RefreshCw,
  Timer,
  TrendingUp,
  Wifi,
  WifiOff,
  ChevronDown,
  Filter,
  Box,
  ServerCrash,
  RotateCcw,
  Hexagon,
  Layers,
  Network,
  BarChart3,
  Lock,
  Unlock,
} from "lucide-react";

/* ─── design tokens ─── */
const BG = "#070A0E";
const SURFACE = "#0C1117";
const SURFACE_HOVER = "#111820";
const ACCENT = "#3DDC97";
const TEXT_PRIMARY = "#F0F2F5";
const TEXT_SECONDARY = "#4A5568";
const BORDER = "rgba(255,255,255,0.06)";

const STATE_COLORS: Record<string, string> = {
  created: "#3B82F6",
  configured: "#8B5CF6",
  active: "#3DDC97",
  paused: "#F5A623",
  error: "#EF4444",
  terminated: "#4A5568",
};

const STATE_LABELS = ["created", "configured", "active", "paused", "error", "terminated"] as const;
type AgentState = (typeof STATE_LABELS)[number];

interface Agent {
  id: string;
  state: AgentState;
  label: string;
}

const AGENTS: Agent[] = [
  { id: "VLT-ANA-9391", state: "active", label: "Analyst" },
  { id: "VLT-GES-4196", state: "active", label: "Gestalt" },
  { id: "VLT-DEV-2847", state: "configured", label: "Developer" },
  { id: "VLT-MKT-1156", state: "paused", label: "Marketer" },
  { id: "VLT-ENT-7734", state: "error", label: "Enterprise" },
];

const EVENTS = [
  { time: "14:32:01", channel: "agent:status", message: "VLT-ANA-9391 → ACTIVE", type: "success" },
  { time: "14:31:45", channel: "agent:task", message: "Task TSK-001 assigned to VLT-ANA-9391", type: "info" },
  { time: "14:31:44", channel: "agent:result", message: "VLT-GES-4196 completed health analysis", type: "success" },
  { time: "14:30:12", channel: "agent:error", message: "VLT-ENT-7734 API timeout (circuit breaker opened)", type: "error" },
  { time: "14:29:58", channel: "workflow:step", message: "WF-003 step 3/5 executing", type: "info" },
  { time: "14:29:30", channel: "agent:status", message: "VLT-DEV-2847 → CONFIGURED", type: "info" },
  { time: "14:28:15", channel: "agent:task", message: "Task TSK-002 assigned to VLT-GES-4196", type: "info" },
  { time: "14:27:50", channel: "workflow:trigger", message: "Workflow WF-004 triggered by cron", type: "info" },
  { time: "14:26:22", channel: "agent:result", message: "VLT-ANA-9391 generated report RPT-089", type: "success" },
  { time: "14:25:10", channel: "agent:error", message: "VLT-ENT-7734 rate limit exceeded (retry 2/5)", type: "warning" },
  { time: "14:24:45", channel: "agent:status", message: "VLT-MKT-1156 → PAUSED", type: "warning" },
  { time: "14:23:30", channel: "workflow:step", message: "WF-002 step 5/5 completed", type: "success" },
  { time: "14:22:18", channel: "agent:task", message: "Task TSK-003 assigned to VLT-DEV-2847", type: "info" },
  { time: "14:21:05", channel: "agent:error", message: "VLT-ENT-7734 connection reset", type: "error" },
  { time: "14:20:00", channel: "workflow:trigger", message: "Workflow WF-005 triggered manually", type: "info" },
];

const CIRCUIT_CONFIG = {
  failureThreshold: 3,
  openDuration: 30,
  halfOpenRequests: 1,
  target: "api.anthropic.com",
  status: "CLOSED" as "CLOSED" | "OPEN" | "HALF_OPEN",
  successRate: 99.7,
  lastFailure: "2025-06-17 13:45:22",
  totalCalls: 48291,
  failures1h: 2,
};

const RETRY_PATTERN = [1, 2, 4, 8, 16];
const RETRY_STATS = { maxRetries: 5, deadLetter: 12, retriedToday: 847 };

const FORSETI_DIMENSIONS = [
  { label: "InformationAccess", value: 9, max: 10 },
  { label: "ResourceControl", value: 7, max: 10 },
  { label: "AuthorityPermission", value: 5, max: 10 },
  { label: "NetworkPosition", value: 6, max: 10 },
  { label: "SynthesisApplication", value: 4, max: 10 },
];

/* ─── small helpers ─── */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ═════════════════════════════════════════════════════════════════
   Section Card Wrapper
   ═════════════════════════════════════════════════════════════════ */
function SectionCard({
  title,
  icon: Icon,
  children,
  className,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("rounded-xl border overflow-hidden", className)}
      style={{ backgroundColor: SURFACE, borderColor: BORDER }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" style={{ color: ACCENT }} />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: TEXT_PRIMARY, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {title}
          </span>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   1. Page Header
   ═════════════════════════════════════════════════════════════════ */
function PageHeader() {
  const stats = [
    { label: "Active Agents", value: "2", icon: PlayCircle, color: "#3DDC97" },
    { label: "Configured", value: "1", icon: Settings, color: "#8B5CF6" },
    { label: "Paused", value: "1", icon: PauseCircle, color: "#F5A623" },
    { label: "Errors", value: "1", icon: AlertTriangle, color: "#EF4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <Network className="w-5 h-5" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT_PRIMARY, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Agent Orchestrator
          </h1>
          <p className="text-xs mt-0.5" style={{ color: TEXT_SECONDARY }}>
            Valtheron Agentic Workspace — Distributed State Machine &amp; Message Broker
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: "rgba(61,220,151,0.1)", color: ACCENT }}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="rounded-lg p-3 flex items-center gap-3"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <s.icon className="w-4 h-4" style={{ color: s.color }} />
            <div>
              <div className="text-lg font-bold leading-none" style={{ color: TEXT_PRIMARY }}>
                {s.value}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: TEXT_SECONDARY }}>
                {s.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   2. Agent State Machine Diagram
   ═════════════════════════════════════════════════════════════════ */
function StateMachineDiagram() {
  const nodePositions = [
    { x: 50, y: 80 },   // created
    { x: 200, y: 80 },  // configured
    { x: 350, y: 80 },  // active
    { x: 350, y: 200 }, // paused
    { x: 200, y: 200 }, // error
    { x: 50, y: 200 },  // terminated
  ];

  const transitions = [
    { from: 0, to: 1, label: "configure" },
    { from: 1, to: 2, label: "start" },
    { from: 2, to: 3, label: "pause" },
    { from: 2, to: 4, label: "fail" },
    { from: 3, to: 2, label: "resume" },
    { from: 4, to: 2, label: "recover" },
    { from: 4, to: 5, label: "terminate" },
    { from: 3, to: 5, label: "terminate" },
    { from: 1, to: 0, label: "reset", curved: true },
  ];

  const stateIcons = [PlusCircle, Settings, PlayCircle, PauseCircle, AlertTriangle, Power];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 440 280" className="w-full min-w-[400px]" style={{ maxHeight: 300 }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={TEXT_SECONDARY} opacity="0.5" />
          </marker>
        </defs>

        {/* Transitions */}
        {transitions.map((t, i) => {
          const from = nodePositions[t.from];
          const to = nodePositions[t.to];
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;

          if (t.curved) {
            const c1x = from.x;
            const c1y = (from.y + to.y) / 2 - 30;
            const c2x = to.x;
            const c2y = (from.y + to.y) / 2 - 30;
            return (
              <g key={i}>
                <path
                  d={`M ${from.x} ${from.y + 18} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y - 18}`}
                  fill="none"
                  stroke={TEXT_SECONDARY}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.4"
                  markerEnd="url(#arrowhead)"
                />
                <text x={mx} y={my - 22} textAnchor="middle" fill={TEXT_SECONDARY} fontSize="9" opacity="0.7">
                  {t.label}
                </text>
              </g>
            );
          }

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / len;
          const ny = dy / len;
          const startX = from.x + nx * 24;
          const startY = from.y + ny * 24;
          const endX = to.x - nx * 24;
          const endY = to.y - ny * 24;

          return (
            <g key={i}>
              <line
                x1={startX} y1={startY} x2={endX} y2={endY}
                stroke={TEXT_SECONDARY}
                strokeWidth="1.5"
                opacity="0.4"
                markerEnd="url(#arrowhead)"
              />
              <text x={mx + (dy !== 0 ? 12 : 0)} y={my + (dx !== 0 ? -8 : 0)} textAnchor="middle" fill={TEXT_SECONDARY} fontSize="9" opacity="0.7">
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {STATE_LABELS.map((state, i) => {
          const pos = nodePositions[i];
          const color = STATE_COLORS[state];
          const IconComp = stateIcons[i];
          const cx = pos.x;
          const cy = pos.y;

          return (
            <g key={state}>
              {/* Glow ring for emphasis */}
              <circle cx={cx} cy={cy} r="26" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
              {/* Main circle */}
              <circle cx={cx} cy={cy} r="22" fill={SURFACE} stroke={color} strokeWidth="2" />
              {/* Icon placeholder — using foreignObject for Lucide icons */}
              <foreignObject x={cx - 8} y={cy - 8} width={16} height={16}>
                <div style={{ color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconComp className="w-4 h-4" />
                </div>
              </foreignObject>
              {/* Label */}
              <text
                x={cx}
                y={cy + 36}
                textAnchor="middle"
                fill={TEXT_PRIMARY}
                fontSize="10"
                fontWeight="600"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {state.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Agent List */}
      <div className="mt-4 space-y-2">
        {AGENTS.map((agent, i) => {
          const color = STATE_COLORS[agent.state];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{ backgroundColor: SURFACE_HOVER, border: `1px solid ${BORDER}` }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span
                className="text-xs font-semibold w-28 flex-shrink-0"
                style={{ color: TEXT_PRIMARY, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {agent.id}
              </span>
              <span className="text-xs flex-shrink-0" style={{ color: TEXT_SECONDARY }}>
                {agent.label}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase"
                  style={{
                    backgroundColor: `${color}15`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {agent.state}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   3. Message Broker / Event Stream
   ═════════════════════════════════════════════════════════════════ */
function EventStream() {
  const [filter, setFilter] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const channels = [
    { name: "agent:status", color: "#3B82F6" },
    { name: "agent:task", color: "#8B5CF6" },
    { name: "agent:result", color: "#3DDC97" },
    { name: "agent:error", color: "#EF4444" },
    { name: "workflow:trigger", color: "#F5A623" },
    { name: "workflow:step", color: "#06B6D4" },
  ];

  const filteredEvents = filter ? EVENTS.filter((e) => e.channel === filter) : EVENTS;

  const eventTypeColor = (type: string) => {
    switch (type) {
      case "success": return "#3DDC97";
      case "error": return "#EF4444";
      case "warning": return "#F5A623";
      default: return "#8B5CF6";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [filter]);

  return (
    <div>
      {/* Channel filters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "text-[10px] px-2 py-1 rounded-md font-medium transition-colors",
            !filter && "ring-1"
          )}
          style={{
            backgroundColor: !filter ? `${ACCENT}15` : SURFACE_HOVER,
            color: !filter ? ACCENT : TEXT_SECONDARY,
            border: `1px solid ${!filter ? `${ACCENT}40` : BORDER}`,
          }}
        >
          ALL
        </button>
        {channels.map((ch) => (
          <button
            key={ch.name}
            onClick={() => setFilter(ch.name)}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md font-medium transition-colors",
              filter === ch.name && "ring-1"
            )}
            style={{
              backgroundColor: filter === ch.name ? `${ch.color}15` : SURFACE_HOVER,
              color: filter === ch.name ? ch.color : TEXT_SECONDARY,
              border: `1px solid ${filter === ch.name ? `${ch.color}40` : BORDER}`,
            }}
          >
            {ch.name}
          </button>
        ))}
      </div>

      {/* Event log */}
      <div
        ref={scrollRef}
        className="rounded-lg overflow-y-auto max-h-[320px] space-y-0.5 pr-1"
        style={{ backgroundColor: BG }}
      >
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, i) => (
            <motion.div
              key={`${event.time}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/[0.02] transition-colors"
            >
              <span
                className="text-[10px] w-16 flex-shrink-0"
                style={{ color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {event.time}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 w-28 text-center"
                style={{
                  backgroundColor: `${channels.find((c) => c.name === event.channel)?.color || ACCENT}15`,
                  color: channels.find((c) => c.name === event.channel)?.color || ACCENT,
                  border: `1px solid ${channels.find((c) => c.name === event.channel)?.color || ACCENT}30`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                }}
              >
                {event.channel}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: eventTypeColor(event.type) }}
              />
              <span className="text-[11px] truncate" style={{ color: TEXT_PRIMARY }}>
                {event.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   4. Circuit Breaker Visualizer
   ═════════════════════════════════════════════════════════════════ */
function CircuitBreakerVisualizer() {
  const status = CIRCUIT_CONFIG.status;
  const isClosed = status === "CLOSED";
  const isOpen = status === "OPEN";
  const isHalfOpen = status === "HALF_OPEN";

  const statusColor = isClosed ? "#3DDC97" : isOpen ? "#EF4444" : "#F5A623";
  const StatusIcon = isClosed ? ShieldCheck : isOpen ? ShieldAlert : Shield;

  return (
    <div>
      {/* Status Banner */}
      <motion.div
        className="rounded-lg p-4 mb-4 flex items-center gap-4"
        style={{
          backgroundColor: `${statusColor}10`,
          border: `1px solid ${statusColor}30`,
        }}
        animate={{ boxShadow: [`0 0 0px ${statusColor}00`, `0 0 12px ${statusColor}20`, `0 0 0px ${statusColor}00`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <StatusIcon className="w-8 h-8" style={{ color: statusColor }} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: statusColor, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {status}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
              {isClosed ? "All systems operational" : isOpen ? "Service degraded" : "Testing connectivity"}
            </span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: TEXT_SECONDARY }}>
            Target: {CIRCUIT_CONFIG.target}
          </p>
        </div>
      </motion.div>

      {/* Visual Circuit Representation */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 280 80" className="w-full max-w-[280px]">
          {/* Left endpoint */}
          <circle cx="20" cy="40" r="8" fill={SURFACE} stroke={statusColor} strokeWidth="2" />
          {/* Right endpoint */}
          <circle cx="260" cy="40" r="8" fill={SURFACE} stroke={statusColor} strokeWidth="2" />
          {/* Wire left */}
          <line x1="28" y1="40" x2="110" y2="40" stroke={statusColor} strokeWidth="2" opacity="0.6" />
          {/* Wire right */}
          <line x1="170" y1="40" x2="252" y2="40" stroke={statusColor} strokeWidth="2" opacity="0.6" />

          {isClosed && (
            <>
              {/* Closed switch — connected line */}
              <line x1="110" y1="40" x2="170" y2="40" stroke={statusColor} strokeWidth="3" />
              <circle cx="140" cy="40" r="14" fill={`${statusColor}20`} stroke={statusColor} strokeWidth="2" />
              <text x="140" y="44" textAnchor="middle" fill={statusColor} fontSize="10" fontWeight="bold">
                OK
              </text>
            </>
          )}

          {isOpen && (
            <>
              {/* Open switch — gap */}
              <line x1="110" y1="40" x2="125" y2="25" stroke="#EF4444" strokeWidth="3" />
              <line x1="155" y1="25" x2="170" y2="40" stroke="#EF4444" strokeWidth="3" />
              <circle cx="140" cy="25" r="14" fill={`#EF444420`} stroke="#EF4444" strokeWidth="2" />
              <text x="140" y="29" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">
                X
              </text>
            </>
          )}

          {isHalfOpen && (
            <>
              <line x1="110" y1="40" x2="135" y2="32" stroke="#F5A623" strokeWidth="3" />
              <line x1="145" y1="32" x2="170" y2="40" stroke="#F5A623" strokeWidth="3" />
              <circle cx="140" cy="32" r="14" fill={`#F5A62320`} stroke="#F5A623" strokeWidth="2" />
              <text x="140" y="36" textAnchor="middle" fill="#F5A623" fontSize="9" fontWeight="bold">
                ?
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Success Rate", value: `${CIRCUIT_CONFIG.successRate}%`, icon: TrendingUp, color: "#3DDC97" },
          { label: "Total Calls", value: CIRCUIT_CONFIG.totalCalls.toLocaleString(), icon: Activity, color: "#3B82F6" },
          { label: "Failures (1h)", value: String(CIRCUIT_CONFIG.failures1h), icon: AlertTriangle, color: "#EF4444" },
          { label: "Last Failure", value: CIRCUIT_CONFIG.lastFailure.split(" ")[1], icon: Timer, color: "#F5A623" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="rounded-lg p-3 flex items-center gap-2.5"
            style={{ backgroundColor: SURFACE_HOVER, border: `1px solid ${BORDER}` }}
          >
            <stat.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: stat.color }} />
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: TEXT_PRIMARY, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {stat.value}
              </div>
              <div className="text-[10px]" style={{ color: TEXT_SECONDARY }}>
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Config summary */}
      <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: BG }}>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Failure Threshold", value: CIRCUIT_CONFIG.failureThreshold },
            { label: "Open Duration", value: `${CIRCUIT_CONFIG.openDuration}s` },
            { label: "Half-Open Req.", value: CIRCUIT_CONFIG.halfOpenRequests },
          ].map((cfg) => (
            <div key={cfg.label}>
              <div className="text-[10px]" style={{ color: TEXT_SECONDARY }}>
                {cfg.label}
              </div>
              <div
                className="text-xs font-semibold mt-0.5"
                style={{ color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {cfg.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   5. Exponential Backoff Retry Visualizer
   ═════════════════════════════════════════════════════════════════ */
function RetryVisualizer() {
  const maxBarWidth = 100;

  return (
    <div>
      {/* Retry timeline */}
      <div className="space-y-2.5">
        {RETRY_PATTERN.map((delay, i) => {
          const barWidth = (delay / 16) * maxBarWidth;
          const isDeadLetter = i === RETRY_PATTERN.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span
                className="text-[10px] w-12 text-right flex-shrink-0"
                style={{ color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {i + 1}x
              </span>
              <div className="flex-1 h-6 rounded-md overflow-hidden relative" style={{ backgroundColor: BG }}>
                <motion.div
                  className="h-full rounded-md flex items-center px-2"
                  style={{
                    backgroundColor: isDeadLetter ? "#EF444430" : `${ACCENT}${20 + i * 10}`,
                    border: `1px solid ${isDeadLetter ? "#EF4444" : ACCENT}`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: "easeOut" }}
                >
                  <span
                    className="text-[10px] font-semibold whitespace-nowrap"
                    style={{ color: isDeadLetter ? "#EF4444" : ACCENT }}
                  >
                    {delay}s
                  </span>
                </motion.div>
              </div>
              <RotateCcw
                className="w-3 h-3 flex-shrink-0"
                style={{ color: isDeadLetter ? "#EF4444" : ACCENT, opacity: 0.6 }}
              />
            </motion.div>
          );
        })}

        {/* Dead Letter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 rounded-lg p-3 mt-2"
          style={{
            backgroundColor: "#EF444410",
            border: "1px solid #EF444430",
          }}
        >
          <ServerCrash className="w-4 h-4 flex-shrink-0" style={{ color: "#EF4444" }} />
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#EF4444" }}>
              Dead Letter Queue
            </div>
            <div className="text-[11px]" style={{ color: TEXT_SECONDARY }}>
              Messages that exceeded max retries
            </div>
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {RETRY_STATS.deadLetter}
          </span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: SURFACE_HOVER, border: `1px solid ${BORDER}` }}>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: TEXT_SECONDARY }}>
            Max Retries
          </div>
          <div className="text-lg font-bold mt-0.5" style={{ color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>
            {RETRY_STATS.maxRetries}
          </div>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: SURFACE_HOVER, border: `1px solid ${BORDER}` }}>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: TEXT_SECONDARY }}>
            Retried Today
          </div>
          <div className="text-lg font-bold mt-0.5" style={{ color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>
            {RETRY_STATS.retriedToday}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   6. Forseti Power Dimensions — 5D Radar Chart
   ═════════════════════════════════════════════════════════════════ */
function ForsetiRadar() {
  const svgSize = 220;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = 80;
  const n = FORSETI_DIMENSIONS.length;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointFor = (i: number, value: number, max: number) => {
    const angle = angleFor(i);
    const r = (value / max) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Build polygon path for data
  const dataPoints = FORSETI_DIMENSIONS.map((d, i) => pointFor(i, d.value, d.max));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Short labels for radar axes
  const shortLabels = ["INFO", "RSC", "AUTH", "NET", "SYNTH"];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3">
        <Hexagon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
        <span className="text-xs font-semibold" style={{ color: TEXT_PRIMARY }}>
          VLT-ANA-9391 (Analyst)
        </span>
      </div>

      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-[220px]">
        {/* Background grid */}
        {levels.map((level) => {
          const levelPoints = Array.from({ length: n }, (_, i) => {
            const angle = angleFor(i);
            const r = level * radius;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={levelPoints}
              fill="none"
              stroke={TEXT_SECONDARY}
              strokeWidth="0.5"
              opacity="0.25"
            />
          );
        })}

        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const angle = angleFor(i);
          const x2 = cx + radius * Math.cos(angle);
          const y2 = cy + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={cx} y1={cy} x2={x2} y2={y2}
              stroke={TEXT_SECONDARY}
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          d={dataPath}
          fill={`${ACCENT}18`}
          stroke={ACCENT}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y} r="4"
            fill={SURFACE}
            stroke={ACCENT}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}

        {/* Axis labels */}
        {shortLabels.map((label, i) => {
          const angle = angleFor(i);
          const labelR = radius + 18;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <text
              key={label}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={TEXT_SECONDARY}
              fontSize="8"
              fontWeight="600"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {label}
            </text>
          );
        })}

        {/* Level labels */}
        {levels.map((level) => {
          const r = level * radius;
          return (
            <text
              key={level}
              x={cx + 4} y={cy - r}
              fill={TEXT_SECONDARY}
              fontSize="7"
              opacity="0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {Math.round(level * 10)}
            </text>
          );
        })}
      </svg>

      {/* Dimension breakdown bars */}
      <div className="w-full mt-4 space-y-2">
        {FORSETI_DIMENSIONS.map((dim, i) => (
          <motion.div
            key={dim.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium" style={{ color: TEXT_SECONDARY }}>
                {dim.label}
              </span>
              <span
                className="text-[10px] font-bold"
                style={{ color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {dim.value}/{dim.max}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: BG }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: ACCENT }}
                initial={{ width: 0 }}
                animate={{ width: `${(dim.value / dim.max) * 100}%` }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   Main Orchestrator Page
   ═════════════════════════════════════════════════════════════════ */
export default function Orchestrator() {
  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        {/* Top Row: State Machine + Event Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <SectionCard title="Agent State Machine" icon={Cpu}>
            <StateMachineDiagram />
          </SectionCard>

          <SectionCard
            title="Message Broker / Event Stream"
            icon={Radio}
            action={
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
                <span className="text-[10px]" style={{ color: ACCENT }}>
                  LIVE
                </span>
              </div>
            }
          >
            <EventStream />
          </SectionCard>
        </div>

        {/* Bottom Row: Circuit Breaker + Retry + Forseti */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Circuit Breaker" icon={ShieldCheck}>
            <CircuitBreakerVisualizer />
          </SectionCard>

          <SectionCard title="Exponential Backoff Retry" icon={RefreshCw}>
            <RetryVisualizer />
          </SectionCard>

          <SectionCard title="Forseti Power Dimensions" icon={BarChart3}>
            <ForsetiRadar />
          </SectionCard>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[10px]" style={{ color: TEXT_SECONDARY }}>
            Valtheron Agentic Workspace v1.0 — Agent Orchestrator Module
          </p>
        </div>
      </div>
    </div>
  );
}
