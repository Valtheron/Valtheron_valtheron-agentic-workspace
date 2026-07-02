import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Shield, Gauge, FileJson, Archive, Key,
  Smartphone, ClipboardList, AlertTriangle, ChevronRight,
  Activity, Lock, Clock, Zap, Server, CircleCheck,
  ArrowRight, Fingerprint, Ban, Code2, Braces,
  Layers, ShieldCheck, ShieldAlert, Timer, Send,
  RotateCcw, Database, FileText, Hash, Eye,
} from 'lucide-react';

const easeDefault = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

interface MiddlewareLayer {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  dimColor: string;
}

const middlewareLayers: MiddlewareLayer[] = [
  { id: 'cors', name: 'cors', description: 'Cross-Origin Resource Sharing', icon: Globe, color: '#3B82F6', dimColor: 'rgba(59,130,246,0.15)' },
  { id: 'helmet', name: 'helmet', description: '14 security headers', icon: Shield, color: '#8B5CF6', dimColor: 'rgba(139,92,246,0.15)' },
  { id: 'rateLimitProxy', name: 'rateLimitProxy', description: 'Request throttling', icon: Gauge, color: '#F5A623', dimColor: 'rgba(245,166,35,0.15)' },
  { id: 'jsonParserFallback', name: 'jsonParserFallback', description: 'Body parsing', icon: FileJson, color: '#22C55E', dimColor: 'rgba(34,197,94,0.15)' },
  { id: 'gzipCompressHeaders', name: 'gzipCompressHeaders', description: 'Response compression', icon: Archive, color: '#14B8A6', dimColor: 'rgba(20,184,166,0.15)' },
  { id: 'authMiddleware', name: 'authMiddleware', description: 'JWT verification', icon: Key, color: '#3DDC97', dimColor: 'rgba(61,220,151,0.15)' },
  { id: 'mfaMiddleware', name: 'mfaMiddleware', description: 'TOTP validation', icon: Smartphone, color: '#EC4899', dimColor: 'rgba(236,72,153,0.15)' },
  { id: 'auditMiddleware', name: 'auditMiddleware', description: 'Action logging', icon: ClipboardList, color: '#06B6D4', dimColor: 'rgba(6,182,212,0.15)' },
  { id: 'errorHandlerMiddleware', name: 'errorHandlerMiddleware', description: 'Centralized errors', icon: AlertTriangle, color: '#EF4444', dimColor: 'rgba(239,68,68,0.15)' },
];

interface Endpoint {
  id: string;
  method: string;
  path: string;
  status: 'operational' | 'degraded' | 'down';
  auth: string;
  rateLimit: string;
  responseFields: string[];
  avgLatency: number;
  latencyColor: string;
}

const endpoints: Endpoint[] = [
  {
    id: 'health', method: 'GET', path: '/api/health',
    status: 'operational', auth: 'None',
    rateLimit: 'Basic (100 req/min)',
    responseFields: ['status', 'message', 'timestamp', 'apiVersion'],
    avgLatency: 12, latencyColor: '#3DDC97',
  },
  {
    id: 'generate', method: 'POST', path: '/api/generate',
    status: 'operational', auth: 'JWT + ai:generate permission',
    rateLimit: 'Authenticated (60 req/min)',
    responseFields: ['generatedText', 'modelUsed', 'tokensGenerated', 'requestId', 'timestamp'],
    avgLatency: 234, latencyColor: '#F5A623',
  },
  {
    id: 'logs', method: 'GET', path: '/api/logs',
    status: 'operational', auth: 'JWT + MFA + admin:audit:read',
    rateLimit: 'Strict (10 req/min)',
    responseFields: ['logs[]', 'total', 'page', 'limit', 'totalPages'],
    avgLatency: 89, latencyColor: '#3DDC97',
  },
  {
    id: 'refactor-batch', method: 'POST', path: '/api/refactor-batch',
    status: 'operational', auth: 'JWT + document:refactor',
    rateLimit: 'Authenticated (30 req/min)',
    responseFields: ['jobId', 'status', 'message', 'timestamp', 'estimatedCompletionTime?'],
    avgLatency: 45, latencyColor: '#3DDC97',
  },
];

