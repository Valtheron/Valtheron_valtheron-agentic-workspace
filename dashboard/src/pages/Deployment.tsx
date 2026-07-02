import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  Box,
  Layers,
  Server,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
  Copy,
  Check,
  CircleDot,
  Timer,
  Zap,
  MemoryStick,
  Network,
  Shield,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

/* ────────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────── */

const clusterCards = [
  {
    icon: Cloud,
    iconColor: "#326CE5",
    title: "valtheron-prod",
    subtitle: "Namespace",
    rows: [
      { label: "Cluster", value: "gke-valtheron-prod-01" },
      { label: "Version", value: "1.29.4-gke.1043002" },
      { label: "Nodes", value: "3 (all Ready)" },
      { label: "Pods", value: "12/15 Running" },
    ],
  },
  {
    icon: Database,
    iconColor: "#336791",
    title: "PostgreSQL",
    subtitle: "bitnami/postgresql",
    rows: [
      { label: "Chart", value: "postgresql-15.2.0" },
      { label: "Replicas", value: "1/1" },
      { label: "PVC", value: "10Gi" },
      { label: "Status", value: "Running" },
    ],
  },
  {
    icon: Box,
    iconColor: "#3DDC97",
    title: "Valtheron Backend",
    subtitle: "valtheron/backend:v2.0.0",
    rows: [
      { label: "Replicas", value: "3/3" },
      { label: "Service", value: "ClusterIP:3000" },
      { label: "Image", value: "valtheron/backend:v2.0.0" },
      { label: "Status", value: "Running" },
    ],
  },
  {
    icon: Layers,
    iconColor: "#DC382D",
    title: "Redis",
    subtitle: "bitnami/redis",
    rows: [
      { label: "Chart", value: "redis-19.0.0" },
      { label: "Master", value: "1/1" },
      { label: "Replicas", value: "2/2" },
      { label: "Status", value: "Running" },
    ],
  },
];

const pods = [
  {
    name: "valtheron-backend-7d9f4b8c5-x2v4p",
    status: "Running",
    restarts: 0,
    age: "15d",
    cpu: "180m",
    memory: "420Mi",
  },
  {
    name: "valtheron-backend-7d9f4b8c5-k9m2w",
    status: "Running",
    restarts: 1,
    age: "15d",
    cpu: "220m",
    memory: "510Mi",
  },
  {
    name: "valtheron-backend-7d9f4b8c5-p5n7q",
    status: "Running",
    restarts: 0,
    age: "15d",
    cpu: "195m",
    memory: "480Mi",
  },
  {
    name: "valtheron-postgresql-0",
    status: "Running",
    restarts: 0,
    age: "23d",
    cpu: "340m",
    memory: "890Mi",
  },
  {
    name: "valtheron-redis-master-0",
    status: "Running",
    restarts: 0,
    age: "23d",
    cpu: "120m",
    memory: "280Mi",
  },
  {
    name: "valtheron-redis-replicas-0",
    status: "Running",
    restarts: 0,
    age: "23d",
    cpu: "85m",
    memory: "210Mi",
  },
  {
    name: "valtheron-redis-replicas-1",
    status: "Running",
    restarts: 0,
    age: "23d",
    cpu: "90m",
    memory: "220Mi",
  },
  {
    name: "valtheron-minio-7c4f9d2b8-x1v3p",
    status: "Running",
    restarts: 2,
    age: "8d",
    cpu: "150m",
    memory: "380Mi",
  },
  {
    name: "valtheron-nginx-ingress-5k8m2",
    status: "Running",
    restarts: 0,
    age: "30d",
    cpu: "45m",
    memory: "120Mi",
  },
];

const helmYaml = `backend:
  replicaCount: 3
  resources:
    requests:
      cpu: "200m"
      memory: "512Mi"
    limits:
      cpu: "500m"
      memory: "1Gi"
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
  probes:
    liveness:
      path: /api/health
      periodSeconds: 10
      failureThreshold: 3
    readiness:
      path: /api/ready
      periodSeconds: 5
      failureThreshold: 3`;

const resourceQuotas = [
  {
    label: "CPU Requests",
    used: 1425,
    total: 4000,
    unit: "m",
    pct: 35.6,
    color: "#3DDC97",
    icon: Cpu,
  },
  {
    label: "CPU Limits",
    used: 3210,
    total: 8000,
    unit: "m",
    pct: 40.1,
    color: "#326CE5",
    icon: Zap,
  },
  {
    label: "Memory Requests",
    used: 3.31,
    total: 12,
    unit: "Gi",
    pct: 27.6,
    color: "#3DDC97",
    icon: MemoryStick,
  },
  {
    label: "Memory Limits",
    used: 6.82,
    total: 16,
    unit: "Gi",
    pct: 42.6,
    color: "#326CE5",
    icon: HardDrive,
  },
  {
    label: "Pods",
    used: 9,
    total: 20,
    unit: "",
    pct: 45.0,
    color: "#F5A623",
    icon: Server,
  },
  {
    label: "Services",
    used: 4,
    total: 10,
    unit: "",
    pct: 40.0,
    color: "#F5A623",
    icon: Network,
  },
];

