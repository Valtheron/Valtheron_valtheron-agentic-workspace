import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Database as DatabaseIcon,
  Layers,
  HardDrive,
  ArrowDown,
  ArrowLeftRight,
  CheckCircle,
  Circle,
  RefreshCw,
  Network,
  Shield,
} from 'lucide-react';

/* ================================================================== */
/*  COLOUR SYSTEM                                                     */
/* ================================================================== */

const C = {
  bgPage: '#070A0E',
  bgCard: '#0C1117',
  bgCardHover: '#111820',
  bgElevated: '#141E2B',
  accent: '#3DDC97',
  secondary: '#5B8DEF',
  warning: '#F5A623',
  danger: '#EF4444',
  purple: '#A78BFA',
  cyan: '#00D4AA',
  textPrimary: '#F0F2F5',
  textSecondary: '#8B95A5',
  textMuted: '#4A5568',
  border: 'rgba(255,255,255,0.06)',
  grid: 'rgba(255,255,255,0.04)',
} as const;

/* ================================================================== */
/*  DATABASE BRAND COLOURS                                            */
/* ================================================================== */

const DB = {
  postgres: '#336791',
  redis: '#DC382D',
  minio: '#C72C48',
} as const;

/* ================================================================== */
/*  ANIMATION VARIANTS                                                */
/* ================================================================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ================================================================== */
/*  STATUS BADGE                                                      */
/* ================================================================== */

function StatusBadge({ status, label }: { status: string; label?: string }) {
  const color = status === 'operational' ? C.accent : status === 'in-progress' ? C.warning : C.textMuted;
  const displayLabel = label || (status === 'operational' ? 'Operational' : status === 'in-progress' ? 'In Progress' : status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium capitalize"
      style={{ fontSize: '0.6875rem', backgroundColor: `${color}18`, color }}
    >
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }}>
        {status === 'operational' && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} />
        )}
      </span>
      {displayLabel}
    </span>
  );
}

/* ================================================================== */
/*  DATABASE ABSTRACTION LAYER DIAGRAM                                */
/* ================================================================== */

