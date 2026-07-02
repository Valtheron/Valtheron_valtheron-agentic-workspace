import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Database, KeyRound, GitBranch, HardDrive,
  Users, FileCode, Activity, AlertTriangle, CheckCircle,
  Clock, Lock, Server, ChevronRight, Terminal,
  Copy, Check, ArrowRight, Ban, Eye, RefreshCw,
  Layers, HardDrive as HardDriveIcon,
  Timer, Hash, XCircle
} from 'lucide-react';

/* ─── Design Tokens ─── */
const C = {
  bg: '#070A0E', surface: '#0C1117', border: 'rgba(255,255,255,0.06)',
  textPrimary: '#F0F2F5', textSecondary: '#8B95A5', textMuted: '#4A5568',
  accent: '#3DDC97', blue: '#5B8DEF', warning: '#F5A623', danger: '#EF4444',
  info: '#0EA5E9', purple: '#8B5CF6'
};

const tabs = [
  { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
  { id: 'seeding', label: 'Environment', icon: Database },
  { id: 'mfa', label: 'MFA & Auth', icon: KeyRound },
  { id: 'orchestration', label: 'Orchestration', icon: GitBranch },
  { id: 'migration', label: 'DB Migration', icon: HardDrive },
  { id: 'sso', label: 'SSO & RBAC', icon: Users },
  { id: 'contributions', label: 'Contributions', icon: FileCode },
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
];

/* ─── Tab 1: Audit Trail ─── */
function AuditTrail() {
  const audits = [
    { id: 'AUD-1247', ts: '2025-06-19 14:32:01', agent: 'Market Data Harvester', action: 'AGENT_EXECUTE', entity: 'workflow', status: 'verified', sig: 'a3f7c2...9e4d' },
    { id: 'AUD-1246', ts: '2025-06-19 14:28:45', agent: 'Security Incident Responder', action: 'CONFIG_UPDATE', entity: 'security-policy', status: 'verified', sig: 'b8e1a4...2c7f' },
    { id: 'AUD-1245', ts: '2025-06-19 14:15:22', agent: 'Trend Identifier', action: 'WORKFLOW_START', entity: 'WF-004', status: 'verified', sig: 'c5d9e3...1a8b' },
    { id: 'AUD-1244', ts: '2025-06-19 13:58:10', agent: 'Post-Trade Analyst', action: 'AGENT_CREATE', entity: 'agent', status: 'verified', sig: 'd2f4a1...7e3c' },
    { id: 'AUD-1243', ts: '2025-06-19 13:42:55', agent: 'Liquidity Provider', action: 'DATA_EXPORT', entity: 'trading-data', status: 'pending', sig: 'e7b3c8...5d2a' },
    { id: 'AUD-1242', ts: '2025-06-19 13:21:38', agent: 'Volatility Analyzer', action: 'AGENT_CONFIG', entity: 'risk-params', status: 'verified', sig: 'f1a9d6...4b8e' },
    { id: 'AUD-1241', ts: '2025-06-19 12:45:12', agent: 'Compliance Officer', action: 'RULE_VIOLATION', entity: 'trade-7823', status: 'failed', sig: 'INVALID_SIG' },
    { id: 'AUD-1240', ts: '2025-06-19 12:30:05', agent: 'Execution Agent', action: 'TRADE_EXECUTE', entity: 'order-4521', status: 'verified', sig: 'g4h2i7...3j9k' },
    { id: 'AUD-1239', ts: '2025-06-19 11:58:47', agent: 'Database Schema Designer', action: 'MIGRATION_RUN', entity: 'schema-v2.1', status: 'verified', sig: 'h5i3j8...2k1l' },
    { id: 'AUD-1238', ts: '2025-06-19 11:15:30', agent: 'Authentication Module', action: 'TOKEN_ROTATE', entity: 'auth-service', status: 'pending', sig: 'i6j4k9...1l2m' },
  ];
  const [copied, setCopied] = useState<string | null>(null);
  const copySig = (s: string) => { navigator.clipboard?.writeText(s); setCopied(s); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:'Total Audits',v:'1,247',c:C.accent,i:Hash},{l:'Verified',v:'1,243',c:C.blue,i:CheckCircle},{l:'Failed',v:'4',c:C.danger,i:XCircle},{l:'Pending',v:'12',c:C.warning,i:Clock}].map(s=>(
          <div key={s.l} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="flex items-center gap-2"><s.i size={14} style={{color:s.c}}/><span className="text-xs" style={{color:C.textSecondary}}>{s.l}</span></div>
            <div className="text-xl font-bold font-mono mt-1" style={{color:C.textPrimary}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <table className="w-full text-xs">
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {['ID','Timestamp','Agent','Action','Entity','Status','Signature'].map(h=>(<th key={h} className="text-left p-2 font-medium" style={{color:C.textMuted}}>{h}</th>))}
          </tr></thead>
          <tbody>{audits.map(a=>{const sc=a.status==='verified'?C.accent:a.status==='failed'?C.danger:C.warning;return(
            <tr key={a.id} className="hover:opacity-80 transition-opacity" style={{borderBottom:`1px solid ${C.border}`}}>
              <td className="p-2 font-mono" style={{color:C.accent}}>{a.id}</td>
              <td className="p-2" style={{color:C.textSecondary}}>{a.ts}</td>
              <td className="p-2" style={{color:C.textPrimary}}>{a.agent}</td>
              <td className="p-2 font-mono" style={{color:C.blue}}>{a.action}</td>
              <td className="p-2" style={{color:C.textSecondary}}>{a.entity}</td>
              <td className="p-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{background:`${sc}20`,color:sc}}>{a.status}</span></td>
              <td className="p-2"><div className="flex items-center gap-1"><code className="text-[10px] font-mono" style={{color:C.textMuted}}>{a.sig}</code><button onClick={()=>copySig(a.sig)} className="p-0.5 hover:opacity-70">{copied===a.sig?<Check size={10} style={{color:C.accent}}/>:<Copy size={10} style={{color:C.textMuted}}/>}</button></div></td>
            </tr>
          )})}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Tab 2: Environment Seeding ─── */
function EnvironmentSeeding() {
  const stages = [
    { name: 'Core Database', pct: 100, status: 'complete' },
    { name: 'Agent Registry', pct: 100, status: 'complete' },
    { name: 'Workflow Templates', pct: 100, status: 'complete' },
    { name: 'Mock Data Sets', pct: 85, status: 'running' },
  ];
  const configs = [
    { name: 'PostgreSQL', ver: '16.4', icon: Database, status: 'active', port: 5432 },
    { name: 'Redis', ver: '7.2', icon: Layers, status: 'active', port: 6379 },
    { name: 'RabbitMQ', ver: '3.13', icon: GitBranch, status: 'active', port: 5672 },
    { name: 'MinIO', ver: '2025.02', icon: HardDriveIcon, status: 'active', port: 9000 },
  ];
  const logs = [
    '[14:00:01] Seed started: core database tables',
    '[14:00:03] Created 17 tables with 24 indexes',
    '[14:00:15] Imported 290 agent configurations',
    '[14:00:22] Registered 16 agent categories',
    '[14:00:45] Loaded 10 workflow templates',
    '[14:01:10] Seeding mock data sets (85%)',
    '[14:01:30] WARNING: 12 agents missing locale data',
    '[14:02:00] Retrying locale seed for agent batch #4',
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>Seeding Progress</h3>
          {stages.map(s=>{
            const c = s.pct===100?C.accent:s.pct>50?C.blue:C.warning;
            return <div key={s.name} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
              <div className="flex justify-between items-center mb-2"><span className="text-xs font-medium" style={{color:C.textPrimary}}>{s.name}</span><span className="text-xs font-mono font-bold" style={{color:c}}>{s.pct}%</span></div>
              <div className="h-2 rounded-full overflow-hidden" style={{background:`${c}15`}}><motion.div initial={{width:0}} animate={{width:`${s.pct}%`}} className="h-full rounded-full" style={{background:c}}/></div>
            </div>;
          })}
        </div>
        <div className="space-y-3">
          <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>Environment Config</h3>
          <div className="grid grid-cols-2 gap-2">{configs.map(cfg=>{
            const Icon=cfg.icon;
            return <div key={cfg.name} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
              <div className="flex items-center gap-2"><Icon size={14} style={{color:C.accent}}/><span className="text-xs font-semibold" style={{color:C.textPrimary}}>{cfg.name}</span></div>
              <div className="text-[10px] font-mono mt-1" style={{color:C.textMuted}}>v{cfg.ver} &middot; port {cfg.port}</div>
              <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full" style={{background:C.accent}}/><span className="text-[9px]" style={{color:C.accent}}>{cfg.status}</span></div>
            </div>;
          })}</div>
        </div>
      </div>
      <div className="p-3 font-mono text-[10px] space-y-1" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,maxHeight:200,overflowY:'auto'}}>
        {logs.map((l,i)=>(<div key={i} style={{color:l.includes('WARNING')?C.warning:l.includes('ERROR')?C.danger:C.textSecondary}}>{l}</div>))}
      </div>
    </div>
  );
}

/* ─── Tab 3: MFA & Auth ─── */
function MFAAuth() {
  const sessions = [
    { id: 'SES-189', user: 'admin@valtheron.ai', agent: 'Market Data Harvester', expiry: '14:45:00', status: 'active' },
    { id: 'SES-188', user: 'trader@valtheron.ai', agent: 'Trend Identifier', expiry: '15:30:00', status: 'active' },
    { id: 'SES-187', user: 'analyst@valtheron.ai', agent: 'Volatility Analyzer', expiry: '14:12:00', status: 'expiring' },
    { id: 'SES-186', user: 'dev@valtheron.ai', agent: 'API Integration Specialist', expiry: '13:58:00', status: 'expiring' },
    { id: 'SES-185', user: 'ops@valtheron.ai', agent: 'Monitoring Agent', expiry: 'EXPIRED', status: 'expired' },
    { id: 'SES-184', user: 'sec@valtheron.ai', agent: 'Security Incident Responder', expiry: '13:15:00', status: 'expired' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:'Active Sessions',v:'189',c:C.accent,i:Users},{l:'Expiring <1h',v:'12',c:C.warning,i:Timer},{l:'Expired',v:'3',c:C.danger,i:Lock},{l:'Re-auth Required',v:'7',c:C.info,i:RefreshCw}].map(s=>(
          <div key={s.l} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="flex items-center gap-2"><s.i size={14} style={{color:s.c}}/><span className="text-xs" style={{color:C.textSecondary}}>{s.l}</span></div>
            <div className="text-xl font-bold font-mono mt-1" style={{color:C.textPrimary}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <table className="w-full text-xs"><thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
          {['ID','User','Agent','Token Expiry','Status','Action'].map(h=>(<th key={h} className="text-left p-2 font-medium" style={{color:C.textMuted}}>{h}</th>))}
        </tr></thead><tbody>{sessions.map(s=>{const sc=s.status==='active'?C.accent:s.status==='expiring'?C.warning:C.danger;return(
          <tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}>
            <td className="p-2 font-mono" style={{color:C.accent}}>{s.id}</td>
            <td className="p-2" style={{color:C.textPrimary}}>{s.user}</td>
            <td className="p-2" style={{color:C.textSecondary}}>{s.agent}</td>
            <td className="p-2 font-mono" style={{color:sc}}>{s.expiry}</td>
            <td className="p-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{background:`${sc}20`,color:sc}}>{s.status}</span></td>
            <td className="p-2">{s.status==='expired'&&<button className="px-2 py-0.5 rounded text-[10px] font-medium" style={{background:`${C.danger}20`,color:C.danger}}>Force Re-auth</button>}</td>
          </tr>
        )})}</tbody></table>
      </div>
      <div className="flex items-center justify-center gap-2 p-4 flex-wrap" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        {['Token Check','Expiry Check','Grace Period','Force Re-auth'].map((step,i)=>(<div key={step} className="flex items-center gap-2"><div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{background:`${[C.accent,C.blue,C.warning,C.danger][i]}20`,color:[C.accent,C.blue,C.warning,C.danger][i]}}>{step}</div>{i<3&&<ChevronRight size={12} style={{color:C.textMuted}}/>}</div>))}
      </div>
    </div>
  );
}

/* ─── Tab 4: Orchestration ─── */
function Orchestration() {
  const endpoints = [
    { method: 'POST', path: '/api/v1/agents/execute', desc: 'Execute agent task', auth: 'Bearer + Forseti' },
    { method: 'GET', path: '/api/v1/agents/{id}/status', desc: 'Get agent status', auth: 'Bearer' },
    { method: 'POST', path: '/api/v1/workflows/trigger', desc: 'Trigger workflow', auth: 'Bearer + Role' },
    { method: 'GET', path: '/api/v1/health', desc: 'System health check', auth: 'None' },
  ];
  const flow = ['Trigger','Queue','Dispatch','Execute','Callback'];

  return (
    <div className="space-y-4">
      <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>API Reference</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {endpoints.map(ep=>{
          const mc=ep.method==='GET'?C.blue:C.accent;
          return <div key={ep.path} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono" style={{background:`${mc}20`,color:mc}}>{ep.method}</span><code className="text-xs font-mono" style={{color:C.textPrimary}}>{ep.path}</code></div>
            <div className="text-xs mt-1" style={{color:C.textSecondary}}>{ep.desc}</div>
            <div className="text-[10px] mt-1 font-mono" style={{color:C.textMuted}}>Auth: {ep.auth}</div>
          </div>;
        })}
      </div>
      <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>Orchestration Flow</h3>
      <div className="flex items-center justify-center gap-2 p-4 flex-wrap" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        {flow.map((step,i)=>(<div key={step} className="flex items-center gap-2"><div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{background:`${[C.accent,C.blue,C.purple,C.warning,C.info][i]}20`,color:[C.accent,C.blue,C.purple,C.warning,C.info][i]}}>{step}</div>{i<4&&<ArrowRight size={12} style={{color:C.textMuted}}/>}</div>))}
      </div>
      <div className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <h4 className="text-xs font-semibold mb-2" style={{color:C.textPrimary}}>Active Executions</h4>
        <div className="space-y-2">{['Market Data Harvester','Backtesting Engine','Sentiment Analyst'].map((name,i)=>{
          const p=[78,92,45][i];
          const col=[C.accent,C.blue,C.warning][i];
          return <div key={name} className="flex items-center gap-3"><span className="text-xs w-40 truncate" style={{color:C.textPrimary}}>{name}</span><div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:`${col}15`}}><div className="h-full rounded-full transition-all" style={{width:`${p}%`,background:col}}/></div><span className="text-[10px] font-mono w-8" style={{color:col}}>{p}%</span></div>;
        })}</div>
      </div>
    </div>
  );
}