/* ────────────────────────────────────────────────
   Helper: Status icon + color
   ──────────────────────────────────────────────── */
function getStatusConfig(status: string, restarts: number) {
  if (status === "Running" && restarts === 0) {
    return { Icon: CheckCircle2, color: "#3DDC97", bg: "rgba(61,220,151,0.12)" };
  }
  if (status === "Running" && restarts > 0) {
    return { Icon: AlertTriangle, color: "#F5A623", bg: "rgba(245,166,35,0.12)" };
  }
  if (status === "Pending") {
    return { Icon: Timer, color: "#F5A623", bg: "rgba(245,166,35,0.12)" };
  }
  return { Icon: XCircle, color: "#EF4444", bg: "rgba(239,68,68,0.12)" };
}

/* ────────────────────────────────────────────────
   Helm YAML syntax highlighter
   ──────────────────────────────────────────────── */
function highlightYaml(yaml: string) {
  return yaml.split("\n").map((line, i) => {
    const indent = line.match(/^(\s*)/)?.[1] ?? "";
    const trimmed = line.trim();

    if (trimmed === "") {
      return (
        <div key={i} className="h-2" />
      );
    }

    if (trimmed.startsWith("#")) {
      return (
        <div key={i} className="text-[#4A5568] font-mono text-xs leading-5">
          {indent}
          {trimmed}
        </div>
      );
    }

    // key: value
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) {
      return (
        <div key={i} className="font-mono text-xs leading-5">
          {indent}
          {trimmed}
        </div>
      );
    }

    const key = trimmed.slice(0, colonIdx + 1);
    const value = trimmed.slice(colonIdx + 1);

    let valueColor = "#A0AEC0";
    const valTrim = value.trim();
    if (valTrim.startsWith('"') && valTrim.endsWith('"')) {
      valueColor = "#68D391";
    } else if (valTrim === "true" || valTrim === "false") {
      valueColor = "#63B3ED";
    } else if (/^\d+$/.test(valTrim)) {
      valueColor = "#F6AD55";
    }

    return (
      <div key={i} className="font-mono text-xs leading-5">
        {indent}
        <span className="text-[#63B3ED]">{key}</span>
        <span style={{ color: valueColor }}>{value}</span>
      </div>
    );
  });
}

/* ────────────────────────────────────────────────
   HPA Gauge Component
   ──────────────────────────────────────────────── */