interface RateLimitTier {
  id: string;
  name: string;
  requestsPerMin: number;
  authRequired: string;
  burst: number;
  icon: React.ElementType;
  color: string;
  dimColor: string;
  endpoints: string[];
}

const rateLimitTiers: RateLimitTier[] = [
  { id: 'basic', name: 'Tier 1: Basic', requestsPerMin: 100, authRequired: 'No auth required', burst: 20, icon: ShieldCheck, color: '#3B82F6', dimColor: 'rgba(59,130,246,0.15)', endpoints: ['/api/health'] },
  { id: 'authenticated', name: 'Tier 2: Authenticated', requestsPerMin: 60, authRequired: 'JWT required', burst: 10, icon: Lock, color: '#3DDC97', dimColor: 'rgba(61,220,151,0.15)', endpoints: ['/api/generate', '/api/refactor-batch'] },
  { id: 'strict', name: 'Tier 3: Strict + MFA', requestsPerMin: 10, authRequired: 'JWT + MFA required', burst: 3, icon: ShieldAlert, color: '#F5A623', dimColor: 'rgba(245,166,35,0.15)', endpoints: ['/api/logs'] },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ───────── Page Header ───────── */
function PageHeader() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: easeDefault }}
    >
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          API Architecture
        </h1>
        <p className="mt-1" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Express middleware pipeline, endpoints & rate limiting
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="rounded-full animate-pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-primary)' }} />
          <span className="font-mono-small" style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-hover)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Code2 size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="font-mono-data" style={{ color: 'var(--text-secondary)' }}>Express.js v4.18</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-hover)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Layers size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="font-mono-data" style={{ color: 'var(--text-secondary)' }}>9 Middleware Layers</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── 9-Layer Middleware Pipeline Visualizer ───────── */