/* ─── Tab 5: DB Migration ─── */
function DBMigration() {
  const logs = [
    '[10:00:01] Migration started: SQLite to PostgreSQL 16',
    '[10:00:15] Migrated table: agents (290 rows)',
    '[10:00:45] Migrated table: workflows (48 rows)',
    '[10:01:10] Migrated table: tasks (156 rows)',
    '[10:01:30] Migrated table: audit_log (1,247 rows)',
    '[10:02:00] Creating indexes (24/24)',
    '[10:02:30] Enabling WAL mode',
    '[10:03:00] Verification: 2,847,312 rows migrated',
    '[10:03:15] Data integrity check: PASSED',
    '[10:03:30] Optimizing vacuum...',
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 text-center" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <div className="text-3xl font-bold font-mono" style={{color:C.accent}}>94%</div>
        <div className="text-xs mt-1" style={{color:C.textSecondary}}>Migration Complete</div>
        <div className="h-3 rounded-full overflow-hidden mt-3" style={{background:`${C.accent}15`}}><div className="h-full rounded-full" style={{width:'94%',background:C.accent}}/></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:'Tables',v:'17/17',c:C.accent},{l:'Indexes',v:'24/24',c:C.blue},{l:'Data Rows',v:'2.8M',c:C.purple},{l:'Time',v:'4h 23m',c:C.warning}].map(s=>(
          <div key={s.l} className="p-3 text-center" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="text-lg font-bold font-mono" style={{color:s.c}}>{s.v}</div>
            <div className="text-[10px] mt-1" style={{color:C.textSecondary}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
          <div className="flex items-center gap-2 mb-2"><HardDriveIcon size={14} style={{color:C.textMuted}}/><span className="text-xs font-semibold" style={{color:C.textPrimary}}>SQLite (Source)</span></div>
          <div className="text-[10px] font-mono space-y-1" style={{color:C.textMuted}}><div>Version: 3.45.1</div><div>Tables: 17</div><div>Size: 1.2 GB</div><div>WAL: disabled</div></div>
        </div>
        <div className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
          <div className="flex items-center gap-2 mb-2"><Server size={14} style={{color:C.accent}}/><span className="text-xs font-semibold" style={{color:C.textPrimary}}>PostgreSQL 16 (Target)</span></div>
          <div className="text-[10px] font-mono space-y-1" style={{color:C.textMuted}}><div>Version: 16.4</div><div>Tables: 17</div><div>Size: 2.8 GB</div><div>WAL: enabled</div></div>
        </div>
      </div>
      <div className="p-3 font-mono text-[10px] space-y-1" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,maxHeight:200,overflowY:'auto'}}>
        {logs.map((l,i)=>(<div key={i} style={{color:C.textSecondary}}>{l}</div>))}
      </div>
    </div>
  );
}