function HPAGauge() {
  const targetCpu = 70;
  const currentCpu = 58;
  const utilizationPct = (currentCpu / targetCpu) * 100;
  const clampedPct = Math.min(utilizationPct, 100);

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="rounded-xl border p-6"
      style={{ backgroundColor: "#0C1117", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(61,220,151,0.12)" }}
        >
          <ArrowUpDown size={20} style={{ color: "#3DDC97" }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}>
            Horizontal Pod Autoscaler
          </h3>
          <p className="text-xs" style={{ color: "#4A5568" }}>
            Target: valtheron-backend
          </p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-48 h-24">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              stroke="rgba(255,255,255,0.06)"
            />
            {/* Filled arc */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              stroke={currentCpu >= targetCpu ? "#EF4444" : "#3DDC97"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: clampedPct / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.3 }}
              style={{ transformOrigin: "100px 100px", transform: "rotate(180deg)" }}
            />
            {/* Center text */}
            <text x="100" y="95" textAnchor="middle" fill="#F0F2F5" fontSize="24" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
              {currentCpu}%
            </text>
            <text x="100" y="108" textAnchor="middle" fill="#4A5568" fontSize="9" fontFamily="'Inter', sans-serif">
              of {targetCpu}% target
            </text>
          </svg>
        </div>
        <div className="mt-2 text-sm" style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}>
          <span style={{ color: "#3DDC97" }}>{utilizationPct.toFixed(1)}%</span>
          {" "}
          <span style={{ color: "#4A5568" }}>utilization</span>
        </div>
      </div>

      {/* HPA Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Min Replicas", value: "3" },
          { label: "Max Replicas", value: "10" },
          { label: "Current", value: "3 replicas" },
          { label: "Target CPU", value: `${targetCpu}%` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-3"
            style={{ backgroundColor: "#111820" }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#4A5568" }}>
              {item.label}
            </p>
            <p className="text-sm font-semibold" style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Last Scale */}
      <div
        className="mt-4 flex items-center gap-2 rounded-lg p-3"
        style={{ backgroundColor: "#111820" }}
      >
        <RefreshCw size={14} style={{ color: "#4A5568" }} />
        <p className="text-xs" style={{ color: "#4A5568" }}>
          Last Scale: 2025-06-15 03:22:10 (scaled up 2→3)
        </p>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────── */
export default function Deployment() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(helmYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full px-6 py-8" style={{ backgroundColor: "#070A0E" }}>
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(50,108,229,0.15)" }}
          >
            <Shield size={18} style={{ color: "#326CE5" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Kubernetes Deployment
            </h1>
            <p className="text-sm" style={{ color: "#4A5568" }}>
              Valtheron Agentic Workspace — Cluster Overview
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "#4A5568" }}>
          <span>valtheron-prod</span>
          <ChevronRight size={12} />
          <span>deployments</span>
          <ChevronRight size={12} />
          <span style={{ color: "#3DDC97" }}>overview</span>
        </div>
      </motion.div>

      {/* ── Cluster Overview Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        {clusterCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-xl border p-5 cursor-default"
              style={{ backgroundColor: "#0C1117", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.iconColor}20` }}
                >
                  <Icon size={20} style={{ color: card.iconColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "#F0F2F5" }}>
                    {card.title}
                  </h3>
                  <p className="text-[11px]" style={{ color: "#4A5568" }}>
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {card.rows.map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[11px]" style={{ color: "#4A5568" }}>
                      {row.label}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: row.label === "Status" && row.value === "Running" ? "#3DDC97" : "#F0F2F5",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Pod Status Grid ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(61,220,151,0.12)" }}
          >
            <CircleDot size={16} style={{ color: "#3DDC97" }} />
          </div>
          <h2
            className="text-lg font-bold"
            style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Pod Status
          </h2>
          <span
            className="ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "rgba(61,220,151,0.12)", color: "#3DDC97" }}
          >
            {pods.length} pods
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
        >
          {pods.map((pod, i) => {
            const { Icon, color, bg } = getStatusConfig(pod.status, pod.restarts);
            const cpuNum = parseInt(pod.cpu);
            const memNum = parseInt(pod.memory);

            return (
              <motion.div
                key={pod.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                className="rounded-xl border p-4"
                style={{ backgroundColor: "#0C1117", borderColor: "rgba(255,255,255,0.06)" }}
              >
                {/* Pod name + status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {pod.name}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 flex-shrink-0 ml-2"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={10} style={{ color }} />
                    <span className="text-[10px] font-medium" style={{ color }}>
                      {pod.restarts > 0 ? `${pod.status} (${pod.restarts})` : pod.status}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="rounded-md p-2" style={{ backgroundColor: "#111820" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "#4A5568" }}>
                      Age
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "#F0F2F5" }}>
                      {pod.age}
                    </p>
                  </div>
                  <div className="rounded-md p-2" style={{ backgroundColor: "#111820" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "#4A5568" }}>
                      CPU
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "#3DDC97", fontFamily: "'JetBrains Mono', monospace" }}>
                      {pod.cpu}
                    </p>
                  </div>
                  <div className="rounded-md p-2" style={{ backgroundColor: "#111820" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "#4A5568" }}>
                      Memory
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "#63B3ED", fontFamily: "'JetBrains Mono', monospace" }}>
                      {pod.memory}
                    </p>
                  </div>
                  <div className="rounded-md p-2" style={{ backgroundColor: "#111820" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "#4A5568" }}>
                      Restarts
                    </p>
                    <p
                      className="text-xs font-semibold"
                      style={{
                        color: pod.restarts > 0 ? "#F5A623" : "#F0F2F5",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {pod.restarts}
                    </p>
                  </div>
                </div>

                {/* Mini bars */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((cpuNum / 500) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: "#3DDC97" }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((memNum / 1024) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: "#63B3ED" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── HPA + Helm (2-column) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* HPA Gauge */}
        <HPAGauge />

        {/* Helm Values Viewer */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "#0C1117", borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(50,108,229,0.15)" }}
              >
                <Activity size={20} style={{ color: "#326CE5" }} />
              </div>
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Helm Values
                </h3>
                <p className="text-xs" style={{ color: "#4A5568" }}>
                  values.yaml — backend chart
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors duration-200"
              style={{
                backgroundColor: copied ? "rgba(61,220,151,0.15)" : "#111820",
                color: copied ? "#3DDC97" : "#4A5568",
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* YAML Content */}
          <div className="p-6 overflow-x-auto">
            {highlightYaml(helmYaml)}
          </div>
        </motion.div>
      </div>

      {/* ── Resource Quotas ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-xl border p-6"
        style={{ backgroundColor: "#0C1117", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(245,166,35,0.12)" }}
          >
            <HardDrive size={20} style={{ color: "#F5A623" }} />
          </div>
          <div>
            <h3
              className="font-semibold"
              style={{ color: "#F0F2F5", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Resource Quotas
            </h3>
            <p className="text-xs" style={{ color: "#4A5568" }}>
              Namespace: valtheron-prod
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resourceQuotas.map((quota, i) => {
            const Icon = quota.icon;
            return (
              <motion.div
                key={quota.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: quota.color }} />
                    <span className="text-xs font-medium" style={{ color: "#F0F2F5" }}>
                      {quota.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#4A5568", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {quota.used}{quota.unit} / {quota.total}{quota.unit}
                  </span>
                </div>

                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${quota.pct}%` }}
                    transition={{ duration: 1, delay: 0.9 + i * 0.08, ease: "easeOut" as const }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: quota.color }}
                  />
                </div>

                <div className="flex justify-end mt-1">
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: quota.color, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {quota.pct}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