function AbstractionLayerDiagram() {
  const methods = [
    'connect()', 'disconnect()', 'query<T>()', 'insert<T>()', 'update<T>()',
    'find<T>()', 'findById<T>()', 'delete<T>()', 'beginTransaction()',
    'commitTransaction()', 'rollbackTransaction()',
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-6"
      style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium" style={{ color: C.textPrimary, fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}>
          Database Abstraction Layer
        </h3>
        <span className="font-mono text-xs" style={{ color: C.textMuted }}>Interface Pattern</span>
      </div>

      {/* Diagram */}
      <div className="flex flex-col items-center gap-0">
        {/* Top: Valtheron Backend */}
        <div
          className="rounded-lg px-6 py-3 text-center"
          style={{ backgroundColor: C.bgElevated, border: `1.5px solid ${C.accent}`, minWidth: 220 }}
        >
          <span className="text-sm font-medium" style={{ color: C.accent, fontFamily: 'JetBrains Mono, monospace' }}>
            Valtheron Backend
          </span>
        </div>

        {/* Arrow down */}
        <div className="flex items-center gap-1 py-1">
          <ArrowDown size={16} style={{ color: C.textMuted }} />
        </div>

        {/* Middle: IDatabaseAdapter Interface */}
        <div
          className="rounded-lg px-6 py-3 text-center"
          style={{ backgroundColor: `${C.accent}10`, border: `1.5px solid ${C.accent}`, minWidth: 280 }}
        >
          <span className="text-sm font-semibold" style={{ color: C.accent, fontFamily: 'JetBrains Mono, monospace' }}>
            IDatabaseAdapter
          </span>
          <span className="ml-2 text-xs" style={{ color: C.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}>interface</span>
        </div>

        {/* Double-headed arrow */}
        <div className="flex items-center gap-1 py-1">
          <ArrowLeftRight size={16} style={{ color: C.textMuted }} />
        </div>

        {/* Two Adapters side by side */}
        <div className="flex items-start gap-6">
          {/* SQLite Adapter */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="rounded-lg px-5 py-2.5 text-center"
              style={{ backgroundColor: C.bgCardHover, border: `1.5px solid ${C.textMuted}`, minWidth: 160 }}
            >
              <span className="text-xs font-medium" style={{ color: C.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}>
                SQLiteAdapter
              </span>
              <div className="mt-1 text-xs" style={{ color: C.textMuted }}>(Local Dev)</div>
            </div>
            <ArrowDown size={14} style={{ color: C.textMuted }} />
            <div
              className="rounded-md px-4 py-1.5 text-center"
              style={{ backgroundColor: C.bgElevated, border: `1px solid ${C.border}` }}
            >
              <span className="text-xs" style={{ color: C.textSecondary, fontFamily: 'JetBrains Mono, monospace' }}>better-sqlite3</span>
            </div>
          </div>

          {/* Postgres Adapter */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="rounded-lg px-5 py-2.5 text-center"
              style={{ backgroundColor: C.bgCardHover, border: `1.5px solid ${DB.postgres}`, minWidth: 160 }}
            >
              <span className="text-xs font-medium" style={{ color: DB.postgres, fontFamily: 'JetBrains Mono, monospace' }}>
                PostgresAdapter
              </span>
              <div className="mt-1 text-xs" style={{ color: C.textMuted }}>(Production)</div>
            </div>
            <ArrowDown size={14} style={{ color: C.textMuted }} />
            <div
              className="rounded-md px-4 py-1.5 text-center"
              style={{ backgroundColor: C.bgElevated, border: `1px solid ${DB.postgres}40` }}
            >
              <span className="text-xs" style={{ color: DB.postgres, fontFamily: 'JetBrains Mono, monospace' }}>pg.Pool</span>
            </div>
            <ArrowDown size={14} style={{ color: C.textMuted }} />
            <div
              className="rounded-md px-4 py-1.5 text-center"
              style={{ backgroundColor: `${DB.postgres}15`, border: `1px solid ${DB.postgres}60` }}
            >
              <span className="text-xs font-semibold" style={{ color: DB.postgres, fontFamily: 'JetBrains Mono, monospace' }}>PostgreSQL 16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Methods */}
      <div className="mt-6 rounded-lg p-3" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: C.textMuted }}>
          Interface Methods
        </p>
        <div className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <span
              key={m}
              className="rounded-md px-2.5 py-1 font-mono text-xs"
              style={{ backgroundColor: C.bgElevated, color: C.textSecondary, border: `1px solid ${C.border}` }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  POSTGRESQL CARD                                                   */
/* ================================================================== */

function PostgresCard() {
  const stats = [
    { label: 'Tables', value: 17 },
    { label: 'Indexes', value: 20 },
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${DB.postgres}`,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${DB.postgres}18` }}
          >
            <DatabaseIcon size={20} style={{ color: DB.postgres }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: C.textPrimary }}>PostgreSQL</h4>
            <span className="font-mono text-xs" style={{ color: C.textMuted }}>Primary Database</span>
          </div>
        </div>
        <StatusBadge status="operational" />
      </div>

      {/* Version */}
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: C.bgCardHover, color: C.textSecondary }}>
          v16.4
        </span>
        <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: `${DB.postgres}15`, color: DB.postgres }}>
          Streaming Replication
        </span>
      </div>

      {/* Connections Bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Connections</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>47 / 200</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '23.5%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: DB.postgres }}
          />
        </div>
        <span className="mt-0.5 block font-mono text-xs" style={{ color: C.textMuted }}>23.5% utilized</span>
      </div>

      {/* Cache Hit Rate */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Cache Hit Rate</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>96.7%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '96.7%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: C.accent }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg p-2.5" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
            <p className="text-xs" style={{ color: C.textMuted }}>{s.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold" style={{ color: C.textPrimary }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Detail Rows */}
      <div className="space-y-2">
        {[
          { label: 'Size', value: '2.68 GB' },
          { label: 'Replication', value: 'async_slave_synced', color: C.accent },
          { label: 'Statement Timeout', value: '10s' },
          { label: 'Query Timeout', value: '15s' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: C.textMuted }}>{row.label}</span>
            <span className="font-mono text-xs" style={{ color: (row as { color?: string }).color || C.textSecondary }}>{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  REDIS CARD                                                        */
/* ================================================================== */

function RedisCard() {
  const memoryPct = (847 / 2048) * 100; // 847 MB / 2 GB

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${DB.redis}`,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${DB.redis}18` }}
          >
            <Layers size={20} style={{ color: DB.redis }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: C.textPrimary }}>Redis</h4>
            <span className="font-mono text-xs" style={{ color: C.textMuted }}>Cache & Session Store</span>
          </div>
        </div>
        <StatusBadge status="operational" />
      </div>

      {/* Version */}
      <div className="mb-4">
        <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: C.bgCardHover, color: C.textSecondary }}>
          v7.2
        </span>
      </div>

      {/* Connections */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Active Connections</span>
          <span className="font-mono text-xs" style={{ color: DB.redis }}>512</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '51.2%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: DB.redis }}
          />
        </div>
      </div>

      {/* Memory Used */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Memory Used</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>847 MB / 2 GB</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${memoryPct}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: memoryPct > 80 ? C.warning : DB.redis }}
          />
        </div>
        <span className="mt-0.5 block font-mono text-xs" style={{ color: C.textMuted }}>{memoryPct.toFixed(1)}% utilized</span>
      </div>

      {/* Hit Rate */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Hit Rate</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>94.2%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '94.2%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: C.accent }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-2.5" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Evicted Keys</p>
          <p className="mt-1 font-mono text-lg font-semibold" style={{ color: C.accent }}>0</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Uptime</p>
          <p className="mt-1 font-mono text-sm font-semibold" style={{ color: C.textPrimary }}>45d 12h</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  MINIO S3 CARD                                                     */
/* ================================================================== */

function MinioCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${DB.minio}`,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${DB.minio}18` }}
          >
            <HardDrive size={20} style={{ color: DB.minio }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: C.textPrimary }}>MinIO S3</h4>
            <span className="font-mono text-xs" style={{ color: C.textMuted }}>Object Storage</span>
          </div>
        </div>
        <StatusBadge status="operational" />
      </div>

      {/* Version */}
      <div className="mb-4">
        <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: C.bgCardHover, color: C.textSecondary }}>
          latest
        </span>
      </div>

      {/* Buckets */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Buckets</span>
          <span className="font-mono text-xs" style={{ color: DB.minio }}>291 <span style={{ color: C.textMuted }}>(1 per agent)</span></span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '58.2%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: DB.minio }}
          />
        </div>
      </div>

      {/* Total Size */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Total Size</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>28.4 GB</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '28.4%' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ backgroundColor: DB.minio }}
          />
        </div>
      </div>

      {/* Objects count */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg p-2.5" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Objects</p>
          <p className="mt-1 font-mono text-lg font-semibold" style={{ color: C.textPrimary }}>
            <CountUp end={12847} duration={1.5} separator="," />
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Uploads/min</p>
          <p className="mt-1 font-mono text-lg font-semibold" style={{ color: C.accent }}>
            <CountUp end={1247} duration={1.5} separator="," />
          </p>
        </div>
      </div>

      {/* Detail Rows */}
      <div className="space-y-2">
        {[
          { label: 'Status', value: 'All buckets healthy' },
          { label: 'Replication', value: 'Enabled' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: C.textMuted }}>{row.label}</span>
            <span className="font-mono text-xs" style={{ color: C.accent }}>{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  CONNECTION POOL MONITOR                                           */
/* ================================================================== */

function ConnectionPoolMonitor() {
  const maxPool = 200;
  const active = 47;
  const idle = 153;
  const waiting = 2;
  const acquireTime = 1.2;

  const activePct = (active / maxPool) * 100;
  const idlePct = (idle / maxPool) * 100;
  const waitingPct = (waiting / maxPool) * 100;

  // Generate pool slot data
  const poolSlots = useMemo(() => {
    return Array.from({ length: maxPool }, (_, i) => {
      if (i < active) return 'active';
      if (i < active + waiting) return 'waiting';
      return 'idle';
    });
  }, []);

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-6"
      style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12 }}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium" style={{ color: C.textPrimary, fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}>
            Connection Pool Monitor
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: C.textSecondary }}>Real-time pg.Pool connection visualization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: DB.postgres }} />
            <span className="text-xs" style={{ color: C.textSecondary }}>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: C.accent }} />
            <span className="text-xs" style={{ color: C.textSecondary }}>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: C.warning }} />
            <span className="text-xs" style={{ color: C.textSecondary }}>Waiting</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg p-3" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Max Pool Size</p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: C.textPrimary }}>{maxPool}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Active</p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: DB.postgres }}>{active}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Idle</p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: C.accent }}>{idle}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.textMuted }}>Acquire Time</p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: C.secondary }}>{acquireTime}ms</p>
        </div>
      </div>

      {/* Pool Visualization */}
      <div className="rounded-lg p-4" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textMuted }}>Pool Slots ({maxPool})</span>
          <span className="font-mono text-xs" style={{ color: C.textMuted }}>
            Waiting: <span style={{ color: C.warning }}>{waiting}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {poolSlots.map((type, i) => {
            const color = type === 'active' ? DB.postgres : type === 'waiting' ? C.warning : C.accent;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.15,
                  delay: i * 0.003,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: color,
                  opacity: type === 'idle' ? 0.35 : 0.9,
                }}
                title={type === 'active' ? `Connection ${i + 1}: Active` : type === 'waiting' ? `Connection ${i + 1}: Waiting` : `Connection ${i + 1}: Idle`}
              />
            );
          })}
        </div>
      </div>

      {/* Stacked Bar */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textSecondary }}>Pool Utilization</span>
          <span className="font-mono text-xs" style={{ color: C.textPrimary }}>{((active + waiting) / maxPool * 100).toFixed(1)}%</span>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${activePct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full"
            style={{ backgroundColor: DB.postgres }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${waitingPct}%` }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full"
            style={{ backgroundColor: C.warning }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${idlePct}%` }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full"
            style={{ backgroundColor: C.accent, opacity: 0.3 }}
          />
        </div>
        <div className="mt-2 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: DB.postgres }}>{active} active</span>
          <span className="font-mono text-xs" style={{ color: C.warning }}>{waiting} waiting</span>
          <span className="font-mono text-xs" style={{ color: C.accent }}>{idle} idle</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  MIGRATION STATUS TRACKER — Per Contributor Doc v2.0               */
/*  4 Phasen: Abstraction → ORM → Migration Tool → K8s               */
/* ================================================================== */

function MigrationTracker() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Database Abstraction Layer & Configuration',
      version: 'v1.1.0',
      deliverables: [
        'IDatabaseService interface (connect, query, transactions)',
        'SQLiteService.ts refactoring (all direct sqlite3 calls migrated)',
        'Configuration Management (DATABASE_TYPE env, PG_* vars)',
        'PostgreSQLService.ts placeholder with basic pg.Pool',
      ],
      status: 'done' as const,
    },
    {
      phase: 'Phase 2',
      title: 'PostgreSQL Integration & ORM Adoption',
      version: 'v1.1.0',
      deliverables: [
        'TypeORM integration (typeorm + pg + sqlite3 drivers)',
        'PostgreSQLService.ts fully implemented via TypeORM EntityManager',
        'All models as TypeORM Entities (Users, Workspaces, AuditLogs)',
        'Initial TypeORM migration files for PostgreSQL schema',
      ],
      status: 'done' as const,
    },
    {
      phase: 'Phase 3',
      title: 'Data Migration Tooling',
      version: 'v1.1.0/v2.0.0',
      deliverables: [
        'Migration Script: scripts/migrate-sqlite-to-postgres.ts',
        'Chunked data transfer with ID mapping (ROWID → UUID)',
        'Comprehensive error handling & logging',
        'User documentation for migration prerequisites & steps',
      ],
      status: 'done' as const,
    },
    {
      phase: 'Phase 4',
      title: 'Kubernetes Deployment & Testing',
      version: 'v2.0.0',
      deliverables: [
        'bitnami/postgresql Helm chart integration',
        'Valtheron K8s manifests with Secrets & ConfigMaps',
        'Connection pool tuning & performance testing',
        'End-to-end feature validation (Auth, MFA, Workspaces, Audit)',
      ],
      status: 'done' as const,
    },
  ];

  const progress = 100;

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl p-6"
      style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12 }}
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium" style={{ color: C.textPrimary, fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}>
            Migration Status
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: C.textSecondary }}>SQLite &rarr; PostgreSQL Migration Layer — Contributor Spec v2.0</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="operational" label="Completed" />
          <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: C.accent + '18', color: C.accent }}>
            4/4 Phases
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: C.textPrimary }}>Overall Progress</span>
          <span className="font-mono text-sm font-semibold" style={{ color: C.accent }}>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})` }}
          />
        </div>
      </div>

      {/* 4 Phases */}
      <div className="space-y-4">
        {phases.map((p, i) => (
          <motion.div
            key={p.phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
            className="rounded-lg p-4"
            style={{ backgroundColor: C.bgCardHover, border: `1px solid ${C.border}` }}
          >
            {/* Phase Header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${C.accent}18` }}
              >
                <CheckCircle size={16} style={{ color: C.accent }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: C.accent }}>{p.phase}</span>
                  <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.title}</span>
                </div>
                <span className="font-mono text-xs" style={{ color: C.textMuted }}>{p.version}</span>
              </div>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-xs"
                style={{ backgroundColor: `${C.accent}18`, color: C.accent }}
              >
                Done
              </span>
            </div>

            {/* Deliverables */}
            <div className="ml-11 space-y-1.5">
              {p.deliverables.map((d, j) => (
                <div key={j} className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.accent }} />
                  <span className="text-xs" style={{ color: C.textSecondary }}>{d}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  LIVE COUNTER HOOK                                                 */
/* ================================================================== */

function useLiveCounter(interval = 3000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), interval);
    return () => clearInterval(i);
  }, [interval]);
  return tick;
}