/* ─── Tab 6: SSO & RBAC ─── */
function SSORBAC() {
  const providers = [
    { name: 'Google Workspace', status: 'connected', users: 89, lastSync: '2m ago' },
    { name: 'Microsoft Entra ID', status: 'connected', users: 67, lastSync: '5m ago' },
    { name: 'Okta', status: 'disconnected', users: 0, lastSync: 'N/A' },
  ];
  const roles = ['Owner','Admin','Editor','Viewer'];
  const perms = ['Agents','Workflows','Tasks','Analytics','Settings','Users','Audit','Deploy'];
  const matrix: Record<string, string[]> = {
    Owner: ['full','full','full','full','full','full','full','full'],
    Admin: ['full','full','full','full','full','read','read','full'],
    Editor: ['read','full','full','read','none','none','none','read'],
    Viewer: ['read','read','read','read','none','none','none','none'],
  };

  return (
    <div className="space-y-4">
      <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>Identity Providers</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {providers.map(p=>{
          const s=p.status==='connected';
          return <div key={p.name} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold" style={{color:C.textPrimary}}>{p.name}</span><div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{background:s?C.accent:C.danger}}/><span className="text-[10px]" style={{color:s?C.accent:C.danger}}>{p.status}</span></div></div>
            <div className="text-[10px] mt-2" style={{color:C.textMuted}}>Users: {p.users} &middot; Last sync: {p.lastSync}</div>
          </div>;
        })}
      </div>
      <h3 style={{color:C.textPrimary,fontSize:'0.875rem',fontWeight:600}}>RBAC Permission Matrix</h3>
      <div className="overflow-x-auto" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <table className="w-full text-xs"><thead><tr style={{borderBottom:`1px solid ${C.border}`}}><th className="text-left p-2 font-medium" style={{color:C.textMuted}}>Role</th>{perms.map(p=>(<th key={p} className="text-center p-2 font-medium" style={{color:C.textMuted}}>{p}</th>))}</tr></thead>
        <tbody>{roles.map(role=>(<tr key={role} style={{borderBottom:`1px solid ${C.border}`}}>
          <td className="p-2 font-semibold" style={{color:C.textPrimary}}>{role}</td>{matrix[role].map((v,i)=>{
            const c=v==='full'?C.accent:v==='read'?C.warning:C.danger;
            return <td key={i} className="p-2 text-center">{v==='full'?<CheckCircle size={12} style={{color:c,margin:'0 auto'}}/>:v==='read'?<Eye size={12} style={{color:c,margin:'0 auto'}}/>:<Ban size={12} style={{color:c,margin:'0 auto'}}/>}</td>;
          })}</tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Tab 7: Contributions ─── */
function Contributions() {
  const stages = [
    { name: 'Submit', count: 12, color: C.info },
    { name: 'Review', count: 8, color: C.blue },
    { name: 'Test', count: 5, color: C.purple },
    { name: 'Approve', count: 3, color: C.accent },
    { name: 'Deploy', count: 2, color: C.warning },
  ];
  const contribs = [
    { title: 'Add HFT latency metrics', author: 'dev-sarah', branch: 'feature/hft-metrics', status: 'testing' },
    { title: 'Update Forseti scoring algo', author: 'sec-mike', branch: 'feature/forseti-v2', status: 'review' },
    { title: 'PostgreSQL migration scripts', author: 'ops-alex', branch: 'feature/pg-migration', status: 'approved' },
    { title: 'MFA token refresh flow', author: 'auth-jenny', branch: 'feature/mfa-refresh', status: 'submitted' },
    { title: 'Agent orchestration API', author: 'api-tom', branch: 'feature/orchestration', status: 'deployed' },
    { title: 'Security audit log viewer', author: 'sec-mike', branch: 'feature/audit-ui', status: 'testing' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 p-4 flex-wrap" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        {stages.map((s,i)=>(<div key={s.name} className="flex items-center gap-2"><div className="text-center"><div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{background:`${s.color ?? C.accent}20`,color:s.color ?? C.accent}}>{s.name}</div><div className="text-[10px] font-mono mt-1" style={{color:C.textMuted}}>{s.count}</div></div>{i<4&&<ArrowRight size={12} style={{color:C.textMuted}}/>}</div>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {contribs.map(c=>{
          const sc=c.status==='deployed'?C.accent:c.status==='approved'?C.blue:c.status==='testing'?C.purple:c.status==='review'?C.warning:C.info;
          return <div key={c.branch} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="text-xs font-medium" style={{color:C.textPrimary}}>{c.title}</div>
            <div className="text-[10px] mt-1 font-mono" style={{color:C.textMuted}}>{c.branch}</div>
            <div className="flex items-center justify-between mt-2"><span className="text-[10px]" style={{color:C.textSecondary}}>by {c.author}</span><span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{background:`${sc}20`,color:sc}}>{c.status}</span></div>
          </div>;
        })}
      </div>
    </div>
  );
}

/* ─── Tab 8: Health Check ─── */
function HealthCheck() {
  const modules = [
    { name: 'Auth', status: 'operational', uptime: 99.97, latency: 45 },
    { name: 'Agents', status: 'operational', uptime: 99.95, latency: 67 },
    { name: 'Tasks', status: 'operational', uptime: 99.98, latency: 34 },
    { name: 'Workflows', status: 'operational', uptime: 99.94, latency: 52 },
    { name: 'Collab', status: 'degraded', uptime: 98.76, latency: 89 },
    { name: 'Security', status: 'operational', uptime: 99.99, latency: 12 },
    { name: 'Analytics', status: 'operational', uptime: 99.92, latency: 78 },
    { name: 'Files', status: 'operational', uptime: 99.96, latency: 41 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-6" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke={`${C.accent}15`} strokeWidth="8"/><circle cx="50" cy="50" r="42" fill="none" stroke={C.accent} strokeWidth="8" strokeDasharray={`${97.8*2.64} ${100*2.64}`} strokeLinecap="round"/></svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold font-mono" style={{color:C.accent}}>97.8%</span><span className="text-[10px]" style={{color:C.textMuted}}>Health Score</span></div>
        </div>
        <div className="text-[10px] mt-2" style={{color:C.textMuted}}>Last run: 2025-06-19 14:00:00 UTC</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map(m=>{
          const s=m.status==='operational';
          return <div key={m.name} className="p-3" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
            <div className="flex items-center justify-between"><span className="text-xs font-medium" style={{color:C.textPrimary}}>{m.name}</span><div className="w-1.5 h-1.5 rounded-full" style={{background:s?C.accent:C.warning}}/></div>
            <div className="text-[10px] mt-1 font-mono" style={{color:C.textMuted}}>Uptime: {m.uptime}%</div>
            <div className="text-[10px] font-mono" style={{color:C.textMuted}}>Latency: {m.latency}ms</div>
          </div>;
        })}
      </div>
    </div>
  );
}

/* ─── Tab 9: Incidents ─── */
function Incidents() {
  const incidents = [
    { id: 'INC-042', sev: 'critical', title: 'HFT engine latency spike >500ms', status: 'open', assigned: 'Execution Agent', created: '2025-06-19 13:45:00', resolved: '-' },
    { id: 'INC-041', sev: 'high', title: 'Auth service intermittent 503 errors', status: 'mitigated', assigned: 'Auth Module', created: '2025-06-19 12:30:00', resolved: '13:15:00' },
    { id: 'INC-040', sev: 'medium', title: 'Market data feed delay 2.3s', status: 'resolved', assigned: 'Market Data Harvester', created: '2025-06-19 11:00:00', resolved: '12:45:00' },
    { id: 'INC-039', sev: 'low', title: 'Documentation build warning', status: 'resolved', assigned: 'Doc Builder', created: '2025-06-19 10:15:00', resolved: '10:30:00' },
    { id: 'INC-038', sev: 'high', title: 'Memory leak in agent runtime', status: 'open', assigned: 'Agent Runtime', created: '2025-06-19 09:00:00', resolved: '-' },
    { id: 'INC-037', sev: 'critical', title: 'Database connection pool exhausted', status: 'resolved', assigned: 'DB Admin', created: '2025-06-19 08:30:00', resolved: '09:45:00' },
    { id: 'INC-036', sev: 'medium', title: 'SSL certificate expiry warning', status: 'mitigated', assigned: 'Security Agent', created: '2025-06-19 07:00:00', resolved: '-' },
    { id: 'INC-035', sev: 'low', title: 'Monitoring dashboard slow load', status: 'resolved', assigned: 'Monitoring Agent', created: '2025-06-19 06:00:00', resolved: '06:30:00' },
  ];
  const sevColors: Record<string, string> = { critical: C.danger, high: C.warning, medium: C.info, low: C.textMuted };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {[{l:'Critical',c:C.danger},{l:'High',c:C.warning},{l:'Medium',c:C.info},{l:'Low',c:C.textMuted}].map(s=>(<div key={s.l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:s.c}}/><span className="text-[10px]" style={{color:C.textSecondary}}>{s.l}</span></div>))}
      </div>
      <div className="overflow-x-auto" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        <table className="w-full text-xs"><thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
          {['ID','Severity','Title','Status','Assigned','Created','Resolved'].map(h=>(<th key={h} className="text-left p-2 font-medium" style={{color:C.textMuted}}>{h}</th>))}
        </tr></thead><tbody>{incidents.map(inc=>{
          const sc=sevColors[inc.sev];
          const stc=inc.status==='resolved'?C.accent:inc.status==='mitigated'?C.warning:C.danger;
          return <tr key={inc.id} style={{borderBottom:`1px solid ${C.border}`}}>
            <td className="p-2 font-mono" style={{color:C.accent}}>{inc.id}</td>
            <td className="p-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{background:`${sc}20`,color:sc}}>{inc.sev}</span></td>
            <td className="p-2 max-w-[200px] truncate" style={{color:C.textPrimary}}>{inc.title}</td>
            <td className="p-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{background:`${stc}20`,color:stc}}>{inc.status}</span></td>
            <td className="p-2" style={{color:C.textSecondary}}>{inc.assigned}</td>
            <td className="p-2 font-mono" style={{color:C.textMuted}}>{inc.created.split(' ')[1]}</td>
            <td className="p-2 font-mono" style={{color:inc.resolved!=='-'?C.accent:C.textMuted}}>{inc.resolved}</td>
          </tr>;
        })}</tbody></table>
      </div>
      <div className="flex items-center justify-center gap-2 p-4 flex-wrap" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
        {['Detection','Triage','Containment','Resolution','Post-mortem'].map((step,i)=>(<div key={step} className="flex items-center gap-2"><div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{background:`${[C.danger,C.warning,C.info,C.accent,C.purple][i]}20`,color:[C.danger,C.warning,C.info,C.accent,C.purple][i]}}>{step}</div>{i<4&&<ArrowRight size={12} style={{color:C.textMuted}}/>}</div>))}
      </div>
    </div>
  );
}

/* ─── Main: Operations Center ─── */
export default function Operations() {
  const [activeTab, setActiveTab] = useState('audit');
  const ActiveComponent = {
    audit: AuditTrail, seeding: EnvironmentSeeding, mfa: MFAAuth,
    orchestration: Orchestration, migration: DBMigration, sso: SSORBAC,
    contributions: Contributions, health: HealthCheck, incidents: Incidents,
  }[activeTab] || AuditTrail;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: C.bg }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Terminal size={20} style={{ color: C.accent }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: C.textPrimary }}>Operations Center</h1>
        </div>
        <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>System operations, diagnostics, and administration</p>
      </motion.div>

      <div className="mt-4 flex flex-wrap gap-1 p-1" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: isActive ? `${C.accent}20` : 'transparent',
                color: isActive ? C.accent : C.textSecondary,
                border: isActive ? `1px solid ${C.accent}40` : '1px solid transparent',
              }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}