import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import PageLoading from './components/PageLoading';
import ErrorBoundary from './components/ErrorBoundary';

/* ═════════════════════════════════════════════════════════════
   Route-Level Code Splitting — each page is its own chunk
   Chunk naming: valtheron-[pagename]-[hash].js
   ═════════════════════════════════════════════════════════════ */

// ─── Core Pages ───
const Home          = lazy(() => import(/* webpackChunkName: "valtheron-home" */          './pages/Home'));
const Monitoring    = lazy(() => import(/* webpackChunkName: "valtheron-monitoring" */    './pages/Monitoring'));
const Agents        = lazy(() => import(/* webpackChunkName: "valtheron-agents" */        './pages/Agents'));
// ─── Workflow Pages ───
const Templates     = lazy(() => import(/* webpackChunkName: "valtheron-templates" */     './pages/Templates'));
const Collaboration = lazy(() => import(/* webpackChunkName: "valtheron-collaboration" */ './pages/Collaboration'));
const Customization = lazy(() => import(/* webpackChunkName: "valtheron-customization" */ './pages/Customization'));
const Guides        = lazy(() => import(/* webpackChunkName: "valtheron-guides" */        './pages/Guides'));
const Operations    = lazy(() => import(/* webpackChunkName: "valtheron-operations" */    './pages/Operations'));
// ─── Infrastructure Pages (Phase 3-7) ───
const Security      = lazy(() => import(/* webpackChunkName: "valtheron-security" */      './pages/Security'));
const ApiDocs       = lazy(() => import(/* webpackChunkName: "valtheron-api" */           './pages/API'));
const Database      = lazy(() => import(/* webpackChunkName: "valtheron-database" */      './pages/Database'));
const Orchestrator  = lazy(() => import(/* webpackChunkName: "valtheron-orchestrator" */  './pages/Orchestrator'));
const Deployment    = lazy(() => import(/* webpackChunkName: "valtheron-deployment" */    './pages/Deployment'));
// ─── System ───
const NotFound      = lazy(() => import(/* webpackChunkName: "valtheron-notfound" */      './pages/NotFound'));

/** Wraps each route in an ErrorBoundary to isolate crashes */
function LazyPage({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Core */}
        <Route index            element={<LazyPage><Home /></LazyPage>} />
        <Route path="monitoring"   element={<LazyPage><Monitoring /></LazyPage>} />
        <Route path="agents"       element={<LazyPage><Agents /></LazyPage>} />
        {/* Workflow */}
        <Route path="templates"    element={<LazyPage><Templates /></LazyPage>} />
        <Route path="collaboration"element={<LazyPage><Collaboration /></LazyPage>} />
        <Route path="customization"element={<LazyPage><Customization /></LazyPage>} />
        <Route path="guides"       element={<LazyPage><Guides /></LazyPage>} />
        <Route path="operations"   element={<LazyPage><Operations /></LazyPage>} />
        {/* Infrastructure — Phase 3-7 */}
        <Route path="security"     element={<LazyPage><Security /></LazyPage>} />
        <Route path="api-docs"     element={<LazyPage><ApiDocs /></LazyPage>} />
        <Route path="database"     element={<LazyPage><Database /></LazyPage>} />
        <Route path="orchestrator" element={<LazyPage><Orchestrator /></LazyPage>} />
        <Route path="deployment"   element={<LazyPage><Deployment /></LazyPage>} />
        {/* 404 catch-all */}
        <Route path="*"            element={<LazyPage><NotFound /></LazyPage>} />
      </Route>
    </Routes>
  );
}