/* ================================================================== */
/*  MAIN COMPONENT                                                    */
/* ================================================================== */

export default function Database() {
  useLiveCounter(5000); // Keep page feeling alive

  return (
    <div className="min-h-screen space-y-6 p-6" style={{ backgroundColor: C.bgPage }}>

      {/* ════════════════════════════════════════════════════════════════
          1. PAGE HEADER
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: C.textPrimary, letterSpacing: '-0.02em', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Database Architecture
          </h1>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
            Multi-database abstraction layer with PostgreSQL, Redis, and MinIO S3
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5">
            <Network size={14} style={{ color: C.accent }} />
            <span className="font-mono text-xs" style={{ color: C.textSecondary }}>3 databases</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5">
            <Shield size={14} style={{ color: C.accent }} />
            <span className="font-mono text-xs" style={{ color: C.textSecondary }}>All healthy</span>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════
          2. DATABASE ABSTRACTION LAYER DIAGRAM
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AbstractionLayerDiagram />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════
          3. THREE-COLUMN DATABASE CARDS
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <PostgresCard />
        <RedisCard />
        <MinioCard />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════
          4. CONNECTION POOL MONITOR
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ConnectionPoolMonitor />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════
          5. MIGRATION STATUS TRACKER
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MigrationTracker />
      </motion.div>
    </div>
  );
}