function MiddlewarePipeline() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            9-Layer Middleware Pipeline
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          Request flow: left to right
        </span>
      </div>

      {/* Horizontal Pipeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute" style={{ top: '32px', left: '40px', right: '40px', height: '2px', backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #F5A623, #22C55E, #14B8A6, #3DDC97, #EC4899, #06B6D4, #EF4444)', opacity: 0.4 }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.3, ease: easeDefault }}
          />
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-9 gap-2 relative z-10">
          {middlewareLayers.map((layer, index) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <motion.div
                key={layer.id}
                className="flex flex-col items-center cursor-pointer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.06, ease: easeDefault }}
                onMouseEnter={() => setActiveLayer(layer.id)}
                onMouseLeave={() => setActiveLayer(null)}
              >
                {/* Node Box */}
                <motion.div
                  className="flex items-center justify-center rounded-lg mb-3"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: isActive ? layer.dimColor : 'var(--bg-surface-hover)',
                    border: `2px solid ${isActive ? layer.color : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.2s ease',
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                >
                  <Icon size={24} style={{ color: layer.color }} />
                </motion.div>

                {/* Layer Number */}
                <span className="font-mono-small mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>
                  {index + 1}
                </span>

                {/* Layer Name */}
                <span className="font-mono-small text-center" style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: isActive ? layer.color : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                  lineHeight: 1.2,
                }}>
                  {layer.name}
                </span>

                {/* Description Tooltip on hover */}
                <span className="font-mono-small text-center mt-1" style={{
                  fontSize: '0.625rem',
                  color: 'var(--text-muted)',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  lineHeight: 1.2,
                }}>
                  {layer.description}
                </span>

                {/* Connector Arrow (not on last item) */}
                {index < middlewareLayers.length - 1 && (
                  <div className="absolute" style={{ top: '24px', left: `${((index + 1) / 9) * 100 - 2}%` }}>
                    <ChevronRight size={12} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Request/Response Labels */}
        <div className="flex justify-between mt-6">
          <div className="flex items-center gap-2">
            <Send size={14} style={{ color: '#3B82F6' }} />
            <span className="font-mono-small" style={{ color: '#3B82F6' }}>Incoming Request</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono-small" style={{ color: '#EF4444' }}>Error Handler (fallback)</span>
            <RotateCcw size={14} style={{ color: '#EF4444' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── Endpoint Status Cards ───────── */
function EndpointCards() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>('health');

  const getMethodColor = (method: string) => {
    if (method === 'GET') return '#3B82F6';
    if (method === 'POST') return '#3DDC97';
    return '#F5A623';
  };

  const getMethodDim = (method: string) => {
    if (method === 'GET') return 'rgba(59,130,246,0.15)';
    if (method === 'POST') return 'rgba(61,220,151,0.15)';
    return 'rgba(245,166,35,0.15)';
  };

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Server size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Endpoint Status
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          4 active endpoints
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {endpoints.map((ep, index) => {
          const isExpanded = expandedEndpoint === ep.id;
          const methodColor = getMethodColor(ep.method);
          const methodDim = getMethodDim(ep.method);
          return (
            <motion.div
              key={ep.id}
              className="rounded-lg overflow-hidden cursor-pointer"
              style={{
                backgroundColor: isExpanded ? 'var(--bg-surface-hover)' : 'var(--bg-surface-hover)',
                border: `1px solid ${isExpanded ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.25 + index * 0.08, ease: easeDefault }}
              onClick={() => setExpandedEndpoint(isExpanded ? null : ep.id)}
              whileHover={{ y: -1, borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Card Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono-data px-2 py-0.5 rounded"
                      style={{ backgroundColor: methodDim, color: methodColor, fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {ep.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-primary)' }} />
                    <span className="font-mono-small" style={{ color: 'var(--accent-primary)', fontSize: '0.625rem', fontWeight: 600 }}>
                      OPERATIONAL
                    </span>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="font-mono-small" style={{ color: 'var(--text-secondary)' }}>
                      {ep.auth === 'None' ? 'Public' : ep.auth}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="font-mono-small" style={{ color: 'var(--text-secondary)' }}>
                      {ep.rateLimit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Timer size={12} style={{ color: ep.latencyColor }} />
                    <span className="font-mono-data" style={{ color: ep.latencyColor, fontSize: '0.8125rem' }}>
                      {ep.avgLatency}ms avg
                    </span>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <motion.div
                    className="mt-4 pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25, ease: easeDefault }}
                  >
                    <span className="font-mono-small block mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Response Fields
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ep.responseFields.map((field) => (
                        <span
                          key={field}
                          className="font-mono-data px-2 py-1 rounded"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                        >
                          {field}
                        </span>
                      ))}
                    </div>

                    {/* Response Preview */}
                    <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="font-mono-small block mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>
                        EXAMPLE RESPONSE
                      </span>
                      <pre className="font-mono-data" style={{ color: '#8B95A5', fontSize: '0.75rem', lineHeight: 1.5, overflow: 'auto' }}>
                        <ResponsePreview endpoint={ep} />
                      </pre>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ───────── Response Preview Helper ───────── */
function ResponsePreview({ endpoint }: { endpoint: Endpoint }) {
  switch (endpoint.id) {
    case 'health':
      return (
        <>{`{\n`}{`  "status": "ok",\n`}{`  "message": "System operational",\n`}{`  "timestamp": "2025-01-15T10:30:00Z",\n`}{`  "apiVersion": "1.4.2"\n`}{`}`}</>
      );
    case 'generate':
      return (
        <>{`{\n`}{`  "generatedText": "import React...",\n`}{`  "modelUsed": "gpt-4",\n`}{`  "tokensGenerated": 142,\n`}{`  "requestId": "req_8f3a2b1c",\n`}{`  "timestamp": "2025-01-15T10:30:00Z"\n`}{`}`}</>
      );
    case 'logs':
      return (
        <>{`{\n`}{`  "logs": [...],\n`}{`  "total": 1024,\n`}{`  "page": 1,\n`}{`  "limit": 50,\n`}{`  "totalPages": 21\n`}{`}`}</>
      );
    case 'refactor-batch':
      return (
        <>{`{\n`}{`  "jobId": "job_9e4d7f2a",\n`}{`  "status": "queued",\n`}{`  "message": "Batch accepted",\n`}{`  "timestamp": "2025-01-15T10:30:00Z",\n`}{`  "estimatedCompletionTime": "2025-01-15T10:35:00Z"\n`}{`}`}</>
      );
    default:
      return null;
  }
}

/* ───────── Rate Limiting Tiers ───────── */
function RateLimitTiers() {
  const [activeTier, setActiveTier] = useState<string>('basic');

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Gauge size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Rate Limiting Tiers
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          3 protection levels
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {rateLimitTiers.map((tier, index) => {
          const Icon = tier.icon;
          const isActive = activeTier === tier.id;
          return (
            <motion.div
              key={tier.id}
              className="rounded-lg p-5 cursor-pointer"
              style={{
                backgroundColor: isActive ? tier.dimColor : 'var(--bg-surface-hover)',
                border: `1px solid ${isActive ? tier.color : 'transparent'}`,
                transition: 'all 0.2s ease',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.35 + index * 0.08, ease: easeDefault }}
              onClick={() => setActiveTier(isActive ? '' : tier.id)}
              whileHover={{ y: -1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', backgroundColor: isActive ? tier.dimColor : 'rgba(255,255,255,0.04)' }}>
                  <Icon size={20} style={{ color: tier.color }} />
                </div>
                <div>
                  <span className="block font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                    {tier.name}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>Rate</span>
                  <span className="font-mono-data" style={{ color: tier.color, fontSize: '0.9375rem', fontWeight: 600 }}>
                    {tier.requestsPerMin} req/min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>Burst</span>
                  <span className="font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                    {tier.burst} requests
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>Auth</span>
                  <span className="font-mono-data" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    {tier.authRequired}
                  </span>
                </div>
              </div>

              {/* Endpoints */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-mono-small block mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Applies to
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tier.endpoints.map((ep) => (
                    <span
                      key={ep}
                      className="font-mono-data px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: '0.6875rem' }}
                    >
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ───────── Error Response Format ───────── */
function ErrorResponseFormat() {
  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.4, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} style={{ color: 'var(--accent-danger)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Error Response Format
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          TypeScript interface
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Code Block */}
        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Braces size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ValtheronErrorResponse
            </span>
          </div>
          <pre className="font-mono-data" style={{ color: '#8B95A5', fontSize: '0.8125rem', lineHeight: 1.7 }}>
            <span style={{ color: '#C084FC' }}>interface</span>{' '}
            <span style={{ color: '#3DDC97' }}>ValtheronErrorResponse</span>{' {\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>statusCode</span>: <span style={{ color: '#F5A623' }}>number</span>;{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>message</span>: <span style={{ color: '#F5A623' }}>string</span>;{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>error</span>: <span style={{ color: '#F5A623' }}>string</span>;{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>timestamp</span>: <span style={{ color: '#F5A623' }}>string</span>;{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>requestId?</span>: <span style={{ color: '#F5A623' }}>string</span>;{'\n'}
            {'} '}
            <span style={{ color: '#4A5568' }}>// distributed tracing</span>
          </pre>
        </div>

        {/* Example */}
        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Example: 429 Too Many Requests
            </span>
          </div>
          <pre className="font-mono-data" style={{ color: '#8B95A5', fontSize: '0.8125rem', lineHeight: 1.7 }}>
            <span style={{ color: '#C084FC' }}>{`{`}</span>{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>"statusCode"</span>: <span style={{ color: '#F5A623' }}>429</span>,{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>"message"</span>: <span style={{ color: '#3DDC97' }}>"Rate limit exceeded"</span>,{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>"error"</span>: <span style={{ color: '#3DDC97' }}>"Too Many Requests"</span>,{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>"timestamp"</span>: <span style={{ color: '#3DDC97' }}>"2025-01-15T10:30:00Z"</span>,{'\n'}
            {'  '}<span style={{ color: '#60A5FA' }}>"requestId"</span>: <span style={{ color: '#3DDC97' }}>"req_8f3a2b1c"</span>{'\n'}
            <span style={{ color: '#C084FC' }}>{`}`}</span>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── X-Request-ID Tracing ───────── */
function RequestIdTracing() {
  const traceSteps = [
    { id: 'react', label: 'React Client', icon: Zap, color: '#3B82F6', description: 'Generates X-Request-ID header' },
    { id: 'express', label: 'Express Middleware', icon: Server, color: '#8B5CF6', description: 'Attaches ID to request context' },
    { id: 'logger', label: 'Logger', icon: FileText, color: '#3DDC97', description: 'Logs every action with requestId' },
    { id: 'response', label: 'Response Header', icon: Send, color: '#06B6D4', description: 'Returns X-Request-ID to client' },
  ];

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.5, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Hash size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            X-Request-ID Tracing
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          Distributed request tracing
        </span>
      </div>

      {/* Trace Flow */}
      <div className="relative">
        {/* Flow Arrows */}
        <div className="flex items-center justify-between px-16 mb-2" style={{ position: 'absolute', top: '28px', left: 0, right: 0 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.2 }}
            >
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
              >
                <ArrowRight size={16} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {traceSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + index * 0.1, ease: easeDefault }}
              >
                <motion.div
                  className="flex items-center justify-center rounded-xl mb-3"
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: `${step.color}18`,
                    border: `1px solid ${step.color}30`,
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <Icon size={24} style={{ color: step.color }} />
                </motion.div>
                <span className="font-mono-data block mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {step.label}
                </span>
                <span className="font-mono-small block" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', lineHeight: 1.4 }}>
                  {step.description}
                </span>

                {/* Header Label */}
                <div className="mt-3 flex items-center gap-1.5">
                  <Hash size={10} style={{ color: step.color, opacity: 0.6 }} />
                  <span className="font-mono-small" style={{ color: step.color, fontSize: '0.625rem', fontWeight: 600 }}>
                    req_8f3a2b1c
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── Request/Response Flow Diagram ───────── */
function RequestResponseFlow() {
  return (
    <motion.div
      className="rounded-xl p-6"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.6, ease: easeDefault }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Request / Response Lifecycle
          </span>
        </div>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>
          Full middleware execution order
        </span>
      </div>

      <div className="space-y-2">
        {[
          { step: 1, label: 'Client Request', detail: 'React app sends HTTP request with X-Request-ID header', icon: Zap, color: '#3B82F6', type: 'incoming' as const },
          { step: 2, label: 'CORS Check', detail: 'Cross-origin headers validation', icon: Globe, color: '#3B82F6', type: 'middleware' as const },
          { step: 3, label: 'Helmet Headers', detail: '14 security headers applied (X-Frame-Options, CSP, HSTS...)', icon: Shield, color: '#8B5CF6', type: 'middleware' as const },
          { step: 4, label: 'Rate Limit Check', detail: 'Request counted against tier limit per IP/user', icon: Gauge, color: '#F5A623', type: 'middleware' as const },
          { step: 5, label: 'Body Parsing', detail: 'JSON body parsed with fallback for malformed payloads', icon: FileJson, color: '#22C55E', type: 'middleware' as const },
          { step: 6, label: 'Compression', detail: 'Gzip response compression headers prepared', icon: Archive, color: '#14B8A6', type: 'middleware' as const },
          { step: 7, label: 'JWT Verification', detail: 'Bearer token validated, permissions extracted', icon: Key, color: '#3DDC97', type: 'auth' as const },
          { step: 8, label: 'MFA Validation', detail: 'TOTP check for protected endpoints (/api/logs)', icon: Smartphone, color: '#EC4899', type: 'auth' as const },
          { step: 9, label: 'Audit Logging', detail: 'Action logged with user, endpoint, timestamp, requestId', icon: ClipboardList, color: '#06B6D4', type: 'middleware' as const },
          { step: 10, label: 'Route Handler', detail: 'Express route processes the request', icon: Server, color: '#3DDC97', type: 'handler' as const },
          { step: 11, label: 'Error Handler', detail: 'Centralized error formatting (fallback)', icon: AlertTriangle, color: '#EF4444', type: 'fallback' as const },
          { step: 12, label: 'Client Response', detail: 'JSON response with X-Request-ID header returned', icon: Send, color: '#06B6D4', type: 'outgoing' as const },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              className="flex items-center gap-4 rounded-lg px-4 py-3"
              style={{
                backgroundColor: item.type === 'auth' ? `${item.color}08` : item.type === 'handler' ? 'rgba(61,220,151,0.06)' : item.type === 'fallback' ? 'rgba(239,68,68,0.06)' : 'var(--bg-surface-hover)',
                borderLeft: `3px solid ${item.color}`,
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.65 + index * 0.04, ease: easeDefault }}
            >
              {/* Step Number */}
              <div className="flex items-center justify-center rounded flex-shrink-0" style={{ width: '28px', height: '28px', backgroundColor: `${item.color}20` }}>
                <span className="font-mono-data" style={{ color: item.color, fontSize: '0.75rem', fontWeight: 600 }}>
                  {item.step}
                </span>
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center rounded flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: `${item.color}15` }}>
                <Icon size={16} style={{ color: item.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="font-mono-data block" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {item.label}
                </span>
                <span className="font-mono-small block" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {item.detail}
                </span>
              </div>

              {/* Type Badge */}
              <span
                className="font-mono-small px-2 py-0.5 rounded flex-shrink-0"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                {item.type}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEW SECTIONS: overview.md + activity.md integration
   ═══════════════════════════════════════════════════════════════ */

/* ───────── Base URLs ───────── */
function BaseUrlsSection() {
  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: easeDefault }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Server size={20} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Base URLs</span>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>API Version 1</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CircleCheck size={14} style={{ color: '#3DDC97' }} />
            <span className="font-mono-small" style={{ color: '#3DDC97', fontWeight: 600 }}>PRODUCTION</span>
          </div>
          <code className="font-mono-data block" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            https://api.valtheron.com/v1
          </code>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>DEVELOPMENT</span>
          </div>
          <code className="font-mono-data block" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            http://localhost:3001/v1
          </code>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── Core Principles ───────── */
function CorePrinciples() {
  const principles = [
    { label: 'Security-First', desc: 'AES-256-GCM encryption, MFA enforced', icon: Lock, color: '#EF4444' },
    { label: 'Auditability', desc: 'Tamper-proof audit log for every action', icon: ClipboardList, color: '#3DDC97' },
    { label: 'Type Safety', desc: 'TypeScript across backend and frontend', icon: Code2, color: '#3B82F6' },
    { label: 'Predictable', desc: 'Consistent JSON, status codes, errors', icon: Activity, color: '#F5A623' },
    { label: 'Modularity', desc: 'Distinct modules per domain logic', icon: Layers, color: '#8B5CF6' },
  ];

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: easeDefault }}
    >
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Core Principles</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {principles.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.label}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: `${p.color}10`, border: `1px solid ${p.color}20` }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
            >
              <Icon size={18} style={{ color: p.color, margin: '0 auto 6px' }} />
              <div className="font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>{p.label}</div>
              <div className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '2px' }}>{p.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ───────── Authentication Flow ───────── */
function AuthenticationFlow() {
  const steps = [
    { step: '01', label: 'Username + Password', detail: 'Primary credentials', type: 'input', color: '#3B82F6' },
    { step: '02', label: 'MFA TOTP Challenge', detail: '6-digit code required', type: 'verify', color: '#F5A623' },
    { step: '03', label: 'Access Token (15min)', detail: 'Short-lived JWT RS256', type: 'token', color: '#3DDC97' },
    { step: '04', label: 'Refresh Token (7d)', detail: 'Long-lived rotation', type: 'token', color: '#8B5CF6' },
  ];

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12, ease: easeDefault }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Fingerprint size={20} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Authentication Flow</span>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>JWT RS256 + TOTP MFA</span>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5">
        {steps.map((s, i) => (
          <div key={s.step} className="flex-1 flex items-center gap-3">
            <div className="flex-1 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-small px-1.5 py-0.5 rounded" style={{ backgroundColor: `${s.color}20`, color: s.color, fontSize: '0.625rem', fontWeight: 700 }}>{s.step}</span>
                <span className="font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 500 }}>{s.label}</span>
              </div>
              <div className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{s.detail}</div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} className="hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* TypeScript Code Snippet */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2">
            <FileText size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>auth.types.ts</span>
          </div>
          <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>TypeScript</span>
        </div>
        <pre className="p-4 overflow-x-auto" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
          <code style={{ color: 'var(--text-secondary)' }}>
{`interface AuthRequest {
  body: { username: string; password?: string; mfaCode?: string };
}
interface AuthResponse {
  success: { accessToken: string; refreshToken: string; userId: string };
  error:   { message: string; code: string };
}`}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}

/* ───────── Activity API Section ───────── */
function ActivityApiSection() {
  const activityTypes = [
    { type: 'USER_LOGIN', desc: 'User authentication', color: '#3DDC97' },
    { type: 'USER_LOGOUT', desc: 'Session termination', color: '#64748B' },
    { type: 'MFA_CHALLENGE', desc: 'TOTP challenge sent', color: '#F5A623' },
    { type: 'MFA_VERIFIED', desc: 'TOTP verified', color: '#3DDC97' },
    { type: 'AGENT_DEPLOYED', desc: 'Agent deployment', color: '#3B82F6' },
    { type: 'SETTING_UPDATED', desc: 'Configuration change', color: '#8B5CF6' },
    { type: 'DATA_ACCESSED', desc: 'Sensitive data access', color: '#EC4899' },
    { type: 'API_ERROR', desc: 'API error occurred', color: '#EF4444' },
    { type: 'SYSTEM_HEALTH', desc: 'Health check event', color: '#06B6D4' },
  ];

  const endpoints = [
    { method: 'POST', path: '/api/activity/log', desc: 'Log a new activity', auth: 'Authenticated', color: '#3DDC97' },
    { method: 'GET', path: '/api/activity', desc: 'Retrieve activity logs', auth: 'Admin/Auditor', color: '#3B82F6' },
  ];

  return (
    <motion.div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.14, ease: easeDefault }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Activity API</span>
        <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>Immutable audit trail</span>
      </div>

      {/* Endpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {endpoints.map((ep) => (
          <div key={ep.path} className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-small px-1.5 py-0.5 rounded" style={{ backgroundColor: `${ep.color}20`, color: ep.color, fontSize: '0.65rem', fontWeight: 700 }}>{ep.method}</span>
              <code className="font-mono-data" style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>{ep.path}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{ep.desc}</span>
              <span className="font-mono-small px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '0.6rem' }}>{ep.auth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Types */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Hash size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ActivityType Enum</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((a) => (
            <span key={a.type} className="font-mono-small px-2 py-1 rounded" style={{ backgroundColor: `${a.color}15`, color: a.color, fontSize: '0.7rem', border: `1px solid ${a.color}25` }} title={a.desc}>
              {a.type}
            </span>
          ))}
        </div>
      </div>

      {/* BaseActivity Interface */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2">
            <FileText size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="font-mono-small" style={{ color: 'var(--text-muted)' }}>activity.ts</span>
          </div>
          <span className="font-mono-small" style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>TypeScript</span>
        </div>
        <pre className="p-4 overflow-x-auto" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
          <code style={{ color: 'var(--text-secondary)' }}>
{`interface BaseActivity {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601
  actorId: string;               // User or Agent ID
  actorType: 'User' | 'System' | 'Agent';
  ipAddress?: string;            // Encrypted
  userAgent?: string;
  type: ActivityType;            // Enum
  status: ActivityStatus;        // SUCCESS | FAILURE | PENDING
  description: string;
  metadata: Record<string, any>; // Encrypted AES-256-GCM
}`}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function API() {
  return (
    <div>
      <PageHeader />

      {/* Base URLs */}
      <BaseUrlsSection />

      {/* Core Principles */}
      <CorePrinciples />

      {/* Authentication Flow */}
      <AuthenticationFlow />

      {/* 9-Layer Middleware Pipeline Visualizer */}
      <MiddlewarePipeline />

      {/* Endpoint Status Cards */}
      <EndpointCards />

      {/* Activity API */}
      <ActivityApiSection />

      {/* Rate Limiting Tiers */}
      <RateLimitTiers />

      {/* Error Response Format */}
      <ErrorResponseFormat />

      {/* X-Request-ID Tracing */}
      <RequestIdTracing />

      {/* Request/Response Flow */}
      <RequestResponseFlow />
    </div>
  );
}
