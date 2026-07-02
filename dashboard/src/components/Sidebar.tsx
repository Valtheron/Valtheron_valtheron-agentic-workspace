import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard, Activity, Library, Users, Sliders, Bot, Terminal,
  ChevronLeft, ChevronRight, Settings, LogOut, User, Shield, Zap, BookOpen,
  Lock, Globe, Database, Cpu, Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Nav Items — grouped by category ─── */
const navItems = [
  // Core
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Monitoring', path: '/monitoring', icon: Activity },
  { label: 'Agents', path: '/agents', icon: Bot },
  { label: 'Console', path: '/console', icon: Zap },
  // Workflow
  { label: 'Templates', path: '/templates', icon: Library },
  { label: 'Collaboration', path: '/collaboration', icon: Users },
  { label: 'Customization', path: '/customization', icon: Sliders },
  { label: 'Guides', path: '/guides', icon: BookOpen },
  { label: 'Operations', path: '/operations', icon: Terminal },
  // Infrastructure
  { label: 'Security', path: '/security', icon: Lock },
  { label: 'API', path: '/api-docs', icon: Globe },
  { label: 'Database', path: '/database', icon: Database },
  { label: 'Orchestrator', path: '/orchestrator', icon: Cpu },
  { label: 'Deployment', path: '/deployment', icon: Cloud },
];

/* ─── Tooltip for Collapsed Items ─── */
function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative flex items-center">
      {children}
      <div
        className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
        style={{
          backgroundColor: '#1a2230',
          color: '#F0F2F5',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Logo ─── */
function ValtheronLogo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center px-3 py-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: 'rgba(61,220,151,0.2)', color: '#3DDC97', fontFamily: 'JetBrains Mono, monospace' }}
        >
          V
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
        style={{ backgroundColor: 'rgba(61,220,151,0.2)', color: '#3DDC97', fontFamily: 'JetBrains Mono, monospace' }}
      >
        V
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F0F2F5', fontFamily: 'JetBrains Mono, monospace' }}>
          VALTHERON
        </div>
        <div style={{ fontSize: '0.625rem', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
          AGENTIC WORKSPACE
        </div>
      </div>
    </div>
  );
}

/* ─── User Profile (Bottom) ─── */
function UserProfile({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="px-3 pb-3">
        <div className="flex justify-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{ backgroundColor: 'rgba(61,220,151,0.2)', color: '#3DDC97', border: '1px solid rgba(61,220,151,0.3)' }}
            title="Admin User"
          >
            A
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="px-3 pb-3">
      <div
        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:opacity-80"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'rgba(61,220,151,0.2)', color: '#3DDC97', border: '1px solid rgba(61,220,151,0.3)' }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate" style={{ color: '#F0F2F5' }}>Administrator</div>
          <div className="text-[10px] truncate" style={{ color: '#4A5568' }}>admin@valtheron.ai</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Bottom Actions ─── */
function BottomActions({ collapsed }: { collapsed: boolean }) {
  const actions = [
    { icon: Settings, label: 'Settings', onClick: () => {} },
    { icon: LogOut, label: 'Logout', onClick: () => {} },
  ];

  return (
    <div className="px-3 pb-2 space-y-1">
      {actions.map((action) => {
        const Icon = action.icon;
        if (collapsed) {
          return (
            <NavTooltip key={action.label} label={action.label}>
              <button
                className="flex items-center justify-center w-full rounded-lg transition-all hover:opacity-80"
                style={{ height: '36px', color: '#4A5568' }}
                onClick={action.onClick}
              >
                <Icon size={16} />
              </button>
            </NavTooltip>
          );
        }
        return (
          <button
            key={action.label}
            className="flex items-center gap-2 px-3 w-full rounded-lg transition-all hover:opacity-80"
            style={{ height: '32px', color: '#4A5568', fontSize: '0.75rem' }}
            onClick={action.onClick}
          >
            <Icon size={14} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Status Bar ─── */
function StatusBar({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="px-3 py-2 flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3DDC97' }} />
            <span className="text-[9px] font-mono" style={{ color: '#3DDC97' }}>72</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={8} style={{ color: '#F5A623' }} />
            <span className="text-[9px] font-mono" style={{ color: '#F5A623' }}>3</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="mx-3 mb-2 p-2 rounded-lg flex items-center justify-between"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-1.5">
        <Zap size={10} style={{ color: '#3DDC97' }} />
        <span className="text-[10px] font-mono" style={{ color: '#3DDC97' }}>72 Active</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield size={10} style={{ color: '#F5A623' }} />
        <span className="text-[10px] font-mono" style={{ color: '#F5A623' }}>3 Alerts</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN: Sidebar
   ═══════════════════════════════════════════════════════════════════ */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-[56px] h-[calc(100vh-56px)] flex flex-col transition-all duration-300 z-40 border-r"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'rgba(255,255,255,0.06)',
        background: 'linear-gradient(90deg, rgba(61,220,151,0.08) 0%, transparent 50%), var(--bg-surface)',
      }}
    >
      {/* Logo */}
      <ValtheronLogo collapsed={collapsed} />

      {/* Divider */}
      <div className="mx-3 mb-2" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

      {/* Status Bar */}
      <StatusBar collapsed={collapsed} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            const linkContent = (
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className="flex items-center gap-3 px-3 rounded-lg transition-all relative"
                style={{
                  height: '44px',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(61,220,151,0.15)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 rounded-r"
                    style={{
                      width: '3px',
                      height: '60%',
                      backgroundColor: 'var(--accent-primary)',
                    }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                )}
                <Icon size={18} />
                {!collapsed && (
                  <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                )}
              </NavLink>
            );

            return (
              <li key={item.label}>
                {collapsed ? (
                  <NavTooltip label={item.label}>
                    {linkContent}
                  </NavTooltip>
                ) : (
                  linkContent
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Divider */}
        <div className="mx-3 mb-2" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

        {/* User Profile */}
        <UserProfile collapsed={collapsed} />

        {/* Bottom Actions */}
        <BottomActions collapsed={collapsed} />

        {/* Collapse Toggle */}
        <div className="px-3 pb-4 pt-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center gap-2 w-full rounded-lg transition-all hover:opacity-80"
            style={{
              height: '36px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-hover)',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : (
              <>
                <ChevronLeft size={16} />
                <span style={{ fontSize: '0.75rem' }}>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
