// ═══════════════════════════════════════════════════════════════════════════════
// Valtheron Agentic Worksproactivity v2.0 — Authentic Mock Data
// Source: Valtheron Handbuch v2.0 (Februar 2026) + Architecture Docs
// Tech: PostgreSQL 16, Redis, Minio S3, Express 5.1, React 19
// 291 Agents (200 Basis + 91 Extended), 16 Categories, 8 Archetypes
// 12 Personality Parameters, 6 Cert Levels, 3 Workflow Types, 5 Collab Patterns
// ═══════════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────────
// 1. TYPE INTERFACES
// ───────────────────────────────────────────────────────────────────────────────

/** 16 Categories — 10 Basis-Set (200 agents) + 6 Extended-Set (91 agents) */
export type AgentCategory =
  // Basis-Set: Opus for ANA,GES,ENT,SCH | Sonnet for DEV,MKT,PRO,ECO,LEH,ETR
  | 'GES' | 'ANA' | 'MKT' | 'PRO' | 'ENT' | 'ETR' | 'LEH' | 'SCH' | 'ECO' | 'DEV'
  // Extended-Set: Opus for AIN,MET,FIN,DAT | Sonnet for HYB,HUM
  | 'AIN' | 'MET' | 'FIN' | 'HYB' | 'HUM' | 'DAT';

export type AgentStatus = 'active' | 'idle' | 'busy' | 'offline';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
/** 3 Workflow Types per Handbuch v2.0 */
export type WorkflowType = 'sequential' | 'hierarchical' | 'debate';
export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'pending';
export type CollabStatus = 'active' | 'completed' | 'pending' | 'failed';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type CertLevel = 'UNCERTIFIED' | 'TECHNICAL_VALID' | 'FORSETI_VERIFIED' | 'EXPERT_REVIEWED' | 'FIELD_TESTED' | 'CERTIFIED_PROFESSIONAL';
/** Anthropic only per Handbuch v2.0 */
export type LLMProvider = 'Anthropic';
export type ArchetypeName = 'Visionary' | 'Analyst' | 'Diplomat' | 'Strategist' | 'Guardian' | 'Innovator' | 'Executor' | 'Sage';
export type ActivityType = 'workflow' | 'agent' | 'system' | 'comment' | 'security';

/**
 * 12 Personality Parameters per Handbuch v2.0
 * Derived from 3 Layer Metrics: LDS (Layer Depth Score), MI (Measurability Index), EP (Emergence Potential)
 */
export interface PersonalityProfile {
  formality: number;        // Locker (0) — Formell (1)
  verbosity: number;        // Knapp (0) — Ausführlich (1)
  warmth: number;           // Sachlich (0) — Warmherzig (1)
  creativity: number;       // Konventionell (0) — Kreativ (1)
  structure: number;        // Fliessend (0) — Strukturiert (1)
  risk_tolerance: number;   // Vorsichtig (0) — Mutig (1)
  proactivity: number;      // Reaktiv (0) — Proaktiv (1)
  curiosity: number;        // Fokussiert (0) — Neugierig (1)
  collaboration: number;    // Autonom (0) — Kollaborativ (1)
  depth: number;            // Breit (0) — Tief (1)
  confidence: number;       // Abwaegend (0) — Bestimmt (1)
  adaptability: number;     // Konsistent (0) — Flexibel (1)
}

export interface Agent {
  id: string;
  name: string;
  display_name: string;
  category: AgentCategory;
  llmModelShort: 'Opus' | 'Sonnet';
  status: AgentStatus;
  role: string;
  llmProvider: LLMProvider;
  llmModel: string;
  personality: ArchetypeName;
  certificationLevel: CertLevel;
  powerLevel: number;
  tasksCompleted: number;
  successRate: number;
  lastActive: string;
  description: string;
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: AgentCategory;
  assignedAgentId: string;
  progress: number;
  dueDate: string;
  tags: string[];
  description: string;
}

export interface WorkflowStep {
  agentId: string;
  role: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  type: WorkflowType;
  category: AgentCategory;
  description: string;
  steps: WorkflowStep[];
  usageCount: number;
  successRate: number;
  avgExecutionTime: string;
  creator: string;
  sharedWith: string[];
  isTemplate: boolean;
  createdAt: string;
  tags: string[];
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  status: WorkflowStatus;
  currentStep: number;
  progress: number;
  startedAt: string;
  completedAt?: string;
  assignedAgents: string[];
  output?: string;
}

export interface CollabMessage {
  agentId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'code' | 'analysis' | 'decision' | 'alert';
}

export interface CollaborationPattern {
  id: string;
  name: string;
  description: string;
  participatingAgents: string[];
  coordinatorAgentId: string;
  status: CollabStatus;
  messages: CollabMessage[];
  artifacts: string[];
  sessionId: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  agentId?: string;
  agentName: string;
  action: string;
  target: string;
  targetId?: string;
  timestamp: string;
  severity?: Severity;
  details?: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: Severity;
  agentId?: string;
  agentName: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  resolution?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  message: string;
  read: boolean;
  priority: TaskPriority;
  timestamp: string;
  actionUrl?: string;
}

export type ModuleName = 'auth' | 'agents' | 'tasks' | 'workflows' | 'chat' | 'collab' | 'security' | 'analytics' | 'files' | 'tree' | 'notifications' | 'secrets' | 'backup' | 'health';

export interface SystemModule {
  name: ModuleName;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  connections: number;
  lastError?: string;
}

export interface LLMProviderHealth {
  name: LLMProvider;
  status: 'operational' | 'degraded' | 'down';
  requestsPerMin: number;
  avgLatency: number;
  errorRate: number;
  activeConnections: number;
}

export interface SystemHealthData {
  modules: SystemModule[];
  services: ServiceHealth[];
  llmProviders: LLMProviderHealth[];
  database: DbConfig;
  cache: CacheConfig;
  storage: StorageConfig;
}

interface DbConfig {
  type: string;
  version: string;
  tables: number;
  indexes: number;
  walMode: boolean;
  cacheHitRate: number;
  connections: number;
  transactionsPerSec: number;
  replicationStatus: string;
  sizeMB: number;
  maxConnections: number;
}

interface CacheConfig {
  type: string;
  version: string;
  status: string;
  connections: number;
}

interface StorageConfig {
  type: string;
  version: string;
  buckets: number;
  totalSizeMB: number;
}

export interface MetricsData {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  busyAgents: number;
  offlineAgents: number;
  tasksCompleted: number;
  tasksInProgress: number;
  avgResponseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkThroughput: number;
  wsConnections: number;
  dbQueryRate: number;
  requestsPerMin: number;
}

export interface CertificationLevel {
  level: CertLevel;
  count: number;
  color: string;
  requirements: string;
  avgTime: string;
  percentage: number;
}

export interface PersonalityArchetype {
  name: ArchetypeName;
  description: string;
  traits: PersonalityProfile;
  strengths: string[];
  weaknesses: string[];
  bestRoles: string[];
  compatibility: ArchetypeName[];
  agentCount: number;
}

export interface LLMProviderData {
  name: LLMProvider;
  status: 'operational' | 'degraded' | 'down';
  models: string[];
  requestsPerMin: number;
  avgLatency: number;
  errorRate: number;
  activeConnections: number;
  tokenThroughput?: number;
  costPer1KTokens?: number;
}

export interface WorksproactivityStats {
  totalAgents: number;
  activeNow: number;
  idleNow: number;
  busyNow: number;
  offlineNow: number;
  totalTasks: number;
  tasksCompletedToday: number;
  tasksInProgress: number;
  tasksBlocked: number;
  totalWorkflows: number;
  workflowsRunning: number;
  workflowsCompletedToday: number;
  activeCollaborations: number;
  avgAgentSuccessRate: number;
  avgAgentPowerLevel: number;
  topCategory: AgentCategory;
  totalMessagesExchanged: number;
  securityEvents24h: number;
  unresolvedSecurityEvents: number;
  avgLlmLatency: number;
  dbSizeMB: number;
  systemUptime: number;
  version: string;
  lastDeployed: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatar: string;
  status: 'online' | 'away' | 'offline';
  workflowsShared: number;
  lastActive: string;
  email: string;
}

export interface ForsetiDimension {
  name: string;
  description: string;
  weight: number;
  scale: number;
}

export interface PresetConfig {
  name: string;
  description: string;
  personality: PersonalityProfile;
  forseti: {
    InformationAccess: number;
    ResourceControl: number;
    AuthorityPermission: number;
    NetworkPosition: number;
    SynthesisApplication: number;
  };
  llm: {
    provider: LLMProvider;
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────────────────────
// 2. AGENTS DATA — 291 agents (200 Basis-Set + 91 Extended-Set)
// ID Format: VLT-[CAT]-[4-char-hash] per Handbuch v2.0
// ───────────────────────────────────────────────────────────────────────────────

export const agentsData: Agent[] = [
  // GES — Gesundheitsexperten (20) — Opus
  { id: 'VLT-GES-A043', name: 'fitness_app_entwickler', display_name: 'Fitness-App-Entwickler', category: 'GES', status: 'idle', role: 'Fitness-App-Entwickler', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'UNCERTIFIED', powerLevel: 4, tasksCompleted: 1346, successRate: 89.7, lastActive: '2025-06-17T11:11Z', description: 'Fitness-App-Entwickler in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-3157', name: 'ernährungsberater', display_name: 'Ernährungsberater', category: 'GES', status: 'active', role: 'Ernährungsberater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'FIELD_TESTED', powerLevel: 10, tasksCompleted: 3731, successRate: 97.3, lastActive: '2025-06-17T14:25Z', description: 'Ernährungsberater in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-E795', name: 'wellness_trainer', display_name: 'Wellness-Trainer', category: 'GES', status: 'idle', role: 'Wellness-Trainer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 4446, successRate: 99.4, lastActive: '2025-06-17T12:57Z', description: 'Wellness-Trainer in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-E685', name: 'mental_coach', display_name: 'Mental-Coach', category: 'GES', status: 'active', role: 'Mental-Coach', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 3101, successRate: 98.7, lastActive: '2025-06-17T20:57Z', description: 'Mental-Coach in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-76E4', name: 'reha_spezialist', display_name: 'Reha-Spezialist', category: 'GES', status: 'active', role: 'Reha-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 2662, successRate: 97.2, lastActive: '2025-06-17T11:47Z', description: 'Reha-Spezialist in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-8077', name: 'sportanalytiker', display_name: 'Sportanalytiker', category: 'GES', status: 'busy', role: 'Sportanalytiker', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 3079, successRate: 91.0, lastActive: '2025-06-17T10:11Z', description: 'Sportanalytiker in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-1E70', name: 'gesundheitsforscher', display_name: 'Gesundheitsforscher', category: 'GES', status: 'busy', role: 'Gesundheitsforscher', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'UNCERTIFIED', powerLevel: 9, tasksCompleted: 2326, successRate: 98.1, lastActive: '2025-06-17T13:24Z', description: 'Gesundheitsforscher in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-BCA7', name: 'yoga_guide', display_name: 'Yoga-Guide', category: 'GES', status: 'idle', role: 'Yoga-Guide', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 7307, successRate: 89.8, lastActive: '2025-06-17T19:11Z', description: 'Yoga-Guide in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-DCBB', name: 'stress_manager', display_name: 'Stress-Manager', category: 'GES', status: 'active', role: 'Stress-Manager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'UNCERTIFIED', powerLevel: 5, tasksCompleted: 6846, successRate: 85.7, lastActive: '2025-06-17T13:55Z', description: 'Stress-Manager in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-17CE', name: 'schlafexperte', display_name: 'Schlafexperte', category: 'GES', status: 'active', role: 'Schlafexperte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 6933, successRate: 97.3, lastActive: '2025-06-17T21:44Z', description: 'Schlafexperte in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-1D09', name: 'ernährungswissenschaftler', display_name: 'Ernährungswissenschaftler', category: 'GES', status: 'idle', role: 'Ernährungswissenschaftler', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 4842, successRate: 89.1, lastActive: '2025-06-17T13:38Z', description: 'Ernährungswissenschaftler in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-57D8', name: 'physiotherapie_experte', display_name: 'Physiotherapie-Experte', category: 'GES', status: 'active', role: 'Physiotherapie-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 5247, successRate: 91.1, lastActive: '2025-06-17T14:10Z', description: 'Physiotherapie-Experte in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-CAE1', name: 'mindfulness_coach', display_name: 'Mindfulness-Coach', category: 'GES', status: 'active', role: 'Mindfulness-Coach', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 5697, successRate: 98.8, lastActive: '2025-06-17T21:37Z', description: 'Mindfulness-Coach in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-C128', name: 'gesundheitsredakteur', display_name: 'Gesundheitsredakteur', category: 'GES', status: 'active', role: 'Gesundheitsredakteur', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'UNCERTIFIED', powerLevel: 5, tasksCompleted: 3863, successRate: 98.2, lastActive: '2025-06-17T14:19Z', description: 'Gesundheitsredakteur in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-3F31', name: 'medizinischer berater', display_name: 'Medizinischer Berater', category: 'GES', status: 'busy', role: 'Medizinischer Berater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FIELD_TESTED', powerLevel: 9, tasksCompleted: 7533, successRate: 98.6, lastActive: '2025-06-17T22:31Z', description: 'Medizinischer Berater in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-67CB', name: 'gesundheitstechnologe', display_name: 'Gesundheitstechnologe', category: 'GES', status: 'active', role: 'Gesundheitstechnologe', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 2455, successRate: 95.2, lastActive: '2025-06-17T11:34Z', description: 'Gesundheitstechnologe in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-57F9', name: 'präventionscoach', display_name: 'Präventionscoach', category: 'GES', status: 'offline', role: 'Präventionscoach', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 6109, successRate: 86.0, lastActive: '2025-06-17T15:32Z', description: 'Präventionscoach in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-983D', name: 'wellness_director', display_name: 'Wellness-Director', category: 'GES', status: 'active', role: 'Wellness-Director', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 3905, successRate: 99.8, lastActive: '2025-06-17T14:12Z', description: 'Wellness-Director in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-1158', name: 'gesundheitsökonom', display_name: 'Gesundheitsökonom', category: 'GES', status: 'busy', role: 'Gesundheitsökonom', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 9, tasksCompleted: 7965, successRate: 97.6, lastActive: '2025-06-17T17:44Z', description: 'Gesundheitsökonom in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },
  { id: 'VLT-GES-38F6', name: 'public_health_analyst', display_name: 'Public-Health-Analyst', category: 'GES', status: 'idle', role: 'Public-Health-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 1355, successRate: 92.3, lastActive: '2025-06-17T16:15Z', description: 'Public-Health-Analyst in Health Experts', tags: ['health', 'wellness', 'fitness', 'mental-health'] },

  // ANA — Analytiker (20) — Opus
  { id: 'VLT-ANA-F5B5', name: 'geschäftsanalyse_experte', display_name: 'Geschäftsanalyse-Experte', category: 'ANA', status: 'busy', role: 'Geschäftsanalyse-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 7979, successRate: 96.8, lastActive: '2025-06-17T14:50Z', description: 'Geschäftsanalyse-Experte in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-4DC8', name: 'marktforscher', display_name: 'Marktforscher', category: 'ANA', status: 'active', role: 'Marktforscher', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'UNCERTIFIED', powerLevel: 7, tasksCompleted: 6857, successRate: 95.5, lastActive: '2025-06-17T23:33Z', description: 'Marktforscher in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-786B', name: 'datenanalyst', display_name: 'Datenanalyst', category: 'ANA', status: 'busy', role: 'Datenanalyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 7107, successRate: 98.5, lastActive: '2025-06-17T13:55Z', description: 'Datenanalyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-A744', name: 'bi_entwickler', display_name: 'BI-Entwickler', category: 'ANA', status: 'active', role: 'BI-Entwickler', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FIELD_TESTED', powerLevel: 5, tasksCompleted: 6258, successRate: 91.2, lastActive: '2025-06-17T10:52Z', description: 'BI-Entwickler in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-FBA8', name: 'statistiker', display_name: 'Statistiker', category: 'ANA', status: 'idle', role: 'Statistiker', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 2264, successRate: 89.3, lastActive: '2025-06-17T22:28Z', description: 'Statistiker in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-EEA8', name: 'forecasting_spezialist', display_name: 'Forecasting-Spezialist', category: 'ANA', status: 'active', role: 'Forecasting-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 3803, successRate: 95.0, lastActive: '2025-06-17T23:24Z', description: 'Forecasting-Spezialist in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-E79D', name: 'risk_analyst', display_name: 'Risk-Analyst', category: 'ANA', status: 'idle', role: 'Risk-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 2445, successRate: 90.4, lastActive: '2025-06-17T16:27Z', description: 'Risk-Analyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-F6B4', name: 'finanzanalyst', display_name: 'Finanzanalyst', category: 'ANA', status: 'idle', role: 'Finanzanalyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 7993, successRate: 95.3, lastActive: '2025-06-17T20:33Z', description: 'Finanzanalyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-AE3E', name: 'research_lead', display_name: 'Research-Lead', category: 'ANA', status: 'active', role: 'Research-Lead', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'UNCERTIFIED', powerLevel: 5, tasksCompleted: 820, successRate: 93.5, lastActive: '2025-06-17T15:32Z', description: 'Research-Lead in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-40E6', name: 'quant_analyst', display_name: 'Quant-Analyst', category: 'ANA', status: 'active', role: 'Quant-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 5590, successRate: 88.9, lastActive: '2025-06-17T20:27Z', description: 'Quant-Analyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-1B0E', name: 'data_scientist', display_name: 'Data-Scientist', category: 'ANA', status: 'idle', role: 'Data-Scientist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 6428, successRate: 85.1, lastActive: '2025-06-17T20:51Z', description: 'Data-Scientist in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-592A', name: 'kpi_manager', display_name: 'KPI-Manager', category: 'ANA', status: 'active', role: 'KPI-Manager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 7543, successRate: 94.4, lastActive: '2025-06-17T19:50Z', description: 'KPI-Manager in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-B7D5', name: 'reporting_experte', display_name: 'Reporting-Experte', category: 'ANA', status: 'active', role: 'Reporting-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 6344, successRate: 92.8, lastActive: '2025-06-17T18:56Z', description: 'Reporting-Experte in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-922D', name: 'analytics_consultant', display_name: 'Analytics-Consultant', category: 'ANA', status: 'busy', role: 'Analytics-Consultant', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 3081, successRate: 93.2, lastActive: '2025-06-17T12:39Z', description: 'Analytics-Consultant in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-958D', name: 'predictive_modeler', display_name: 'Predictive-Modeler', category: 'ANA', status: 'active', role: 'Predictive-Modeler', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'UNCERTIFIED', powerLevel: 6, tasksCompleted: 2545, successRate: 93.9, lastActive: '2025-06-17T14:50Z', description: 'Predictive-Modeler in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-5F21', name: 'business_intelligence_analyst', display_name: 'Business-Intelligence-Analyst', category: 'ANA', status: 'active', role: 'Business-Intelligence-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 3749, successRate: 87.6, lastActive: '2025-06-17T18:24Z', description: 'Business-Intelligence-Analyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-707A', name: 'operations_researcher', display_name: 'Operations-Researcher', category: 'ANA', status: 'active', role: 'Operations-Researcher', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 1650, successRate: 90.2, lastActive: '2025-06-17T15:59Z', description: 'Operations-Researcher in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-5460', name: 'data_strategist', display_name: 'Data-Strategist', category: 'ANA', status: 'idle', role: 'Data-Strategist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 4423, successRate: 92.6, lastActive: '2025-06-17T13:12Z', description: 'Data-Strategist in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-5A59', name: 'econometrician', display_name: 'Econometrician', category: 'ANA', status: 'idle', role: 'Econometrician', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 3433, successRate: 95.6, lastActive: '2025-06-17T16:27Z', description: 'Econometrician in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },
  { id: 'VLT-ANA-3BFD', name: 'insight_analyst', display_name: 'Insight-Analyst', category: 'ANA', status: 'idle', role: 'Insight-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 798, successRate: 88.4, lastActive: '2025-06-17T13:46Z', description: 'Insight-Analyst in Analysts', tags: ['analytics', 'data', 'statistics', 'forecasting'] },

  // MKT — Marketer (20) — Sonnet
  { id: 'VLT-MKT-29F1', name: 'seo_stratege', display_name: 'SEO-Stratege', category: 'MKT', status: 'busy', role: 'SEO-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 3255, successRate: 97.7, lastActive: '2025-06-17T15:23Z', description: 'SEO-Stratege in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-F87E', name: 'content_marketer', display_name: 'Content-Marketer', category: 'MKT', status: 'idle', role: 'Content-Marketer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 4670, successRate: 98.2, lastActive: '2025-06-17T17:35Z', description: 'Content-Marketer in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-131E', name: 'social_media_manager', display_name: 'Social-Media-Manager', category: 'MKT', status: 'active', role: 'Social-Media-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FIELD_TESTED', powerLevel: 10, tasksCompleted: 7745, successRate: 87.0, lastActive: '2025-06-17T17:19Z', description: 'Social-Media-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-6357', name: 'brand_manager', display_name: 'Brand-Manager', category: 'MKT', status: 'busy', role: 'Brand-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 3644, successRate: 85.8, lastActive: '2025-06-17T12:25Z', description: 'Brand-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-4AC9', name: 'performance_marketer', display_name: 'Performance-Marketer', category: 'MKT', status: 'active', role: 'Performance-Marketer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 6678, successRate: 88.3, lastActive: '2025-06-17T18:44Z', description: 'Performance-Marketer in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-9645', name: 'growth_hacker', display_name: 'Growth-Hacker', category: 'MKT', status: 'active', role: 'Growth-Hacker', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 7076, successRate: 87.7, lastActive: '2025-06-17T21:47Z', description: 'Growth-Hacker in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-7AEB', name: 'email_marketing_experte', display_name: 'Email-Marketing-Experte', category: 'MKT', status: 'active', role: 'Email-Marketing-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 4248, successRate: 98.9, lastActive: '2025-06-17T19:35Z', description: 'Email-Marketing-Experte in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-7E72', name: 'influencer_relations', display_name: 'Influencer-Relations', category: 'MKT', status: 'active', role: 'Influencer-Relations', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 1106, successRate: 87.3, lastActive: '2025-06-17T13:18Z', description: 'Influencer-Relations in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-C6E1', name: 'pr_manager', display_name: 'PR-Manager', category: 'MKT', status: 'busy', role: 'PR-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 3858, successRate: 99.7, lastActive: '2025-06-17T17:15Z', description: 'PR-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-5DA5', name: 'marketing_analyst', display_name: 'Marketing-Analyst', category: 'MKT', status: 'busy', role: 'Marketing-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'UNCERTIFIED', powerLevel: 9, tasksCompleted: 5961, successRate: 96.4, lastActive: '2025-06-17T23:17Z', description: 'Marketing-Analyst in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-1223', name: 'campaign_manager', display_name: 'Campaign-Manager', category: 'MKT', status: 'offline', role: 'Campaign-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 5098, successRate: 97.1, lastActive: '2025-06-17T20:20Z', description: 'Campaign-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-1D46', name: 'product_marketer', display_name: 'Product-Marketer', category: 'MKT', status: 'active', role: 'Product-Marketer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 6409, successRate: 87.5, lastActive: '2025-06-17T16:48Z', description: 'Product-Marketer in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-4B99', name: 'digital_marketing_lead', display_name: 'Digital-Marketing-Lead', category: 'MKT', status: 'offline', role: 'Digital-Marketing-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 1855, successRate: 89.5, lastActive: '2025-06-17T16:34Z', description: 'Digital-Marketing-Lead in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-D695', name: 'marketing_automation', display_name: 'Marketing-Automation', category: 'MKT', status: 'active', role: 'Marketing-Automation', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 5, tasksCompleted: 3793, successRate: 86.8, lastActive: '2025-06-17T17:43Z', description: 'Marketing-Automation in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-406C', name: 'crm_manager', display_name: 'CRM-Manager', category: 'MKT', status: 'idle', role: 'CRM-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 2164, successRate: 98.5, lastActive: '2025-06-17T18:10Z', description: 'CRM-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-51CE', name: 'community_manager', display_name: 'Community-Manager', category: 'MKT', status: 'idle', role: 'Community-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 5, tasksCompleted: 2798, successRate: 87.9, lastActive: '2025-06-17T21:17Z', description: 'Community-Manager in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-A9E3', name: 'event_marketer', display_name: 'Event-Marketer', category: 'MKT', status: 'active', role: 'Event-Marketer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 1636, successRate: 97.5, lastActive: '2025-06-17T18:58Z', description: 'Event-Marketer in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-70EC', name: 'creative_director', display_name: 'Creative-Director', category: 'MKT', status: 'idle', role: 'Creative-Director', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FIELD_TESTED', powerLevel: 5, tasksCompleted: 3462, successRate: 99.5, lastActive: '2025-06-17T22:51Z', description: 'Creative-Director in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-F7D8', name: 'market_researcher', display_name: 'Market-Researcher', category: 'MKT', status: 'idle', role: 'Market-Researcher', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 629, successRate: 94.5, lastActive: '2025-06-17T11:28Z', description: 'Market-Researcher in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },
  { id: 'VLT-MKT-A784', name: 'brand_strategist', display_name: 'Brand-Strategist', category: 'MKT', status: 'active', role: 'Brand-Strategist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 8, tasksCompleted: 4588, successRate: 92.0, lastActive: '2025-06-17T12:39Z', description: 'Brand-Strategist in Marketers', tags: ['marketing', 'SEO', 'content', 'growth'] },

  // PRO — Produzenten (20) — Sonnet
  { id: 'VLT-PRO-9650', name: 'produktionsplaner', display_name: 'Produktionsplaner', category: 'PRO', status: 'active', role: 'Produktionsplaner', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 7738, successRate: 91.3, lastActive: '2025-06-17T21:56Z', description: 'Produktionsplaner in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-361F', name: 'supply_chain_manager', display_name: 'Supply-Chain-Manager', category: 'PRO', status: 'busy', role: 'Supply-Chain-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FIELD_TESTED', powerLevel: 5, tasksCompleted: 5151, successRate: 93.0, lastActive: '2025-06-17T18:58Z', description: 'Supply-Chain-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-7AF6', name: 'logistik_koordinator', display_name: 'Logistik-Koordinator', category: 'PRO', status: 'active', role: 'Logistik-Koordinator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'TECHNICAL_VALID', powerLevel: 9, tasksCompleted: 4770, successRate: 95.4, lastActive: '2025-06-17T18:16Z', description: 'Logistik-Koordinator in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-4922', name: 'qualitätsmanager', display_name: 'Qualitätsmanager', category: 'PRO', status: 'busy', role: 'Qualitätsmanager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 1573, successRate: 92.7, lastActive: '2025-06-17T14:50Z', description: 'Qualitätsmanager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-9D25', name: 'produktionsleiter', display_name: 'Produktionsleiter', category: 'PRO', status: 'active', role: 'Produktionsleiter', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 6382, successRate: 93.3, lastActive: '2025-06-17T19:22Z', description: 'Produktionsleiter in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-3712', name: 'lager_manager', display_name: 'Lager-Manager', category: 'PRO', status: 'active', role: 'Lager-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 5137, successRate: 90.6, lastActive: '2025-06-17T15:58Z', description: 'Lager-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-CB94', name: 'einkäufer', display_name: 'Einkäufer', category: 'PRO', status: 'active', role: 'Einkäufer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 3280, successRate: 97.0, lastActive: '2025-06-17T18:59Z', description: 'Einkäufer in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-E624', name: 'operations_manager', display_name: 'Operations-Manager', category: 'PRO', status: 'active', role: 'Operations-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 3115, successRate: 86.2, lastActive: '2025-06-17T10:48Z', description: 'Operations-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-8DCA', name: 'lean_spezialist', display_name: 'Lean-Spezialist', category: 'PRO', status: 'idle', role: 'Lean-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 6178, successRate: 91.0, lastActive: '2025-06-17T17:11Z', description: 'Lean-Spezialist in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-A08B', name: 'prozessingenieur', display_name: 'Prozessingenieur', category: 'PRO', status: 'busy', role: 'Prozessingenieur', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 7461, successRate: 89.3, lastActive: '2025-06-17T15:29Z', description: 'Prozessingenieur in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-7FD7', name: 'manufacturing_engineer', display_name: 'Manufacturing-Engineer', category: 'PRO', status: 'idle', role: 'Manufacturing-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 5616, successRate: 97.1, lastActive: '2025-06-17T10:25Z', description: 'Manufacturing-Engineer in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-ADC6', name: 'procurement_manager', display_name: 'Procurement-Manager', category: 'PRO', status: 'idle', role: 'Procurement-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 7897, successRate: 91.9, lastActive: '2025-06-17T11:15Z', description: 'Procurement-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-9681', name: 'inventory_manager', display_name: 'Inventory-Manager', category: 'PRO', status: 'active', role: 'Inventory-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 4421, successRate: 96.4, lastActive: '2025-06-17T17:14Z', description: 'Inventory-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-B43F', name: 'distributions_manager', display_name: 'Distributions-Manager', category: 'PRO', status: 'idle', role: 'Distributions-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 4373, successRate: 93.0, lastActive: '2025-06-17T22:18Z', description: 'Distributions-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-8639', name: 'produktionscontroller', display_name: 'Produktionscontroller', category: 'PRO', status: 'active', role: 'Produktionscontroller', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 4486, successRate: 85.4, lastActive: '2025-06-17T20:40Z', description: 'Produktionscontroller in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-5681', name: 'six_sigma_black_belt', display_name: 'Six-Sigma-Black-Belt', category: 'PRO', status: 'active', role: 'Six-Sigma-Black-Belt', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 5612, successRate: 96.9, lastActive: '2025-06-17T12:26Z', description: 'Six-Sigma-Black-Belt in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-282D', name: 'plant_manager', display_name: 'Plant-Manager', category: 'PRO', status: 'active', role: 'Plant-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 5752, successRate: 90.3, lastActive: '2025-06-17T23:48Z', description: 'Plant-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-2C6A', name: 'demand_planner', display_name: 'Demand-Planner', category: 'PRO', status: 'active', role: 'Demand-Planner', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 3133, successRate: 93.6, lastActive: '2025-06-17T13:44Z', description: 'Demand-Planner in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-1A5A', name: 'material_manager', display_name: 'Material-Manager', category: 'PRO', status: 'active', role: 'Material-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 931, successRate: 87.0, lastActive: '2025-06-17T21:22Z', description: 'Material-Manager in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },
  { id: 'VLT-PRO-46A3', name: 'continuous_improvement_lead', display_name: 'Continuous-Improvement-Lead', category: 'PRO', status: 'idle', role: 'Continuous-Improvement-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 1688, successRate: 96.8, lastActive: '2025-06-17T14:35Z', description: 'Continuous-Improvement-Lead in Producers', tags: ['production', 'logistics', 'supply-chain', 'operations'] },

  // ENT — Entrepreneure (20) — Opus
  { id: 'VLT-ENT-55BF', name: 'startup_berater', display_name: 'Startup-Berater', category: 'ENT', status: 'active', role: 'Startup-Berater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FIELD_TESTED', powerLevel: 9, tasksCompleted: 2588, successRate: 85.3, lastActive: '2025-06-17T20:33Z', description: 'Startup-Berater in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-64CA', name: 'venture_architect', display_name: 'Venture-Architect', category: 'ENT', status: 'busy', role: 'Venture-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 5933, successRate: 88.8, lastActive: '2025-06-17T18:38Z', description: 'Venture-Architect in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-757F', name: 'strategieberater', display_name: 'Strategieberater', category: 'ENT', status: 'active', role: 'Strategieberater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 4214, successRate: 86.8, lastActive: '2025-06-17T13:24Z', description: 'Strategieberater in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-0633', name: 'innovationsmanager', display_name: 'Innovationsmanager', category: 'ENT', status: 'idle', role: 'Innovationsmanager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 4405, successRate: 97.1, lastActive: '2025-06-17T15:11Z', description: 'Innovationsmanager in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-08FE', name: 'business_developer', display_name: 'Business-Developer', category: 'ENT', status: 'active', role: 'Business-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 7923, successRate: 94.9, lastActive: '2025-06-17T18:24Z', description: 'Business-Developer in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-D9B4', name: 'fundraising_experte', display_name: 'Fundraising-Experte', category: 'ENT', status: 'idle', role: 'Fundraising-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 1275, successRate: 99.6, lastActive: '2025-06-17T13:10Z', description: 'Fundraising-Experte in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-D350', name: 'pitch_coach', display_name: 'Pitch-Coach', category: 'ENT', status: 'active', role: 'Pitch-Coach', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 2234, successRate: 89.6, lastActive: '2025-06-17T21:50Z', description: 'Pitch-Coach in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-E6E7', name: 'market_entry_stratege', display_name: 'Market-Entry-Stratege', category: 'ENT', status: 'active', role: 'Market-Entry-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 1744, successRate: 91.5, lastActive: '2025-06-17T13:14Z', description: 'Market-Entry-Stratege in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-22AB', name: 'm&a_berater', display_name: 'M&A-Berater', category: 'ENT', status: 'idle', role: 'M&A-Berater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 1108, successRate: 85.2, lastActive: '2025-06-17T23:31Z', description: 'M&A-Berater in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-C8C2', name: 'unternehmensgründer', display_name: 'Unternehmensgründer', category: 'ENT', status: 'idle', role: 'Unternehmensgründer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 5, tasksCompleted: 7666, successRate: 94.7, lastActive: '2025-06-17T18:25Z', description: 'Unternehmensgründer in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-B94A', name: 'product_visionary', display_name: 'Product-Visionary', category: 'ENT', status: 'active', role: 'Product-Visionary', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FIELD_TESTED', powerLevel: 10, tasksCompleted: 4219, successRate: 99.7, lastActive: '2025-06-17T20:41Z', description: 'Product-Visionary in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-F134', name: 'scale_up_advisor', display_name: 'Scale-Up-Advisor', category: 'ENT', status: 'idle', role: 'Scale-Up-Advisor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 4693, successRate: 93.8, lastActive: '2025-06-17T18:18Z', description: 'Scale-Up-Advisor in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-8384', name: 'corporate_entrepreneur', display_name: 'Corporate-Entrepreneur', category: 'ENT', status: 'active', role: 'Corporate-Entrepreneur', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 6391, successRate: 85.7, lastActive: '2025-06-17T19:46Z', description: 'Corporate-Entrepreneur in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-1C20', name: 'business_model_innovator', display_name: 'Business-Model-Innovator', category: 'ENT', status: 'active', role: 'Business-Model-Innovator', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 874, successRate: 92.8, lastActive: '2025-06-17T13:40Z', description: 'Business-Model-Innovator in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-387F', name: 'go_to_market_stratege', display_name: 'Go-to-Market-Stratege', category: 'ENT', status: 'active', role: 'Go-to-Market-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 2956, successRate: 96.7, lastActive: '2025-06-17T13:16Z', description: 'Go-to-Market-Stratege in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-4E7A', name: 'series_a_advisor', display_name: 'Series-A-Advisor', category: 'ENT', status: 'active', role: 'Series-A-Advisor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 7579, successRate: 96.8, lastActive: '2025-06-17T20:37Z', description: 'Series-A-Advisor in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-37CE', name: 'bootstrapping_experte', display_name: 'Bootstrapping-Experte', category: 'ENT', status: 'idle', role: 'Bootstrapping-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 7469, successRate: 93.4, lastActive: '2025-06-17T16:36Z', description: 'Bootstrapping-Experte in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-83CF', name: 'venture_capital_analyst', display_name: 'Venture-Capital-Analyst', category: 'ENT', status: 'offline', role: 'Venture-Capital-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 5429, successRate: 86.0, lastActive: '2025-06-17T23:56Z', description: 'Venture-Capital-Analyst in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-9F5F', name: 'startup_mentor', display_name: 'Startup-Mentor', category: 'ENT', status: 'active', role: 'Startup-Mentor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 838, successRate: 97.6, lastActive: '2025-06-17T20:51Z', description: 'Startup-Mentor in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },
  { id: 'VLT-ENT-96E6', name: 'entrepreneur_in_residence', display_name: 'Entrepreneur-in-Residence', category: 'ENT', status: 'active', role: 'Entrepreneur-in-Residence', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'UNCERTIFIED', powerLevel: 8, tasksCompleted: 1446, successRate: 97.6, lastActive: '2025-06-17T11:13Z', description: 'Entrepreneur-in-Residence in Entrepreneurs', tags: ['entrepreneurship', 'startup', 'strategy', 'funding'] },

  // ETR — Entertainer (20) — Sonnet
  { id: 'VLT-ETR-C507', name: 'content_creator', display_name: 'Content-Creator', category: 'ETR', status: 'active', role: 'Content-Creator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 1029, successRate: 94.9, lastActive: '2025-06-17T21:31Z', description: 'Content-Creator in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-50B3', name: 'comedy_scriptwriter', display_name: 'Comedy-Scriptwriter', category: 'ETR', status: 'idle', role: 'Comedy-Scriptwriter', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 10, tasksCompleted: 4312, successRate: 92.4, lastActive: '2025-06-17T13:22Z', description: 'Comedy-Scriptwriter in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-D42A', name: 'medienproduzent', display_name: 'Medienproduzent', category: 'ETR', status: 'active', role: 'Medienproduzent', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 1110, successRate: 85.4, lastActive: '2025-06-17T18:38Z', description: 'Medienproduzent in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-6127', name: 'podcast_host', display_name: 'Podcast-Host', category: 'ETR', status: 'active', role: 'Podcast-Host', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 1425, successRate: 96.1, lastActive: '2025-06-17T16:21Z', description: 'Podcast-Host in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-27FB', name: 'video_editor', display_name: 'Video-Editor', category: 'ETR', status: 'idle', role: 'Video-Editor', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 5406, successRate: 89.6, lastActive: '2025-06-17T17:25Z', description: 'Video-Editor in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-B3B7', name: 'streaming_manager', display_name: 'Streaming-Manager', category: 'ETR', status: 'active', role: 'Streaming-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 3119, successRate: 96.9, lastActive: '2025-06-17T17:45Z', description: 'Streaming-Manager in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-C76C', name: 'social_media_entertainer', display_name: 'Social-Media-Entertainer', category: 'ETR', status: 'active', role: 'Social-Media-Entertainer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 6899, successRate: 98.1, lastActive: '2025-06-17T10:51Z', description: 'Social-Media-Entertainer in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-6322', name: 'script_doctor', display_name: 'Script-Doctor', category: 'ETR', status: 'idle', role: 'Script-Doctor', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 8, tasksCompleted: 7755, successRate: 94.3, lastActive: '2025-06-17T23:10Z', description: 'Script-Doctor in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-0610', name: 'voice_actor', display_name: 'Voice-Actor', category: 'ETR', status: 'active', role: 'Voice-Actor', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 1556, successRate: 85.6, lastActive: '2025-06-17T22:25Z', description: 'Voice-Actor in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-B746', name: 'musikproduzent', display_name: 'Musikproduzent', category: 'ETR', status: 'active', role: 'Musikproduzent', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 911, successRate: 89.0, lastActive: '2025-06-17T16:41Z', description: 'Musikproduzent in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-3681', name: 'live_event_producer', display_name: 'Live-Event-Producer', category: 'ETR', status: 'active', role: 'Live-Event-Producer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'UNCERTIFIED', powerLevel: 8, tasksCompleted: 3203, successRate: 90.6, lastActive: '2025-06-17T13:35Z', description: 'Live-Event-Producer in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-E1C2', name: 'talent_manager', display_name: 'Talent-Manager', category: 'ETR', status: 'active', role: 'Talent-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 5686, successRate: 96.5, lastActive: '2025-06-17T12:34Z', description: 'Talent-Manager in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-7793', name: 'entertainment_analyst', display_name: 'Entertainment-Analyst', category: 'ETR', status: 'active', role: 'Entertainment-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FIELD_TESTED', powerLevel: 9, tasksCompleted: 4023, successRate: 90.6, lastActive: '2025-06-17T16:26Z', description: 'Entertainment-Analyst in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-AFED', name: 'kreativdirektor', display_name: 'Kreativdirektor', category: 'ETR', status: 'active', role: 'Kreativdirektor', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 1236, successRate: 88.3, lastActive: '2025-06-17T14:37Z', description: 'Kreativdirektor in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-8F11', name: 'showrunner', display_name: 'Showrunner', category: 'ETR', status: 'active', role: 'Showrunner', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 6239, successRate: 88.1, lastActive: '2025-06-17T21:45Z', description: 'Showrunner in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-53C1', name: 'broadcast_engineer', display_name: 'Broadcast-Engineer', category: 'ETR', status: 'active', role: 'Broadcast-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 3774, successRate: 88.3, lastActive: '2025-06-17T21:41Z', description: 'Broadcast-Engineer in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-46D1', name: 'digital_content_stratege', display_name: 'Digital-Content-Stratege', category: 'ETR', status: 'active', role: 'Digital-Content-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 3936, successRate: 85.2, lastActive: '2025-06-17T13:28Z', description: 'Digital-Content-Stratege in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-C0F8', name: 'audience_development', display_name: 'Audience-Development', category: 'ETR', status: 'active', role: 'Audience-Development', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 5899, successRate: 99.7, lastActive: '2025-06-17T10:47Z', description: 'Audience-Development in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-67A9', name: 'media_planner', display_name: 'Media-Planner', category: 'ETR', status: 'active', role: 'Media-Planner', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 9, tasksCompleted: 4640, successRate: 92.2, lastActive: '2025-06-17T18:13Z', description: 'Media-Planner in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },
  { id: 'VLT-ETR-672C', name: 'brand_entertainer', display_name: 'Brand-Entertainer', category: 'ETR', status: 'active', role: 'Brand-Entertainer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 3359, successRate: 94.3, lastActive: '2025-06-17T15:13Z', description: 'Brand-Entertainer in Entertainers', tags: ['entertainment', 'content', 'media', 'creative'] },

  // LEH — Lehrer (20) — Sonnet
  { id: 'VLT-LEH-E43B', name: 'bildungsdesigner', display_name: 'Bildungsdesigner', category: 'LEH', status: 'idle', role: 'Bildungsdesigner', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 5824, successRate: 98.5, lastActive: '2025-06-17T19:40Z', description: 'Bildungsdesigner in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-2D67', name: 'e_learning_entwickler', display_name: 'E-Learning-Entwickler', category: 'LEH', status: 'busy', role: 'E-Learning-Entwickler', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 1844, successRate: 97.9, lastActive: '2025-06-17T23:43Z', description: 'E-Learning-Entwickler in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-ACFA', name: 'trainingskoordinator', display_name: 'Trainingskoordinator', category: 'LEH', status: 'offline', role: 'Trainingskoordinator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 7239, successRate: 92.1, lastActive: '2025-06-17T10:42Z', description: 'Trainingskoordinator in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-5DF1', name: 'didaktik_experte', display_name: 'Didaktik-Experte', category: 'LEH', status: 'idle', role: 'Didaktik-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 7296, successRate: 99.4, lastActive: '2025-06-17T23:21Z', description: 'Didaktik-Experte in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-2335', name: 'kurs_designer', display_name: 'Kurs-Designer', category: 'LEH', status: 'active', role: 'Kurs-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 2130, successRate: 94.8, lastActive: '2025-06-17T19:14Z', description: 'Kurs-Designer in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-887E', name: 'lms_administrator', display_name: 'LMS-Administrator', category: 'LEH', status: 'active', role: 'LMS-Administrator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FIELD_TESTED', powerLevel: 7, tasksCompleted: 7428, successRate: 85.2, lastActive: '2025-06-17T23:25Z', description: 'LMS-Administrator in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-8C34', name: 'bildungsforscher', display_name: 'Bildungsforscher', category: 'LEH', status: 'offline', role: 'Bildungsforscher', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 5330, successRate: 91.2, lastActive: '2025-06-17T11:46Z', description: 'Bildungsforscher in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-11F5', name: 'coaching_experte', display_name: 'Coaching-Experte', category: 'LEH', status: 'active', role: 'Coaching-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1249, successRate: 94.0, lastActive: '2025-06-17T19:48Z', description: 'Coaching-Experte in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-CEE3', name: 'kompetenz_entwickler', display_name: 'Kompetenz-Entwickler', category: 'LEH', status: 'active', role: 'Kompetenz-Entwickler', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 8, tasksCompleted: 2065, successRate: 86.6, lastActive: '2025-06-17T19:15Z', description: 'Kompetenz-Entwickler in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-50AA', name: 'wissensmanager', display_name: 'Wissensmanager', category: 'LEH', status: 'offline', role: 'Wissensmanager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 1928, successRate: 89.5, lastActive: '2025-06-17T20:47Z', description: 'Wissensmanager in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-0968', name: 'curriculum_designer', display_name: 'Curriculum-Designer', category: 'LEH', status: 'idle', role: 'Curriculum-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 7986, successRate: 99.4, lastActive: '2025-06-17T18:30Z', description: 'Curriculum-Designer in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-7753', name: 'assessment_spezialist', display_name: 'Assessment-Spezialist', category: 'LEH', status: 'idle', role: 'Assessment-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 5175, successRate: 91.0, lastActive: '2025-06-17T13:52Z', description: 'Assessment-Spezialist in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-A476', name: 'lernexperte', display_name: 'Lernexperte', category: 'LEH', status: 'active', role: 'Lernexperte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 6526, successRate: 87.4, lastActive: '2025-06-17T15:25Z', description: 'Lernexperte in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-358B', name: 'education_technologist', display_name: 'Education-Technologist', category: 'LEH', status: 'idle', role: 'Education-Technologist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FIELD_TESTED', powerLevel: 10, tasksCompleted: 3294, successRate: 85.4, lastActive: '2025-06-17T16:18Z', description: 'Education-Technologist in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-5AD0', name: 'instructional_designer', display_name: 'Instructional-Designer', category: 'LEH', status: 'active', role: 'Instructional-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 7107, successRate: 92.0, lastActive: '2025-06-17T20:29Z', description: 'Instructional-Designer in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-DAFB', name: 'training_delivery_lead', display_name: 'Training-Delivery-Lead', category: 'LEH', status: 'active', role: 'Training-Delivery-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 7212, successRate: 90.1, lastActive: '2025-06-17T15:58Z', description: 'Training-Delivery-Lead in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-7BBD', name: 'skill_development_coach', display_name: 'Skill-Development-Coach', category: 'LEH', status: 'active', role: 'Skill-Development-Coach', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 7445, successRate: 95.5, lastActive: '2025-06-17T10:39Z', description: 'Skill-Development-Coach in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-E792', name: 'academic_advisor', display_name: 'Academic-Advisor', category: 'LEH', status: 'active', role: 'Academic-Advisor', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 2892, successRate: 92.1, lastActive: '2025-06-17T19:16Z', description: 'Academic-Advisor in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-5665', name: 'corporate_trainer', display_name: 'Corporate-Trainer', category: 'LEH', status: 'active', role: 'Corporate-Trainer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 4845, successRate: 96.2, lastActive: '2025-06-17T18:23Z', description: 'Corporate-Trainer in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },
  { id: 'VLT-LEH-A19B', name: 'learning_experience_designer', display_name: 'Learning-Experience-Designer', category: 'LEH', status: 'active', role: 'Learning-Experience-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 7369, successRate: 97.0, lastActive: '2025-06-17T14:18Z', description: 'Learning-Experience-Designer in Teachers', tags: ['education', 'training', 'e-learning', 'coaching'] },

  // SCH — Schriftsteller (20) — Opus
  { id: 'VLT-SCH-B9DB', name: 'romanautor', display_name: 'Romanautor', category: 'SCH', status: 'active', role: 'Romanautor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 2344, successRate: 88.1, lastActive: '2025-06-17T11:25Z', description: 'Romanautor in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-B5E8', name: 'journalist', display_name: 'Journalist', category: 'SCH', status: 'active', role: 'Journalist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 6811, successRate: 92.4, lastActive: '2025-06-17T14:20Z', description: 'Journalist in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-94C8', name: 'copywriter', display_name: 'Copywriter', category: 'SCH', status: 'active', role: 'Copywriter', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 1482, successRate: 90.2, lastActive: '2025-06-17T23:44Z', description: 'Copywriter in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-8B39', name: 'technical_writer', display_name: 'Technical-Writer', category: 'SCH', status: 'active', role: 'Technical-Writer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 4, tasksCompleted: 7601, successRate: 91.8, lastActive: '2025-06-17T14:49Z', description: 'Technical-Writer in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-C530', name: 'scriptwriter', display_name: 'Scriptwriter', category: 'SCH', status: 'active', role: 'Scriptwriter', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'FIELD_TESTED', powerLevel: 7, tasksCompleted: 3649, successRate: 92.1, lastActive: '2025-06-17T18:10Z', description: 'Scriptwriter in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-B51F', name: 'ghostwriter', display_name: 'Ghostwriter', category: 'SCH', status: 'active', role: 'Ghostwriter', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 3105, successRate: 88.9, lastActive: '2025-06-17T23:45Z', description: 'Ghostwriter in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-854A', name: 'content_stratege', display_name: 'Content-Stratege', category: 'SCH', status: 'active', role: 'Content-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 3039, successRate: 85.4, lastActive: '2025-06-17T20:16Z', description: 'Content-Stratege in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-E9A5', name: 'redakteur', display_name: 'Redakteur', category: 'SCH', status: 'idle', role: 'Redakteur', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'UNCERTIFIED', powerLevel: 4, tasksCompleted: 1711, successRate: 95.6, lastActive: '2025-06-17T14:17Z', description: 'Redakteur in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-542F', name: 'storyteller', display_name: 'Storyteller', category: 'SCH', status: 'active', role: 'Storyteller', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 977, successRate: 87.5, lastActive: '2025-06-17T21:45Z', description: 'Storyteller in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-1C9B', name: 'lyriker', display_name: 'Lyriker', category: 'SCH', status: 'active', role: 'Lyriker', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 3578, successRate: 93.8, lastActive: '2025-06-17T14:28Z', description: 'Lyriker in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-10BE', name: 'essayist', display_name: 'Essayist', category: 'SCH', status: 'active', role: 'Essayist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 6824, successRate: 94.8, lastActive: '2025-06-17T13:55Z', description: 'Essayist in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-753E', name: 'biograph', display_name: 'Biograph', category: 'SCH', status: 'active', role: 'Biograph', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 5413, successRate: 99.8, lastActive: '2025-06-17T13:53Z', description: 'Biograph in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-3A39', name: 'drehbuchautor', display_name: 'Drehbuchautor', category: 'SCH', status: 'active', role: 'Drehbuchautor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 3882, successRate: 99.3, lastActive: '2025-06-17T23:26Z', description: 'Drehbuchautor in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-6E16', name: 'wissenschaftsautor', display_name: 'Wissenschaftsautor', category: 'SCH', status: 'active', role: 'Wissenschaftsautor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 2529, successRate: 87.6, lastActive: '2025-06-17T17:26Z', description: 'Wissenschaftsautor in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-0220', name: 'reisebuchautor', display_name: 'Reisebuchautor', category: 'SCH', status: 'active', role: 'Reisebuchautor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 2445, successRate: 92.7, lastActive: '2025-06-17T11:50Z', description: 'Reisebuchautor in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-887A', name: 'kolumnist', display_name: 'Kolumnist', category: 'SCH', status: 'active', role: 'Kolumnist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 5185, successRate: 99.1, lastActive: '2025-06-17T23:27Z', description: 'Kolumnist in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-99AF', name: 'dramaturg', display_name: 'Dramaturg', category: 'SCH', status: 'idle', role: 'Dramaturg', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 9, tasksCompleted: 5716, successRate: 98.7, lastActive: '2025-06-17T10:31Z', description: 'Dramaturg in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-2F5D', name: 'lektor', display_name: 'Lektor', category: 'SCH', status: 'idle', role: 'Lektor', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 9, tasksCompleted: 1484, successRate: 85.8, lastActive: '2025-06-17T20:26Z', description: 'Lektor in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-256F', name: 'verlagsberater', display_name: 'Verlagsberater', category: 'SCH', status: 'active', role: 'Verlagsberater', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'UNCERTIFIED', powerLevel: 7, tasksCompleted: 3341, successRate: 97.3, lastActive: '2025-06-17T21:38Z', description: 'Verlagsberater in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },
  { id: 'VLT-SCH-2362', name: 'literary_agent', display_name: 'Literary-Agent', category: 'SCH', status: 'idle', role: 'Literary-Agent', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 804, successRate: 93.9, lastActive: '2025-06-17T21:37Z', description: 'Literary-Agent in Writers', tags: ['writing', 'journalism', 'content', 'storytelling'] },

  // ECO — E-Commerce (20) — Sonnet
  { id: 'VLT-ECO-E660', name: 'shop_manager', display_name: 'Shop-Manager', category: 'ECO', status: 'active', role: 'Shop-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 3439, successRate: 95.7, lastActive: '2025-06-17T10:17Z', description: 'Shop-Manager in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-16FB', name: 'marketplace_spezialist', display_name: 'Marketplace-Spezialist', category: 'ECO', status: 'active', role: 'Marketplace-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 8, tasksCompleted: 3235, successRate: 85.1, lastActive: '2025-06-17T21:19Z', description: 'Marketplace-Spezialist in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-BE1B', name: 'amazon_experte', display_name: 'Amazon-Experte', category: 'ECO', status: 'active', role: 'Amazon-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 2195, successRate: 98.3, lastActive: '2025-06-17T10:33Z', description: 'Amazon-Experte in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-0887', name: 'e_commerce_stratege', display_name: 'E-Commerce-Stratege', category: 'ECO', status: 'active', role: 'E-Commerce-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'FIELD_TESTED', powerLevel: 5, tasksCompleted: 5722, successRate: 95.2, lastActive: '2025-06-17T18:19Z', description: 'E-Commerce-Stratege in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-8A25', name: 'conversion_optimizer', display_name: 'Conversion-Optimizer', category: 'ECO', status: 'idle', role: 'Conversion-Optimizer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 7833, successRate: 94.8, lastActive: '2025-06-17T12:12Z', description: 'Conversion-Optimizer in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-B26A', name: 'payment_integration', display_name: 'Payment-Integration', category: 'ECO', status: 'active', role: 'Payment-Integration', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 3424, successRate: 97.7, lastActive: '2025-06-17T15:12Z', description: 'Payment-Integration in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-799E', name: 'fulfillment_manager', display_name: 'Fulfillment-Manager', category: 'ECO', status: 'active', role: 'Fulfillment-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 3136, successRate: 87.6, lastActive: '2025-06-17T13:53Z', description: 'Fulfillment-Manager in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-FA2A', name: 'product_lister', display_name: 'Product-Lister', category: 'ECO', status: 'busy', role: 'Product-Lister', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 1961, successRate: 91.4, lastActive: '2025-06-17T20:16Z', description: 'Product-Lister in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-E6D2', name: 'e_commerce_analyst', display_name: 'E-Commerce-Analyst', category: 'ECO', status: 'idle', role: 'E-Commerce-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FIELD_TESTED', powerLevel: 4, tasksCompleted: 621, successRate: 91.4, lastActive: '2025-06-17T22:45Z', description: 'E-Commerce-Analyst in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-C6D9', name: 'dropshipping_experte', display_name: 'Dropshipping-Experte', category: 'ECO', status: 'idle', role: 'Dropshipping-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 7843, successRate: 87.5, lastActive: '2025-06-17T19:57Z', description: 'Dropshipping-Experte in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-AD03', name: 'online_merchandiser', display_name: 'Online-Merchandiser', category: 'ECO', status: 'active', role: 'Online-Merchandiser', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 5, tasksCompleted: 5307, successRate: 98.1, lastActive: '2025-06-17T13:20Z', description: 'Online-Merchandiser in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-E2D0', name: 'digital_shelf_analyst', display_name: 'Digital-Shelf-Analyst', category: 'ECO', status: 'active', role: 'Digital-Shelf-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 1596, successRate: 98.5, lastActive: '2025-06-17T16:11Z', description: 'Digital-Shelf-Analyst in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-21EB', name: 'pricing_stratege', display_name: 'Pricing-Stratege', category: 'ECO', status: 'offline', role: 'Pricing-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'UNCERTIFIED', powerLevel: 9, tasksCompleted: 1037, successRate: 94.3, lastActive: '2025-06-17T21:31Z', description: 'Pricing-Stratege in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-8CDF', name: 'cart_optimization', display_name: 'Cart-Optimization', category: 'ECO', status: 'active', role: 'Cart-Optimization', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 7355, successRate: 96.1, lastActive: '2025-06-17T22:52Z', description: 'Cart-Optimization in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-604E', name: 'customer_retention', display_name: 'Customer-Retention', category: 'ECO', status: 'active', role: 'Customer-Retention', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 5635, successRate: 96.3, lastActive: '2025-06-17T22:25Z', description: 'Customer-Retention in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-C446', name: 'e_commerce_technologist', display_name: 'E-Commerce-Technologist', category: 'ECO', status: 'active', role: 'E-Commerce-Technologist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 2500, successRate: 91.2, lastActive: '2025-06-17T12:54Z', description: 'E-Commerce-Technologist in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-D872', name: 'cross_border_commerce', display_name: 'Cross-Border-Commerce', category: 'ECO', status: 'active', role: 'Cross-Border-Commerce', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 1235, successRate: 94.4, lastActive: '2025-06-17T16:12Z', description: 'Cross-Border-Commerce in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-2286', name: 'returns_manager', display_name: 'Returns-Manager', category: 'ECO', status: 'active', role: 'Returns-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 5351, successRate: 87.9, lastActive: '2025-06-17T13:22Z', description: 'Returns-Manager in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-5772', name: 'vendor_manager', display_name: 'Vendor-Manager', category: 'ECO', status: 'active', role: 'Vendor-Manager', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 5237, successRate: 87.3, lastActive: '2025-06-17T15:29Z', description: 'Vendor-Manager in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },
  { id: 'VLT-ECO-6AB9', name: 'shopify_experte', display_name: 'Shopify-Experte', category: 'ECO', status: 'active', role: 'Shopify-Experte', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 8, tasksCompleted: 4919, successRate: 86.5, lastActive: '2025-06-17T13:11Z', description: 'Shopify-Experte in E-Commerce', tags: ['e-commerce', 'marketplace', 'retail', 'online-sales'] },

  // DEV — Entwickler (20) — Sonnet
  { id: 'VLT-DEV-1B27', name: 'fullstack_entwickler', display_name: 'Fullstack-Entwickler', category: 'DEV', status: 'idle', role: 'Fullstack-Entwickler', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 1684, successRate: 98.1, lastActive: '2025-06-17T13:35Z', description: 'Fullstack-Entwickler in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-0659', name: 'devops_engineer', display_name: 'DevOps-Engineer', category: 'DEV', status: 'busy', role: 'DevOps-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 1605, successRate: 87.7, lastActive: '2025-06-17T14:14Z', description: 'DevOps-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-8ADE', name: 'cloud_architect', display_name: 'Cloud-Architect', category: 'DEV', status: 'idle', role: 'Cloud-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 3685, successRate: 86.1, lastActive: '2025-06-17T15:51Z', description: 'Cloud-Architect in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-4213', name: 'backend_developer', display_name: 'Backend-Developer', category: 'DEV', status: 'active', role: 'Backend-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 9, tasksCompleted: 6885, successRate: 91.8, lastActive: '2025-06-17T16:53Z', description: 'Backend-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-7FB9', name: 'frontend_developer', display_name: 'Frontend-Developer', category: 'DEV', status: 'active', role: 'Frontend-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 2426, successRate: 92.5, lastActive: '2025-06-17T15:11Z', description: 'Frontend-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-11DC', name: 'mobile_developer', display_name: 'Mobile-Developer', category: 'DEV', status: 'active', role: 'Mobile-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1284, successRate: 95.9, lastActive: '2025-06-17T14:21Z', description: 'Mobile-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-D492', name: 'security_engineer', display_name: 'Security-Engineer', category: 'DEV', status: 'idle', role: 'Security-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 2240, successRate: 98.2, lastActive: '2025-06-17T14:12Z', description: 'Security-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-3432', name: 'data_engineer', display_name: 'Data-Engineer', category: 'DEV', status: 'active', role: 'Data-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 2325, successRate: 86.8, lastActive: '2025-06-17T19:37Z', description: 'Data-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-61AD', name: 'qa_engineer', display_name: 'QA-Engineer', category: 'DEV', status: 'active', role: 'QA-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 5, tasksCompleted: 5345, successRate: 91.2, lastActive: '2025-06-17T21:30Z', description: 'QA-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-CD63', name: 'sre', display_name: 'SRE', category: 'DEV', status: 'idle', role: 'SRE', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 665, successRate: 95.6, lastActive: '2025-06-17T19:42Z', description: 'SRE in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-1E6C', name: 'platform_engineer', display_name: 'Platform-Engineer', category: 'DEV', status: 'offline', role: 'Platform-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 2429, successRate: 90.7, lastActive: '2025-06-17T16:46Z', description: 'Platform-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-4B7E', name: 'ml_engineer', display_name: 'ML-Engineer', category: 'DEV', status: 'active', role: 'ML-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'UNCERTIFIED', powerLevel: 8, tasksCompleted: 2990, successRate: 99.0, lastActive: '2025-06-17T14:12Z', description: 'ML-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-C285', name: 'blockchain_developer', display_name: 'Blockchain-Developer', category: 'DEV', status: 'active', role: 'Blockchain-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 5, tasksCompleted: 7568, successRate: 98.3, lastActive: '2025-06-17T16:10Z', description: 'Blockchain-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-91BD', name: 'game_developer', display_name: 'Game-Developer', category: 'DEV', status: 'offline', role: 'Game-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 1053, successRate: 89.8, lastActive: '2025-06-17T22:44Z', description: 'Game-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-2D90', name: 'embedded_developer', display_name: 'Embedded-Developer', category: 'DEV', status: 'idle', role: 'Embedded-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 4026, successRate: 88.4, lastActive: '2025-06-17T21:57Z', description: 'Embedded-Developer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-7AC7', name: 'api_designer', display_name: 'API-Designer', category: 'DEV', status: 'active', role: 'API-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 7275, successRate: 92.6, lastActive: '2025-06-17T20:22Z', description: 'API-Designer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-6986', name: 'systems_architect', display_name: 'Systems-Architect', category: 'DEV', status: 'active', role: 'Systems-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 7005, successRate: 90.8, lastActive: '2025-06-17T16:14Z', description: 'Systems-Architect in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-7A90', name: 'database_administrator', display_name: 'Database-Administrator', category: 'DEV', status: 'active', role: 'Database-Administrator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 7974, successRate: 91.1, lastActive: '2025-06-17T15:49Z', description: 'Database-Administrator in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-2D4C', name: 'ui_engineer', display_name: 'UI-Engineer', category: 'DEV', status: 'idle', role: 'UI-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Executor', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 1756, successRate: 86.9, lastActive: '2025-06-17T20:17Z', description: 'UI-Engineer in Developers', tags: ['development', 'software', 'devops', 'cloud'] },
  { id: 'VLT-DEV-B88E', name: 'scrum_master', display_name: 'Scrum-Master', category: 'DEV', status: 'active', role: 'Scrum-Master', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Analyst', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 7, tasksCompleted: 4108, successRate: 90.4, lastActive: '2025-06-17T14:42Z', description: 'Scrum-Master in Developers', tags: ['development', 'software', 'devops', 'cloud'] },

  // AIN — AI-Native (20) — Opus
  { id: 'VLT-AIN-DD6D', name: 'prompt_engineer', display_name: 'Prompt-Engineer', category: 'AIN', status: 'busy', role: 'Prompt-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'UNCERTIFIED', powerLevel: 5, tasksCompleted: 4348, successRate: 98.9, lastActive: '2025-06-17T20:36Z', description: 'Prompt-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-FA12', name: 'ai_researcher', display_name: 'AI-Researcher', category: 'AIN', status: 'active', role: 'AI-Researcher', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 4263, successRate: 98.4, lastActive: '2025-06-17T16:54Z', description: 'AI-Researcher in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-BE4C', name: 'llm_trainer', display_name: 'LLM-Trainer', category: 'AIN', status: 'active', role: 'LLM-Trainer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 7279, successRate: 89.8, lastActive: '2025-06-17T18:18Z', description: 'LLM-Trainer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-CEA4', name: 'ai_ethik_experte', display_name: 'AI-Ethik-Experte', category: 'AIN', status: 'active', role: 'AI-Ethik-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 5894, successRate: 95.5, lastActive: '2025-06-17T16:52Z', description: 'AI-Ethik-Experte in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-A91F', name: 'model_optimizer', display_name: 'Model-Optimizer', category: 'AIN', status: 'active', role: 'Model-Optimizer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 7384, successRate: 92.1, lastActive: '2025-06-17T20:57Z', description: 'Model-Optimizer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-8DBD', name: 'ai_product_manager', display_name: 'AI-Product-Manager', category: 'AIN', status: 'active', role: 'AI-Product-Manager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 1383, successRate: 95.8, lastActive: '2025-06-17T19:46Z', description: 'AI-Product-Manager in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-1D5D', name: 'nlp_spezialist', display_name: 'NLP-Spezialist', category: 'AIN', status: 'active', role: 'NLP-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 7876, successRate: 89.8, lastActive: '2025-06-17T16:45Z', description: 'NLP-Spezialist in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-3539', name: 'computer_vision_experte', display_name: 'Computer-Vision-Experte', category: 'AIN', status: 'active', role: 'Computer-Vision-Experte', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 5694, successRate: 88.1, lastActive: '2025-06-17T14:28Z', description: 'Computer-Vision-Experte in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-C0A7', name: 'reinforcement_learning_engineer', display_name: 'Reinforcement-Learning-Engineer', category: 'AIN', status: 'active', role: 'Reinforcement-Learning-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 4874, successRate: 94.9, lastActive: '2025-06-17T16:47Z', description: 'Reinforcement-Learning-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-2C80', name: 'ai_infrastructure_engineer', display_name: 'AI-Infrastructure-Engineer', category: 'AIN', status: 'active', role: 'AI-Infrastructure-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 7862, successRate: 97.8, lastActive: '2025-06-17T20:30Z', description: 'AI-Infrastructure-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-BADA', name: 'genai_developer', display_name: 'GenAI-Developer', category: 'AIN', status: 'idle', role: 'GenAI-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 8, tasksCompleted: 5989, successRate: 95.5, lastActive: '2025-06-17T17:38Z', description: 'GenAI-Developer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-B401', name: 'ai_safety_researcher', display_name: 'AI-Safety-Researcher', category: 'AIN', status: 'busy', role: 'AI-Safety-Researcher', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FIELD_TESTED', powerLevel: 10, tasksCompleted: 1477, successRate: 88.8, lastActive: '2025-06-17T13:42Z', description: 'AI-Safety-Researcher in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-9D0C', name: 'multi_modal_developer', display_name: 'Multi-Modal-Developer', category: 'AIN', status: 'idle', role: 'Multi-Modal-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 5765, successRate: 95.6, lastActive: '2025-06-17T22:57Z', description: 'Multi-Modal-Developer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-9E46', name: 'agent_architect', display_name: 'Agent-Architect', category: 'AIN', status: 'active', role: 'Agent-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 4177, successRate: 93.9, lastActive: '2025-06-17T20:15Z', description: 'Agent-Architect in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-DA06', name: 'foundation_model_engineer', display_name: 'Foundation-Model-Engineer', category: 'AIN', status: 'active', role: 'Foundation-Model-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FIELD_TESTED', powerLevel: 6, tasksCompleted: 7149, successRate: 99.1, lastActive: '2025-06-17T18:52Z', description: 'Foundation-Model-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-F75D', name: 'ai_evaluator', display_name: 'AI-Evaluator', category: 'AIN', status: 'active', role: 'AI-Evaluator', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 3110, successRate: 87.1, lastActive: '2025-06-17T19:31Z', description: 'AI-Evaluator in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-A825', name: 'synthetic_data_engineer', display_name: 'Synthetic-Data-Engineer', category: 'AIN', status: 'busy', role: 'Synthetic-Data-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 7922, successRate: 97.4, lastActive: '2025-06-17T23:58Z', description: 'Synthetic-Data-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-6DC0', name: 'mlops_engineer', display_name: 'MLOps-Engineer', category: 'AIN', status: 'active', role: 'MLOps-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 10, tasksCompleted: 704, successRate: 89.4, lastActive: '2025-06-17T20:29Z', description: 'MLOps-Engineer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-6E9B', name: 'ai_integration_spezialist', display_name: 'AI-Integration-Spezialist', category: 'AIN', status: 'idle', role: 'AI-Integration-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 4499, successRate: 92.2, lastActive: '2025-06-17T22:22Z', description: 'AI-Integration-Spezialist in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },
  { id: 'VLT-AIN-F505', name: 'edge_ai_developer', display_name: 'Edge-AI-Developer', category: 'AIN', status: 'idle', role: 'Edge-AI-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Innovator', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 2303, successRate: 90.3, lastActive: '2025-06-17T10:12Z', description: 'Edge-AI-Developer in AI-Native', tags: ['AI', 'LLM', 'machine-learning', 'prompt-engineering'] },

  // MET — Meta (10) — Opus
  { id: 'VLT-MET-0108', name: 'meta_stratege', display_name: 'Meta-Stratege', category: 'MET', status: 'active', role: 'Meta-Stratege', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 4, tasksCompleted: 3974, successRate: 94.0, lastActive: '2025-06-17T17:49Z', description: 'Meta-Stratege in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-053A', name: 'system_architect', display_name: 'System-Architect', category: 'MET', status: 'active', role: 'System-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 691, successRate: 99.5, lastActive: '2025-06-17T17:36Z', description: 'System-Architect in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-141A', name: 'framework_designer', display_name: 'Framework-Designer', category: 'MET', status: 'active', role: 'Framework-Designer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 9, tasksCompleted: 3865, successRate: 95.6, lastActive: '2025-06-17T19:22Z', description: 'Framework-Designer in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-0A98', name: 'process_optimizer', display_name: 'Process-Optimizer', category: 'MET', status: 'idle', role: 'Process-Optimizer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 5449, successRate: 87.5, lastActive: '2025-06-17T21:34Z', description: 'Process-Optimizer in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-3BCF', name: 'paradigm_analyst', display_name: 'Paradigm-Analyst', category: 'MET', status: 'active', role: 'Paradigm-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Sage', certificationLevel: 'TECHNICAL_VALID', powerLevel: 10, tasksCompleted: 3602, successRate: 95.7, lastActive: '2025-06-17T16:25Z', description: 'Paradigm-Analyst in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-71B5', name: 'abstraction_engineer', display_name: 'Abstraction-Engineer', category: 'MET', status: 'active', role: 'Abstraction-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 6568, successRate: 88.8, lastActive: '2025-06-17T20:54Z', description: 'Abstraction-Engineer in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-7977', name: 'pattern_recognizer', display_name: 'Pattern-Recognizer', category: 'MET', status: 'active', role: 'Pattern-Recognizer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 5743, successRate: 99.5, lastActive: '2025-06-17T22:59Z', description: 'Pattern-Recognizer in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-A394', name: 'meta_cognitive_coach', display_name: 'Meta-Cognitive-Coach', category: 'MET', status: 'idle', role: 'Meta-Cognitive-Coach', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 5230, successRate: 90.9, lastActive: '2025-06-17T22:37Z', description: 'Meta-Cognitive-Coach in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-EDEF', name: 'system_thinker', display_name: 'System-Thinker', category: 'MET', status: 'active', role: 'System-Thinker', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 4509, successRate: 92.9, lastActive: '2025-06-17T12:54Z', description: 'System-Thinker in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },
  { id: 'VLT-MET-4022', name: 'conceptual_architect', display_name: 'Conceptual-Architect', category: 'MET', status: 'idle', role: 'Conceptual-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 1024, successRate: 88.0, lastActive: '2025-06-17T17:13Z', description: 'Conceptual-Architect in Meta', tags: ['meta', 'systems', 'framework', 'abstraction'] },

  // FIN — FinTech (15) — Opus
  { id: 'VLT-FIN-1BEF', name: 'fintech_developer', display_name: 'FinTech-Developer', category: 'FIN', status: 'active', role: 'FinTech-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 6456, successRate: 98.0, lastActive: '2025-06-17T13:17Z', description: 'FinTech-Developer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-EB74', name: 'quantitative_analyst', display_name: 'Quantitative-Analyst', category: 'FIN', status: 'busy', role: 'Quantitative-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 3666, successRate: 95.4, lastActive: '2025-06-17T12:39Z', description: 'Quantitative-Analyst in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-DE0E', name: 'trading_algorithm_engineer', display_name: 'Trading-Algorithm-Engineer', category: 'FIN', status: 'active', role: 'Trading-Algorithm-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 6032, successRate: 91.5, lastActive: '2025-06-17T18:45Z', description: 'Trading-Algorithm-Engineer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-C639', name: 'blockchain_fintech', display_name: 'Blockchain-FinTech', category: 'FIN', status: 'idle', role: 'Blockchain-FinTech', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1795, successRate: 93.3, lastActive: '2025-06-17T15:58Z', description: 'Blockchain-FinTech in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-BA88', name: 'payment_systems_architect', display_name: 'Payment-Systems-Architect', category: 'FIN', status: 'active', role: 'Payment-Systems-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 1374, successRate: 93.7, lastActive: '2025-06-17T19:56Z', description: 'Payment-Systems-Architect in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-2C98', name: 'regtech_spezialist', display_name: 'RegTech-Spezialist', category: 'FIN', status: 'idle', role: 'RegTech-Spezialist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 7530, successRate: 91.6, lastActive: '2025-06-17T16:45Z', description: 'RegTech-Spezialist in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-0C38', name: 'wealthtech_developer', display_name: 'WealthTech-Developer', category: 'FIN', status: 'active', role: 'WealthTech-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 7334, successRate: 92.9, lastActive: '2025-06-17T12:57Z', description: 'WealthTech-Developer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-B6CA', name: 'insurtech_engineer', display_name: 'InsurTech-Engineer', category: 'FIN', status: 'active', role: 'InsurTech-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 6, tasksCompleted: 3744, successRate: 93.5, lastActive: '2025-06-17T17:26Z', description: 'InsurTech-Engineer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-E837', name: 'defi_developer', display_name: 'DeFi-Developer', category: 'FIN', status: 'offline', role: 'DeFi-Developer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 4311, successRate: 89.4, lastActive: '2025-06-17T23:50Z', description: 'DeFi-Developer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-1C60', name: 'risk_management_engineer', display_name: 'Risk-Management-Engineer', category: 'FIN', status: 'active', role: 'Risk-Management-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FIELD_TESTED', powerLevel: 8, tasksCompleted: 873, successRate: 95.9, lastActive: '2025-06-17T22:59Z', description: 'Risk-Management-Engineer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-8021', name: 'banking_integration_expert', display_name: 'Banking-Integration-Expert', category: 'FIN', status: 'active', role: 'Banking-Integration-Expert', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 5015, successRate: 99.9, lastActive: '2025-06-17T17:50Z', description: 'Banking-Integration-Expert in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-4331', name: 'financial_data_scientist', display_name: 'Financial-Data-Scientist', category: 'FIN', status: 'active', role: 'Financial-Data-Scientist', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 3899, successRate: 91.2, lastActive: '2025-06-17T14:38Z', description: 'Financial-Data-Scientist in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-4104', name: 'compliance_tech', display_name: 'Compliance-Tech', category: 'FIN', status: 'idle', role: 'Compliance-Tech', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 7644, successRate: 94.7, lastActive: '2025-06-17T21:28Z', description: 'Compliance-Tech in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-6F45', name: 'lending_platform_engineer', display_name: 'Lending-Platform-Engineer', category: 'FIN', status: 'offline', role: 'Lending-Platform-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 4734, successRate: 93.7, lastActive: '2025-06-17T14:31Z', description: 'Lending-Platform-Engineer in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },
  { id: 'VLT-FIN-8855', name: 'crypto_analyst', display_name: 'Crypto-Analyst', category: 'FIN', status: 'active', role: 'Crypto-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 6224, successRate: 96.8, lastActive: '2025-06-17T18:15Z', description: 'Crypto-Analyst in FinTech', tags: ['fintech', 'trading', 'blockchain', 'finance'] },

  // HYB — Hybrid (15) — Sonnet
  { id: 'VLT-HYB-3A8D', name: 'hybrid_developer', display_name: 'Hybrid-Developer', category: 'HYB', status: 'active', role: 'Hybrid-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 7571, successRate: 92.2, lastActive: '2025-06-17T12:24Z', description: 'Hybrid-Developer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-C817', name: 'cross_domain_integrator', display_name: 'Cross-Domain-Integrator', category: 'HYB', status: 'active', role: 'Cross-Domain-Integrator', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 7, tasksCompleted: 5996, successRate: 98.3, lastActive: '2025-06-17T21:19Z', description: 'Cross-Domain-Integrator in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-0CED', name: 'fullstack_ai_engineer', display_name: 'Fullstack-AI-Engineer', category: 'HYB', status: 'active', role: 'Fullstack-AI-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 3294, successRate: 93.0, lastActive: '2025-06-17T13:14Z', description: 'Fullstack-AI-Engineer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-A7AB', name: 'multi_disciplinary_architect', display_name: 'Multi-Disciplinary-Architect', category: 'HYB', status: 'active', role: 'Multi-Disciplinary-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 7278, successRate: 90.8, lastActive: '2025-06-17T16:31Z', description: 'Multi-Disciplinary-Architect in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-B6CD', name: 'bridge_builder', display_name: 'Bridge-Builder', category: 'HYB', status: 'idle', role: 'Bridge-Builder', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 4, tasksCompleted: 1838, successRate: 94.2, lastActive: '2025-06-17T17:36Z', description: 'Bridge-Builder in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-26BC', name: 'intersection_analyst', display_name: 'Intersection-Analyst', category: 'HYB', status: 'active', role: 'Intersection-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FIELD_TESTED', powerLevel: 7, tasksCompleted: 4208, successRate: 99.1, lastActive: '2025-06-17T13:36Z', description: 'Intersection-Analyst in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-58F9', name: 'hybrid_cloud_engineer', display_name: 'Hybrid-Cloud-Engineer', category: 'HYB', status: 'busy', role: 'Hybrid-Cloud-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 6428, successRate: 96.9, lastActive: '2025-06-17T22:47Z', description: 'Hybrid-Cloud-Engineer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-ED2F', name: 'cross_functional_lead', display_name: 'Cross-Functional-Lead', category: 'HYB', status: 'idle', role: 'Cross-Functional-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 2780, successRate: 87.5, lastActive: '2025-06-17T10:58Z', description: 'Cross-Functional-Lead in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-55B3', name: 'tech_business_hybrid', display_name: 'Tech-Business-Hybrid', category: 'HYB', status: 'active', role: 'Tech-Business-Hybrid', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 6, tasksCompleted: 6698, successRate: 87.5, lastActive: '2025-06-17T16:40Z', description: 'Tech-Business-Hybrid in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-60B1', name: 'adaptive_systems_engineer', display_name: 'Adaptive-Systems-Engineer', category: 'HYB', status: 'active', role: 'Adaptive-Systems-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 708, successRate: 87.7, lastActive: '2025-06-17T15:29Z', description: 'Adaptive-Systems-Engineer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-AD15', name: 'convergence_architect', display_name: 'Convergence-Architect', category: 'HYB', status: 'active', role: 'Convergence-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 2900, successRate: 89.0, lastActive: '2025-06-17T23:36Z', description: 'Convergence-Architect in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-96B5', name: 'hybrid_workflow_designer', display_name: 'Hybrid-Workflow-Designer', category: 'HYB', status: 'active', role: 'Hybrid-Workflow-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 5637, successRate: 92.1, lastActive: '2025-06-17T21:57Z', description: 'Hybrid-Workflow-Designer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-C02E', name: 'cross_platform_developer', display_name: 'Cross-Platform-Developer', category: 'HYB', status: 'active', role: 'Cross-Platform-Developer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1143, successRate: 87.1, lastActive: '2025-06-17T22:48Z', description: 'Cross-Platform-Developer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-0496', name: 'multi_stack_engineer', display_name: 'Multi-Stack-Engineer', category: 'HYB', status: 'offline', role: 'Multi-Stack-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Innovator', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 2819, successRate: 93.4, lastActive: '2025-06-17T17:24Z', description: 'Multi-Stack-Engineer in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },
  { id: 'VLT-HYB-DD45', name: 'integration_architect', display_name: 'Integration-Architect', category: 'HYB', status: 'idle', role: 'Integration-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 1909, successRate: 98.6, lastActive: '2025-06-17T16:41Z', description: 'Integration-Architect in Hybrid', tags: ['hybrid', 'integration', 'cross-domain', 'multi-stack'] },

  // HUM — Human-Centric (15) — Sonnet
  { id: 'VLT-HUM-D595', name: 'ux_researcher', display_name: 'UX-Researcher', category: 'HUM', status: 'active', role: 'UX-Researcher', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FIELD_TESTED', powerLevel: 9, tasksCompleted: 2949, successRate: 90.7, lastActive: '2025-06-17T16:31Z', description: 'UX-Researcher in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-5A4D', name: 'human_centered_designer', display_name: 'Human-Centered-Designer', category: 'HUM', status: 'idle', role: 'Human-Centered-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 1959, successRate: 92.3, lastActive: '2025-06-17T20:35Z', description: 'Human-Centered-Designer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-0151', name: 'accessibility_expert', display_name: 'Accessibility-Expert', category: 'HUM', status: 'active', role: 'Accessibility-Expert', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'TECHNICAL_VALID', powerLevel: 9, tasksCompleted: 3197, successRate: 90.2, lastActive: '2025-06-17T12:39Z', description: 'Accessibility-Expert in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-FB2A', name: 'behavioral_scientist', display_name: 'Behavioral-Scientist', category: 'HUM', status: 'idle', role: 'Behavioral-Scientist', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 3442, successRate: 97.3, lastActive: '2025-06-17T19:44Z', description: 'Behavioral-Scientist in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-DC6B', name: 'warmth_designer', display_name: 'Empathy-Designer', category: 'HUM', status: 'active', role: 'Empathy-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 5986, successRate: 98.8, lastActive: '2025-06-17T16:47Z', description: 'Empathy-Designer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-FA0C', name: 'social_impact_analyst', display_name: 'Social-Impact-Analyst', category: 'HUM', status: 'active', role: 'Social-Impact-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 3667, successRate: 88.4, lastActive: '2025-06-17T20:11Z', description: 'Social-Impact-Analyst in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-1566', name: 'inclusive_design_lead', display_name: 'Inclusive-Design-Lead', category: 'HUM', status: 'idle', role: 'Inclusive-Design-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 5905, successRate: 94.1, lastActive: '2025-06-17T20:37Z', description: 'Inclusive-Design-Lead in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-B74B', name: 'user_research_lead', display_name: 'User-Research-Lead', category: 'HUM', status: 'active', role: 'User-Research-Lead', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 1129, successRate: 98.1, lastActive: '2025-06-17T23:39Z', description: 'User-Research-Lead in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-5AFC', name: 'ethnographer', display_name: 'Ethnographer', category: 'HUM', status: 'busy', role: 'Ethnographer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Diplomat', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 10, tasksCompleted: 7444, successRate: 98.6, lastActive: '2025-06-17T10:26Z', description: 'Ethnographer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-A9D8', name: 'cognitive_designer', display_name: 'Cognitive-Designer', category: 'HUM', status: 'active', role: 'Cognitive-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 10, tasksCompleted: 5584, successRate: 92.4, lastActive: '2025-06-17T15:23Z', description: 'Cognitive-Designer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-7FE6', name: 'wellness_tech_designer', display_name: 'Wellness-Tech-Designer', category: 'HUM', status: 'idle', role: 'Wellness-Tech-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 4, tasksCompleted: 6421, successRate: 91.3, lastActive: '2025-06-17T15:31Z', description: 'Wellness-Tech-Designer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-91B2', name: 'human_factors_engineer', display_name: 'Human-Factors-Engineer', category: 'HUM', status: 'busy', role: 'Human-Factors-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 6758, successRate: 96.6, lastActive: '2025-06-17T14:58Z', description: 'Human-Factors-Engineer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-71AD', name: 'community_designer', display_name: 'Community-Designer', category: 'HUM', status: 'active', role: 'Community-Designer', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 9, tasksCompleted: 3208, successRate: 94.9, lastActive: '2025-06-17T14:15Z', description: 'Community-Designer in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-1BB9', name: 'emotional_intelligence_coach', display_name: 'Emotional-Intelligence-Coach', category: 'HUM', status: 'active', role: 'Emotional-Intelligence-Coach', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Sage', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 6, tasksCompleted: 3831, successRate: 93.2, lastActive: '2025-06-17T10:57Z', description: 'Emotional-Intelligence-Coach in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },
  { id: 'VLT-HUM-1FCC', name: 'trust_architect', display_name: 'Trust-Architect', category: 'HUM', status: 'active', role: 'Trust-Architect', llmProvider: 'Anthropic', llmModel: 'claude-sonnet-4-20251101', llmModelShort: 'Sonnet', personality: 'Visionary', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 6, tasksCompleted: 6053, successRate: 87.6, lastActive: '2025-06-17T10:32Z', description: 'Trust-Architect in Human-Centric', tags: ['human-centric', 'UX', 'accessibility', 'inclusive-design'] },

  // DAT — Data-Specialist (16) — Opus
  { id: 'VLT-DAT-884A', name: 'data_architect', display_name: 'Data-Architect', category: 'DAT', status: 'active', role: 'Data-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 4976, successRate: 85.3, lastActive: '2025-06-17T20:14Z', description: 'Data-Architect in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-D7CC', name: 'etl_engineer', display_name: 'ETL-Engineer', category: 'DAT', status: 'active', role: 'ETL-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1221, successRate: 85.5, lastActive: '2025-06-17T10:58Z', description: 'ETL-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-5BF2', name: 'data_quality_analyst', display_name: 'Data-Quality-Analyst', category: 'DAT', status: 'idle', role: 'Data-Quality-Analyst', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 7365, successRate: 94.8, lastActive: '2025-06-17T13:22Z', description: 'Data-Quality-Analyst in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-F05C', name: 'big_data_engineer', display_name: 'Big-Data-Engineer', category: 'DAT', status: 'busy', role: 'Big-Data-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 7, tasksCompleted: 1887, successRate: 93.9, lastActive: '2025-06-17T19:19Z', description: 'Big-Data-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-FDBD', name: 'data_warehouse_architect', display_name: 'Data-Warehouse-Architect', category: 'DAT', status: 'idle', role: 'Data-Warehouse-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'CERTIFIED_PROFESSIONAL', powerLevel: 4, tasksCompleted: 4517, successRate: 86.6, lastActive: '2025-06-17T12:40Z', description: 'Data-Warehouse-Architect in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-A3BB', name: 'streaming_data_engineer', display_name: 'Streaming-Data-Engineer', category: 'DAT', status: 'active', role: 'Streaming-Data-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 3487, successRate: 88.3, lastActive: '2025-06-17T11:46Z', description: 'Streaming-Data-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-2F1D', name: 'data_governance_lead', display_name: 'Data-Governance-Lead', category: 'DAT', status: 'active', role: 'Data-Governance-Lead', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 8, tasksCompleted: 5038, successRate: 99.0, lastActive: '2025-06-17T17:54Z', description: 'Data-Governance-Lead in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-B71D', name: 'data_visualization_expert', display_name: 'Data-Visualization-Expert', category: 'DAT', status: 'idle', role: 'Data-Visualization-Expert', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'TECHNICAL_VALID', powerLevel: 6, tasksCompleted: 7783, successRate: 90.5, lastActive: '2025-06-17T22:33Z', description: 'Data-Visualization-Expert in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-0A1B', name: 'data_product_manager', display_name: 'Data-Product-Manager', category: 'DAT', status: 'active', role: 'Data-Product-Manager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 2433, successRate: 86.8, lastActive: '2025-06-17T19:48Z', description: 'Data-Product-Manager in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-1EEF', name: 'data_privacy_engineer', display_name: 'Data-Privacy-Engineer', category: 'DAT', status: 'active', role: 'Data-Privacy-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 4, tasksCompleted: 1022, successRate: 89.2, lastActive: '2025-06-17T21:17Z', description: 'Data-Privacy-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-78C6', name: 'analytics_engineer', display_name: 'Analytics-Engineer', category: 'DAT', status: 'active', role: 'Analytics-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'TECHNICAL_VALID', powerLevel: 8, tasksCompleted: 5985, successRate: 89.2, lastActive: '2025-06-17T14:16Z', description: 'Analytics-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-35FA', name: 'data_ops_engineer', display_name: 'Data-Ops-Engineer', category: 'DAT', status: 'active', role: 'Data-Ops-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 9, tasksCompleted: 1538, successRate: 98.9, lastActive: '2025-06-17T10:29Z', description: 'Data-Ops-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-8021', name: 'master_data_manager', display_name: 'Master-Data-Manager', category: 'DAT', status: 'active', role: 'Master-Data-Manager', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'FORSETI_VERIFIED', powerLevel: 5, tasksCompleted: 1284, successRate: 98.6, lastActive: '2025-06-17T20:34Z', description: 'Master-Data-Manager in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-9659', name: 'data_mesh_architect', display_name: 'Data-Mesh-Architect', category: 'DAT', status: 'active', role: 'Data-Mesh-Architect', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Guardian', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 10, tasksCompleted: 2237, successRate: 91.8, lastActive: '2025-06-17T21:22Z', description: 'Data-Mesh-Architect in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-157A', name: 'real_time_data_engineer', display_name: 'Real-Time-Data-Engineer', category: 'DAT', status: 'active', role: 'Real-Time-Data-Engineer', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Analyst', certificationLevel: 'EXPERT_REVIEWED', powerLevel: 7, tasksCompleted: 3248, successRate: 90.1, lastActive: '2025-06-17T19:54Z', description: 'Real-Time-Data-Engineer in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
  { id: 'VLT-DAT-AE61', name: 'data_lineage_expert', display_name: 'Data-Lineage-Expert', category: 'DAT', status: 'active', role: 'Data-Lineage-Expert', llmProvider: 'Anthropic', llmModel: 'claude-opus-4-20251101', llmModelShort: 'Opus', personality: 'Strategist', certificationLevel: 'TECHNICAL_VALID', powerLevel: 5, tasksCompleted: 6058, successRate: 89.6, lastActive: '2025-06-17T13:16Z', description: 'Data-Lineage-Expert in Data-Specialist', tags: ['data', 'big-data', 'data-engineering', 'data-governance'] },
];

// ───────────────────────────────────────────────────────────────────────────────
// 3. TASKS DATA — 30 tasks
// ───────────────────────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────────────────────

export const tasksData: Task[] = [
  { id: 'TSK-001', title: 'Validate Q4 Financial Report', status: 'in-progress', priority: 'critical', category: 'GES', assignedAgentId: 'GES-003', progress: 72, dueDate: '2025-06-19', tags: ['finance', 'Q4', 'reporting'], description: 'Validate and finalize Q4 financial statements for board review.' },
  { id: 'TSK-002', title: 'Create 2025 Market Analysis', status: 'todo', priority: 'high', category: 'ANA', assignedAgentId: 'ANA-001', progress: 0, dueDate: '2025-06-22', tags: ['market', 'analysis', '2025'], description: 'Comprehensive market analysis for 2025 strategic planning cycle.' },
  { id: 'TSK-003', title: 'Q1 Social Media Campaign', status: 'in-progress', priority: 'high', category: 'MKT', assignedAgentId: 'MKT-001', progress: 45, dueDate: '2025-06-25', tags: ['social', 'campaign', 'Q1'], description: 'Design and execute Q1 social media marketing campaign across LinkedIn, X, and Instagram.' },
  { id: 'TSK-004', title: 'Optimize Production Line A', status: 'review', priority: 'critical', category: 'PRO', assignedAgentId: 'PRO-001', progress: 90, dueDate: '2025-06-18', tags: ['production', 'optimization', 'lean'], description: 'Optimize production line A throughput using lean methodology and Six Sigma tools.' },
  { id: 'TSK-005', title: 'Review Startup Pitch Deck', status: 'done', priority: 'medium', category: 'ENT', assignedAgentId: 'ENT-001', progress: 100, dueDate: '2025-06-15', tags: ['startup', 'pitch', 'review'], description: 'Review and refine startup pitch deck for Series A presentation to venture capital firms.' },
  { id: 'TSK-006', title: 'E-Commerce Conversion Rate', status: 'blocked', priority: 'high', category: 'ETR', assignedAgentId: 'ETR-001', progress: 30, dueDate: '2025-06-21', tags: ['e-commerce', 'conversion', 'AB-test'], description: 'Investigate drop in e-commerce conversion rate from 3.2% to 2.1% and propose fixes.' },
  { id: 'TSK-007', title: 'Food Inventory', status: 'todo', priority: 'medium', category: 'LEH', assignedAgentId: 'LEH-001', progress: 0, dueDate: '2025-06-24', tags: ['inventory', 'retail', 'food'], description: 'Conduct monthly food inventory across all 14 retail locations.' },
  { id: 'TSK-008', title: 'AI Fundamentals Learning Module', status: 'in-progress', priority: 'medium', category: 'SCH', assignedAgentId: 'SCH-001', progress: 60, dueDate: '2025-06-27', tags: ['education', 'AI', 'module'], description: 'Develop AI fundamentals learning module for corporate training with 12 lessons and 3 quizzes.' },
  { id: 'TSK-009', title: 'Update Inflation Forecast', status: 'todo', priority: 'high', category: 'ECO', assignedAgentId: 'ECO-001', progress: 0, dueDate: '2025-06-20', tags: ['inflation', 'forecast', 'economy'], description: 'Update macroeconomic inflation forecast with latest ECB and Federal Reserve data.' },
  { id: 'TSK-010', title: 'API Gateway Refactoring', status: 'in-progress', priority: 'critical', category: 'DEV', assignedAgentId: 'DEV-001', progress: 55, dueDate: '2025-06-18', tags: ['API', 'refactoring', 'architecture'], description: 'Complete API gateway refactoring to improve response times and support GraphQL federation.' },
  { id: 'TSK-011', title: 'Database Replication', status: 'review', priority: 'high', category: 'DEV', assignedAgentId: 'VLT-DEV-1B27', progress: 85, dueDate: '2025-06-19', tags: ['database', 'replication', 'DR'], description: 'Set up cross-region database replication for disaster recovery with sub-second RPO.' },
  { id: 'TSK-012', title: 'Incident Response Runbook', status: 'todo', priority: 'medium', category: 'DEV', assignedAgentId: 'VLT-DEV-4213', progress: 0, dueDate: '2025-06-26', tags: ['incident', 'runbook', 'SRE'], description: 'Document incident response procedures for new microservices and serverless functions.' },
  { id: 'TSK-013', title: 'Brand Refresh Concept', status: 'in-progress', priority: 'medium', category: 'ETR', assignedAgentId: 'VLT-ETR-C507', progress: 35, dueDate: '2025-06-28', tags: ['branding', 'design', 'refresh'], description: 'Create brand refresh concept including new color palette, typography, and motion guidelines.' },
  { id: 'TSK-014', title: 'AI Ethics Research Report', status: 'todo', priority: 'high', category: 'AIN', assignedAgentId: 'VLT-AIN-DD6D', progress: 0, dueDate: '2025-06-23', tags: ['research', 'AI-ethics', 'paper'], description: 'Author research report on ethical implications of autonomous agents in healthcare decisions.' },
  { id: 'TSK-015', title: 'GDPR Compliance Audit', status: 'in-progress', priority: 'critical', category: 'FIN', assignedAgentId: 'VLT-FIN-EB74', progress: 70, dueDate: '2025-06-19', tags: ['GDPR', 'compliance', 'audit'], description: 'Conduct comprehensive GDPR compliance audit across all 14 backend modules.' },
  { id: 'TSK-016', title: 'Patient Data Migration', status: 'blocked', priority: 'critical', category: 'GES', assignedAgentId: 'VLT-GES-3157', progress: 20, dueDate: '2025-06-20', tags: ['healthcare', 'migration', 'FHIR'], description: 'Migrate 45,000 patient records to FHIR R4 compliant format for interoperability.' },
  { id: 'TSK-017', title: 'Customer Acquisition Strategy', status: 'todo', priority: 'medium', category: 'MKT', assignedAgentId: 'MKT-002', progress: 0, dueDate: '2025-06-25', tags: ['acquisition', 'strategy', 'leads'], description: 'Develop customer acquisition strategy for Q3 2025 with CAC and LTV projections.' },
  { id: 'TSK-018', title: 'Supply Chain Optimization', status: 'in-progress', priority: 'high', category: 'PRO', assignedAgentId: 'PRO-003', progress: 50, dueDate: '2025-06-22', tags: ['supply-chain', 'optimization', 'logistics'], description: 'Optimize supply chain routes to reduce delivery times by 15% using network flow algorithms.' },
  { id: 'TSK-019', title: 'Microservices Monitoring', status: 'todo', priority: 'medium', category: 'DEV', assignedAgentId: 'VLT-DEV-7FB9', progress: 0, dueDate: '2025-06-24', tags: ['monitoring', 'microservices', 'observability'], description: 'Deploy monitoring stack for new microservices architecture with OpenTelemetry and Grafana.' },
  { id: 'TSK-020', title: 'LLM Prompt Engineering', status: 'in-progress', priority: 'high', category: 'DEV', assignedAgentId: 'DEV-001', progress: 40, dueDate: '2025-06-21', tags: ['LLM', 'prompts', 'optimization'], description: 'Optimize prompt templates for better response quality and 30% cost reduction.' },
  { id: 'TSK-021', title: 'Supplier Contract Review', status: 'todo', priority: 'medium', category: 'FIN', assignedAgentId: 'VLT-FIN-1BEF', progress: 0, dueDate: '2025-06-26', tags: ['contracts', 'suppliers', 'legal'], description: 'Review and negotiate updated supplier contract terms for Q3 procurement cycle.' },
  { id: 'TSK-022', title: 'Clinical Study Analysis', status: 'in-progress', priority: 'high', category: 'GES', assignedAgentId: 'VLT-GES-A043', progress: 65, dueDate: '2025-06-23', tags: ['clinical', 'study', 'analysis'], description: 'Analyze Phase II clinical trial data and generate summary report for regulatory submission.' },
  { id: 'TSK-023', title: 'Update Knowledge Base', status: 'done', priority: 'low', category: 'SCH', assignedAgentId: 'SCH-003', progress: 100, dueDate: '2025-06-16', tags: ['knowledge', 'documentation', 'wiki'], description: 'Update internal knowledge base with latest process documentation and API changes.' },
  { id: 'TSK-024', title: 'Security Incident #4021', status: 'in-progress', priority: 'critical', category: 'DEV', assignedAgentId: 'VLT-DEV-8ADE', progress: 80, dueDate: '2025-06-18', tags: ['security', 'incident', 'investigation'], description: 'Investigate and remediate security incident #4021 in payment service related to SQL injection attempt.' },
  { id: 'TSK-025', title: 'Product Launch Creative Concept', status: 'todo', priority: 'medium', category: 'ETR', assignedAgentId: 'VLT-ETR-50B3', progress: 0, dueDate: '2025-06-27', tags: ['creative', 'launch', 'concept'], description: 'Develop creative concept for upcoming flagship product launch with teaser campaign.' },
  { id: 'TSK-026', title: 'ML Model Retraining', status: 'review', priority: 'high', category: 'AIN', assignedAgentId: 'VLT-AIN-FA12', progress: 92, dueDate: '2025-06-19', tags: ['ML', 'retraining', 'pipeline'], description: 'Retrain recommendation model with Q2 user interaction data and A/B test configuration.' },
  { id: 'TSK-027', title: 'Q3 Sales Forecast', status: 'todo', priority: 'medium', category: 'ETR', assignedAgentId: 'ETR-002', progress: 0, dueDate: '2025-06-22', tags: ['forecast', 'sales', 'Q3'], description: 'Generate Q3 sales forecast with territory-level breakdown and product line granularity.' },
  { id: 'TSK-028', title: 'Investment Analysis', status: 'in-progress', priority: 'high', category: 'ECO', assignedAgentId: 'ECO-002', progress: 45, dueDate: '2025-06-21', tags: ['investment', 'analysis', 'portfolio'], description: 'Complete portfolio investment analysis for Q3 rebalancing with risk-adjusted returns.' },
  { id: 'TSK-029', title: 'CI/CD Pipeline Upgrade', status: 'todo', priority: 'medium', category: 'DEV', assignedAgentId: 'DEV-002', progress: 0, dueDate: '2025-06-25', tags: ['cicd', 'pipeline', 'upgrade'], description: 'Upgrade CI/CD pipeline to support new deployment environments and canary releases.' },
  { id: 'TSK-030', title: 'Network Segmentation', status: 'todo', priority: 'high', category: 'DEV', assignedAgentId: 'VLT-DEV-0659', progress: 0, dueDate: '2025-06-20', tags: ['network', 'segmentation', 'security'], description: 'Implement zero-trust network segmentation for production cluster with micro-firewalls.' },
];

// ───────────────────────────────────────────────────────────────────────────────
// 4. WORKFLOWS DATA — 15 workflows
// ───────────────────────────────────────────────────────────────────────────────

export const workflowsData: Workflow[] = [
  {
    id: 'WF-001', name: 'Financial Reporting Pipeline', type: 'sequential', category: 'GES',
    description: 'Automated financial reporting pipeline from data collection through validation to board presentation.',
    steps: [
      { agentId: 'ANA-001', role: 'Data Aggregation', order: 1 },
      { agentId: 'GES-003', role: 'Accounting Review', order: 2 },
      { agentId: 'GES-001', role: 'Report Generation', order: 3 },
      { agentId: 'VLT-FIN-EB74', role: 'Compliance-Check', order: 4 },
    ],
    usageCount: 234, successRate: 98.7, avgExecutionTime: '8m 42s',
    creator: 'USR-001', sharedWith: ['USR-002', 'USR-003', 'USR-004'], isTemplate: true,
    createdAt: '2024-09-15T10:00:00Z', tags: ['finance', 'reporting', 'board'],
  },
  {
    id: 'WF-002', name: 'Content Production Flow', type: 'sequential', category: 'MKT',
    description: 'Parallel content creation pipeline producing blog, social, and email assets simultaneously.',
    steps: [
      { agentId: 'VLT-ETR-50B3', role: 'Copywriting', order: 1 },
      { agentId: 'VLT-ETR-C507', role: 'Visual Design', order: 1 },
      { agentId: 'MKT-003', role: 'Content Adaptation', order: 1 },
      { agentId: 'MKT-001', role: 'Campaign Integration', order: 2 },
    ],
    usageCount: 567, successRate: 95.3, avgExecutionTime: '12m 18s',
    creator: 'USR-002', sharedWith: ['USR-001', 'USR-005'], isTemplate: true,
    createdAt: '2024-10-01T08:30:00Z', tags: ['content', 'marketing', 'sequential'],
  },
  {
    id: 'WF-003', name: 'Code Review & Deploy', type: 'sequential', category: 'DEV',
    description: 'End-to-end code review, testing, security scanning, and deployment automation.',
    steps: [
      { agentId: 'DEV-003', role: 'Test Generation', order: 1 },
      { agentId: 'DEV-001', role: 'Code Review', order: 2 },
      { agentId: 'VLT-FIN-DE0E', role: 'License Check', order: 3 },
      { agentId: 'VLT-DEV-8ADE', role: 'Security Scan', order: 4 },
      { agentId: 'DEV-002', role: 'Deployment', order: 5 },
    ],
    usageCount: 1234, successRate: 97.8, avgExecutionTime: '4m 56s',
    creator: 'USR-001', sharedWith: ['USR-002', 'USR-003', 'USR-004', 'USR-005', 'USR-006'], isTemplate: true,
    createdAt: '2024-08-20T09:00:00Z', tags: ['devops', 'cicd', 'deployment'],
  },
  {
    id: 'WF-004', name: 'Customer Support Escalation', type: 'hierarchical', category: 'DEV',
    description: 'Hierarchical support escalation from L1 triage through L3 engineering to resolution.',
    steps: [
      { agentId: 'VLT-DEV-4213', role: 'L1 Triage', order: 1 },
      { agentId: 'VLT-DEV-7FB9', role: 'L2 Diagnosis', order: 2 },
      { agentId: 'VLT-DEV-1B27', role: 'L3 Engineering', order: 3 },
      { agentId: 'VLT-DEV-8ADE', role: 'Security Review', order: 4 },
    ],
    usageCount: 892, successRate: 94.2, avgExecutionTime: '15m 33s',
    creator: 'USR-003', sharedWith: ['USR-001', 'USR-004'], isTemplate: false,
    createdAt: '2024-11-10T11:00:00Z', tags: ['support', 'escalation', 'incident'],
  },
  {
    id: 'WF-005', name: 'Forseti Review Debate', type: 'debate', category: 'FIN',
    description: 'Structured debate workflow for reviewing high-stakes compliance decisions with multi-perspective analysis.',
    steps: [
      { agentId: 'VLT-FIN-1BEF', role: 'Chair', order: 1 },
      { agentId: 'VLT-FIN-EB74', role: 'Compliance Argument', order: 2 },
      { agentId: 'ECO-001', role: 'Economic Argument', order: 3 },
      { agentId: 'VLT-DEV-8ADE', role: 'Technical Argument', order: 4 },
      { agentId: 'VLT-FIN-1BEF', role: 'Decision', order: 5 },
    ],
    usageCount: 145, successRate: 99.1, avgExecutionTime: '22m 15s',
    creator: 'USR-001', sharedWith: ['USR-002', 'USR-003'], isTemplate: true,
    createdAt: '2024-12-01T14:00:00Z', tags: ['compliance', 'debate', 'governance'],
  },
  {
    id: 'WF-006', name: 'Production Optimization', type: 'sequential', category: 'PRO',
    description: 'Lean production optimization workflow analyzing bottlenecks and proposing improvements.',
    steps: [
      { agentId: 'PRO-001', role: 'Data Collection', order: 1 },
      { agentId: 'ANA-001', role: 'Bottleneck Analysis', order: 2 },
      { agentId: 'PRO-002', role: 'Quality Check', order: 3 },
      { agentId: 'PRO-001', role: 'Implementation', order: 4 },
    ],
    usageCount: 345, successRate: 96.8, avgExecutionTime: '18m 42s',
    creator: 'USR-004', sharedWith: ['USR-001'], isTemplate: false,
    createdAt: '2024-10-15T07:30:00Z', tags: ['production', 'lean', 'optimization'],
  },
  {
    id: 'WF-007', name: 'Market Analysis Workflow', type: 'sequential', category: 'ANA',
    description: 'Comprehensive market analysis gathering data from multiple sources simultaneously.',
    steps: [
      { agentId: 'ECO-002', role: 'Market Data', order: 1 },
      { agentId: 'ANA-002', role: 'Trend Analysis', order: 1 },
      { agentId: 'MKT-002', role: 'Competitive Analysis', order: 1 },
      { agentId: 'ANA-001', role: 'Synthesis', order: 2 },
    ],
    usageCount: 278, successRate: 97.5, avgExecutionTime: '11m 22s',
    creator: 'USR-002', sharedWith: ['USR-001', 'USR-005'], isTemplate: true,
    createdAt: '2024-09-25T13:00:00Z', tags: ['market', 'analysis', 'research'],
  },
  {
    id: 'WF-008', name: 'Startup Due Diligence', type: 'sequential', category: 'ENT',
    description: 'Due diligence workflow for evaluating startup investment opportunities across financial, legal, and technical dimensions.',
    steps: [
      { agentId: 'ENT-001', role: 'Pitch Analysis', order: 1 },
      { agentId: 'ECO-001', role: 'Market Model', order: 2 },
      { agentId: 'VLT-FIN-1BEF', role: 'Legal Review', order: 3 },
      { agentId: 'ANA-001', role: 'Financial Model', order: 4 },
    ],
    usageCount: 89, successRate: 92.1, avgExecutionTime: '25m 48s',
    creator: 'USR-001', sharedWith: ['USR-003'], isTemplate: false,
    createdAt: '2024-11-20T10:00:00Z', tags: ['startup', 'duediligence', 'investment'],
  },
  {
    id: 'WF-009', name: 'Clinical Decision Process', type: 'hierarchical', category: 'GES',
    description: 'Hierarchical clinical decision support workflow with specialist consultation and evidence review.',
    steps: [
      { agentId: 'VLT-GES-A043', role: 'Initial Diagnosis', order: 1 },
      { agentId: 'VLT-GES-E795', role: 'Specialist Opinion', order: 2 },
      { agentId: 'VLT-GES-3157', role: 'Data Reconciliation', order: 3 },
      { agentId: 'VLT-GES-A043', role: 'Treatment Plan', order: 4 },
    ],
    usageCount: 456, successRate: 98.4, avgExecutionTime: '14m 10s',
    creator: 'USR-005', sharedWith: ['USR-001', 'USR-006'], isTemplate: true,
    createdAt: '2024-12-10T09:00:00Z', tags: ['clinical', 'decision', 'healthcare'],
  },
  {
    id: 'WF-010', name: 'Security Audit Workflow', type: 'sequential', category: 'DEV',
    description: 'Comprehensive security audit scanning all systems and generating compliance reports.',
    steps: [
      { agentId: 'VLT-DEV-8ADE', role: 'Vulnerability Scan', order: 1 },
      { agentId: 'VLT-DEV-7FB9', role: 'Log Analysis', order: 2 },
      { agentId: 'VLT-FIN-EB74', role: 'Compliance Check', order: 3 },
      { agentId: 'VLT-DEV-1B27', role: 'Reporting', order: 4 },
    ],
    usageCount: 567, successRate: 99.3, avgExecutionTime: '32m 05s',
    creator: 'USR-003', sharedWith: ['USR-001', 'USR-002', 'USR-004'], isTemplate: true,
    createdAt: '2024-08-05T08:00:00Z', tags: ['security', 'audit', 'compliance'],
  },
  {
    id: 'WF-011', name: 'Creative Brainstorming', type: 'debate', category: 'ETR',
    description: 'Structured creative debate generating innovative campaign and product ideas through adversarial collaboration.',
    steps: [
      { agentId: 'VLT-ETR-C507', role: 'Visual Proposal', order: 1 },
      { agentId: 'VLT-ETR-50B3', role: 'Narrative Proposal', order: 2 },
      { agentId: 'ENT-002', role: 'Innovation Argument', order: 3 },
      { agentId: 'MKT-001', role: 'Market Validation', order: 4 },
      { agentId: 'VLT-ETR-C507', role: 'Synthesis', order: 5 },
    ],
    usageCount: 198, successRate: 89.4, avgExecutionTime: '19m 28s',
    creator: 'USR-002', sharedWith: ['USR-001'], isTemplate: false,
    createdAt: '2024-10-28T15:00:00Z', tags: ['creative', 'brainstorming', 'innovation'],
  },
  {
    id: 'WF-012', name: 'Research Data Pipeline', type: 'sequential', category: 'AIN',
    description: 'Research data processing pipeline from collection to publication-ready analysis and visualization.',
    steps: [
      { agentId: 'VLT-AIN-BE4C', role: 'Data Collection', order: 1 },
      { agentId: 'ANA-001', role: 'Statistical Analysis', order: 2 },
      { agentId: 'VLT-AIN-DD6D', role: 'Interpretation', order: 3 },
      { agentId: 'VLT-AIN-FA12', role: 'Visualization', order: 4 },
    ],
    usageCount: 234, successRate: 96.2, avgExecutionTime: '21m 15s',
    creator: 'USR-005', sharedWith: ['USR-001', 'USR-006'], isTemplate: true,
    createdAt: '2024-11-05T11:30:00Z', tags: ['research', 'data', 'pipeline'],
  },
  {
    id: 'WF-013', name: 'E-Commerce A/B Test', type: 'sequential', category: 'ETR',
    description: 'Parallel A/B testing workflow for e-commerce optimization experiments with statistical validation.',
    steps: [
      { agentId: 'ETR-001', role: 'Variant A', order: 1 },
      { agentId: 'MKT-001', role: 'Variant B', order: 1 },
      { agentId: 'ANA-001', role: 'Result Analysis', order: 2 },
      { agentId: 'ETR-002', role: 'Implementation', order: 3 },
    ],
    usageCount: 412, successRate: 95.7, avgExecutionTime: '9m 48s',
    creator: 'USR-004', sharedWith: ['USR-001', 'USR-002'], isTemplate: false,
    createdAt: '2024-09-30T10:00:00Z', tags: ['e-commerce', 'AB-test', 'optimization'],
  },
  {
    id: 'WF-014', name: 'Educational Course Creation', type: 'sequential', category: 'SCH',
    description: 'Educational course creation workflow from curriculum design to assessment and LMS deployment.',
    steps: [
      { agentId: 'SCH-001', role: 'Curriculum Design', order: 1 },
      { agentId: 'VLT-ETR-50B3', role: 'Content Creation', order: 2 },
      { agentId: 'SCH-002', role: 'Assessment Design', order: 3 },
      { agentId: 'SCH-003', role: 'Knowledge Integration', order: 4 },
    ],
    usageCount: 156, successRate: 94.9, avgExecutionTime: '28m 36s',
    creator: 'USR-006', sharedWith: ['USR-001'], isTemplate: true,
    createdAt: '2024-12-15T08:00:00Z', tags: ['education', 'course', 'curriculum'],
  },
  {
    id: 'WF-015', name: 'Emergency Response Workflow', type: 'hierarchical', category: 'DEV',
    description: 'Emergency incident response with automated escalation and team coordination for critical system failures.',
    steps: [
      { agentId: 'VLT-DEV-4213', role: 'Detection', order: 1 },
      { agentId: 'VLT-DEV-8ADE', role: 'Isolation', order: 2 },
      { agentId: 'VLT-DEV-1B27', role: 'Resolution', order: 3 },
      { agentId: 'VLT-DEV-7FB9', role: 'Post-Mortem', order: 4 },
    ],
    usageCount: 67, successRate: 98.5, avgExecutionTime: '5m 12s',
    creator: 'USR-003', sharedWith: ['USR-001', 'USR-002', 'USR-004', 'USR-005', 'USR-006'], isTemplate: true,
    createdAt: '2024-07-20T00:00:00Z', tags: ['emergency', 'incident', 'response'],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// 5. WORKFLOW INSTANCES — 12 instances
// ───────────────────────────────────────────────────────────────────────────────

export const workflowInstances: WorkflowInstance[] = [
  { id: 'WI-001', definitionId: 'WF-001', status: 'running', currentStep: 3, progress: 72, startedAt: '2025-06-17T13:00:00Z', assignedAgents: ['ANA-001', 'GES-003', 'GES-001', 'VLT-FIN-EB74'], output: 'Report draft being generated...' },
  { id: 'WI-002', definitionId: 'WF-003', status: 'completed', currentStep: 5, progress: 100, startedAt: '2025-06-17T12:30:00Z', completedAt: '2025-06-17T12:35:00Z', assignedAgents: ['DEV-003', 'DEV-001', 'VLT-FIN-DE0E', 'VLT-DEV-8ADE', 'DEV-002'], output: 'Deployment successful. API v3.2.1 live on Production.' },
  { id: 'WI-003', definitionId: 'WF-002', status: 'running', currentStep: 2, progress: 45, startedAt: '2025-06-17T13:15:00Z', assignedAgents: ['VLT-ETR-50B3', 'VLT-ETR-C507', 'VLT-MKT-29F1', 'VLT-MKT-C1E3'], output: 'Social media graphics and blog content being created in parallel...' },
  { id: 'WI-004', definitionId: 'WF-010', status: 'running', currentStep: 1, progress: 18, startedAt: '2025-06-17T14:00:00Z', assignedAgents: ['VLT-DEV-8ADE', 'VLT-DEV-7FB9', 'VLT-FIN-EB74', 'VLT-DEV-1B27'], output: 'Vulnerability scan running... 23% complete, 2 moderate CVEs preliminarily identified.' },
  { id: 'WI-005', definitionId: 'WF-015', status: 'completed', currentStep: 4, progress: 100, startedAt: '2025-06-17T11:00:00Z', completedAt: '2025-06-17T11:08:00Z', assignedAgents: ['VLT-DEV-4213', 'VLT-DEV-8ADE', 'VLT-DEV-1B27', 'VLT-DEV-7FB9'], output: 'Incident #4022 resolved. Root cause: memory leak in payment-svc v2.1.3. Patch deployed.' },
  { id: 'WI-006', definitionId: 'WF-007', status: 'pending', currentStep: 0, progress: 0, startedAt: '2025-06-17T15:00:00Z', assignedAgents: ['ECO-002', 'ANA-002', 'MKT-002', 'ANA-001'], output: undefined },
  { id: 'WI-007', definitionId: 'WF-005', status: 'running', currentStep: 3, progress: 60, startedAt: '2025-06-17T12:00:00Z', assignedAgents: ['VLT-FIN-1BEF', 'VLT-FIN-EB74', 'ECO-001', 'VLT-DEV-8ADE'], output: 'Debate: Economic vs. Compliance position on data processing in third countries.' },
  { id: 'WI-008', definitionId: 'WF-004', status: 'failed', currentStep: 2, progress: 45, startedAt: '2025-06-17T10:00:00Z', assignedAgents: ['VLT-DEV-4213', 'VLT-DEV-7FB9', 'VLT-DEV-1B27', 'VLT-DEV-8ADE'], output: 'Error: Escalation to L3 not possible — VLT-DEV-1B27 maintenance window. Manual escalation required.' },
  { id: 'WI-009', definitionId: 'WF-012', status: 'running', currentStep: 2, progress: 55, startedAt: '2025-06-17T13:30:00Z', assignedAgents: ['VLT-AIN-BE4C', 'ANA-001', 'VLT-AIN-DD6D', 'VLT-AIN-FA12'], output: 'Statistical analysis running... ETA 8 minutes. 2,847 data points processed.' },
  { id: 'WI-010', definitionId: 'WF-009', status: 'completed', currentStep: 4, progress: 100, startedAt: '2025-06-17T11:30:00Z', completedAt: '2025-06-17T11:47:00Z', assignedAgents: ['VLT-GES-A043', 'VLT-GES-E795', 'VLT-GES-3157'], output: 'Treatment plan generated. Patient ID: 28471. Recommended therapy: Immunotherapy combination.' },
  { id: 'WI-011', definitionId: 'WF-013', status: 'running', currentStep: 1, progress: 30, startedAt: '2025-06-17T14:15:00Z', assignedAgents: ['VLT-ETR-C507', 'VLT-MKT-29F1', 'VLT-ANA-F5B5', 'VLT-ETR-50B3'], output: 'Variants A & B being tested in parallel... active users: 12,847 (A) vs. 12,903 (B).' },
  { id: 'WI-012', definitionId: 'WF-006', status: 'pending', currentStep: 0, progress: 0, startedAt: '2025-06-17T15:30:00Z', assignedAgents: ['PRO-001', 'ANA-001', 'PRO-002'], output: undefined },
];


// ───────────────────────────────────────────────────────────────────────────────
// 6. COLLABORATION DATA — 5 patterns
// ───────────────────────────────────────────────────────────────────────────────

export const collaborationData: CollaborationPattern[] = [
  {
    id: 'COL-001', name: 'Sequential Delegation',
    description: 'Tasks flow sequentially through a chain of specialists, each building on the previous output. Ideal for document creation, multi-stage analysis, and approval workflows.',
    participatingAgents: ['VLT-FIN-1BEF', 'ANA-001', 'GES-001', 'VLT-ETR-50B3'],
    coordinatorAgentId: 'GES-001', status: 'active',
    messages: [
      { agentId: 'VLT-FIN-1BEF', content: 'Contract framework reviewed. Clauses 3.2 and 7.1 require revision due to new GDPR requirements.', timestamp: '2025-06-17T13:00:00Z', type: 'analysis' },
      { agentId: 'ANA-001', content: 'Risk analysis complete. Probability of regulatory rejection: 23% -> 8% after revision.', timestamp: '2025-06-17T13:15:00Z', type: 'analysis' },
      { agentId: 'GES-001', content: 'Business assessment: Cost-benefit ratio positive with 12-month amortization. Projected ROI: 340%.', timestamp: '2025-06-17T13:35:00Z', type: 'decision' },
      { agentId: 'VLT-ETR-50B3', content: 'Communication strategy drafted. Stakeholder briefing ready with 3 variants.', timestamp: '2025-06-17T13:50:00Z', type: 'text' },
    ],
    artifacts: ['Contract-Review-v2.pdf', 'Risk-Analysis-Q2.xlsx', 'Stakeholder-Briefing.md', 'Communication-Plan.docx'],
    sessionId: 'SESS-2025-001',
  },
  {
    id: 'COL-002', name: 'Parallel Consultation',
    description: 'Multiple domain experts provide simultaneous input on a complex problem. Results are synthesized by the coordinator into a unified recommendation.',
    participatingAgents: ['ECO-001', 'VLT-GES-A043', 'VLT-DEV-8ADE', 'VLT-FIN-EB74', 'ANA-001'],
    coordinatorAgentId: 'ANA-001', status: 'active',
    messages: [
      { agentId: 'ECO-001', content: 'Macroeconomic conditions stable. Inflation rate at 2.1%. Healthcare market growing 7.3% annually.', timestamp: '2025-06-17T12:00:00Z', type: 'analysis' },
      { agentId: 'VLT-GES-A043', content: 'Clinical data validated. Patient outcomes exceed expectations by 18% with side effect rate under 3%.', timestamp: '2025-06-17T12:05:00Z', type: 'analysis' },
      { agentId: 'VLT-DEV-8ADE', content: 'Security assessment: No critical vulnerabilities identified. Data encryption meets AES-256 standard.', timestamp: '2025-06-17T12:10:00Z', type: 'analysis' },
      { agentId: 'VLT-FIN-EB74', content: 'Regulatory review: Product approval imminent. CE marking expected Q3.', timestamp: '2025-06-17T12:15:00Z', type: 'analysis' },
      { agentId: 'ANA-001', content: 'SYNTHESIS: GO RECOMMENDATION for market entry. All dimensions green. Risk score: 0.12/10.', timestamp: '2025-06-17T12:25:00Z', type: 'decision' },
    ],
    artifacts: ['Market-Entry-Analysis-v3.pdf', 'Security-Report-Q2.pdf', 'Regulatory-Approval.pdf', 'Clinical-Summary.docx'],
    sessionId: 'SESS-2025-002',
  },
  {
    id: 'COL-003', name: 'Iterative Refinement',
    description: 'Repeated cycles of generation, review, and improvement until quality threshold is met. Used for code, designs, and critical documents requiring high precision.',
    participatingAgents: ['DEV-001', 'DEV-003', 'PRO-002', 'VLT-ETR-C507'],
    coordinatorAgentId: 'DEV-001', status: 'active',
    messages: [
      { agentId: 'DEV-001', content: 'Code review round 4: 97.4% coverage achieved. Remaining 2 issues in auth middleware resolved.', timestamp: '2025-06-17T11:00:00Z', type: 'code' },
      { agentId: 'DEV-003', content: 'Test results: All 431 tests passed. No performance regression detectable. Latency < 120ms p95.', timestamp: '2025-06-17T11:10:00Z', type: 'analysis' },
      { agentId: 'PRO-002', content: 'QA sign-off granted. Quality metrics exceed threshold by 15%. Zero critical defects.', timestamp: '2025-06-17T11:20:00Z', type: 'decision' },
      { agentId: 'VLT-ETR-C507', content: 'Documentation design finalized. API docs meet brand standards. Dark mode support added.', timestamp: '2025-06-17T11:30:00Z', type: 'text' },
      { agentId: 'DEV-001', content: 'FINAL APPROVAL. All quality criteria met. Ready for deployment to production.', timestamp: '2025-06-17T11:35:00Z', type: 'decision' },
    ],
    artifacts: ['Source-Code-v3.2.1.zip', 'Testreport-431.pdf', 'API-Dokumentation.html', 'CHANGELOG.md'],
    sessionId: 'SESS-2025-003',
  },
  {
    id: 'COL-004', name: 'Expert Panel',
    description: 'A panel of senior experts debate and vote on strategic decisions. Each brings specialized domain knowledge and advocates for their perspective.',
    participatingAgents: ['GES-001', 'ECO-001', 'ENT-001', 'VLT-FIN-1BEF', 'VLT-DEV-1B27'],
    coordinatorAgentId: 'GES-001', status: 'completed',
    messages: [
      { agentId: 'ENT-001', content: 'Innovation pipeline evaluated. Three products with Series A potential identified. Market fit validated.', timestamp: '2025-06-17T10:00:00Z', type: 'analysis' },
      { agentId: 'ECO-001', content: 'Economic indicators: SaaS market growing 28% annually in DACH region. Competitive intensity moderate.', timestamp: '2025-06-17T10:10:00Z', type: 'analysis' },
      { agentId: 'VLT-FIN-1BEF', content: 'IP legal review: No conflicts with existing patents detectable. Trademark registration recommended.', timestamp: '2025-06-17T10:20:00Z', type: 'analysis' },
      { agentId: 'VLT-DEV-1B27', content: 'Technical feasibility confirmed. Architecture scales linearly to 10M users. Cloud costs: EUR 0.08/user/month.', timestamp: '2025-06-17T10:30:00Z', type: 'analysis' },
      { agentId: 'GES-001', content: 'VOTE RESULT: UNANIMOUS for investment in Product Alpha. Budget: EUR 2.4M over 18 months.', timestamp: '2025-06-17T10:45:00Z', type: 'decision' },
    ],
    artifacts: ['Investment-Decision-Alpha.pdf', 'Due-Diligence-Report.pdf', 'Budget-Plan-v2.xlsx', 'Technical-Architecture.pdf'],
    sessionId: 'SESS-2025-004',
  },
  {
    id: 'COL-005', name: 'Hierarchical Escalation',
    description: 'Issues escalate through organizational levels until resolved. Each tier has broader authority and resources. Used for incidents and critical failures.',
    participatingAgents: ['VLT-DEV-4213', 'VLT-DEV-7FB9', 'VLT-DEV-1B27', 'VLT-DEV-8ADE', 'GES-001'],
    coordinatorAgentId: 'VLT-DEV-4213', status: 'active',
    messages: [
      { agentId: 'VLT-DEV-4213', content: 'ALERT: API latency over 500ms for 3 minutes in zone eu-west-1. Escalating to L2.', timestamp: '2025-06-17T14:00:00Z', type: 'alert' },
      { agentId: 'VLT-DEV-7FB9', content: 'Diagnosis: Database connection pool exhausted. 47/50 active connections. Slow queries identified.', timestamp: '2025-06-17T14:05:00Z', type: 'analysis' },
      { agentId: 'VLT-DEV-1B27', content: 'Pool limit increased to 120. Auto-scaling activated. Read replica for reporting queries configured.', timestamp: '2025-06-17T14:10:00Z', type: 'code' },
      { agentId: 'VLT-DEV-8ADE', content: 'Security check: No attack pattern detected. Resource bottleneck caused by batch job.', timestamp: '2025-06-17T14:12:00Z', type: 'analysis' },
      { agentId: 'VLT-DEV-4213', content: 'RESOLVED: Latency stabilized under 200ms. Post-mortem being created. Batch job rescheduled to night.', timestamp: '2025-06-17T14:18:00Z', type: 'decision' },
    ],
    artifacts: ['Incident-Report-4022.pdf', 'Post-Mortem.md', 'Runbook-Update.patch', 'Batch-Job-Schedule.xlsx'],
    sessionId: 'SESS-2025-005',
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// 7. ACTIVITY FEED DATA — 20 events
// ───────────────────────────────────────────────────────────────────────────────

export const activityFeedData: ActivityEvent[] = [
  { id: 'EVT-001', type: 'workflow', agentId: 'DEV-001', agentName: 'CodeGen Weber', action: 'completed deployment of', target: 'API Gateway v3.2.1', targetId: 'TSK-010', timestamp: '2025-06-17T14:58:00Z', severity: 'low', details: 'Zero-downtime deployment successful. All 47 health checks passed. P95 latency: 118ms.' },
  { id: 'EVT-002', type: 'agent', agentId: 'ANA-001', agentName: 'Schmidt Analytik', action: 'generated market forecast report', target: 'Q3-2025 DACH Outlook', targetId: 'TSK-002', timestamp: '2025-06-17T14:55:00Z', severity: 'low', details: 'Report includes DAX, S&P 500, Nikkei, and STOXX Europe 600 projections with 95% confidence intervals.' },
  { id: 'EVT-003', type: 'system', agentName: 'System', action: 'triggered auto-scaling for', target: 'Database Cluster', timestamp: '2025-06-17T14:52:00Z', severity: 'medium', details: 'Connection pool exhausted (47/50). Auto-scaled from 3 to 5 instances. Replication lag: < 1s.' },
  { id: 'EVT-004', type: 'workflow', agentId: 'VLT-DEV-4213', agentName: 'RunFriedrich', action: 'resolved incident', target: '#4022 API Latency Spike', targetId: 'WI-005', timestamp: '2025-06-17T14:45:00Z', severity: 'high', details: 'Root cause: connection pool depletion by analytics batch job. Mitigation: pool limit increased, job rescheduled to 02:00 UTC.' },
  { id: 'EVT-005', type: 'agent', agentId: 'GES-003', agentName: 'Weber Controlling', action: 'submitted Q2 financial report for', target: 'Board Review', targetId: 'TSK-001', timestamp: '2025-06-17T14:32:00Z', severity: 'low', details: 'Revenue: EUR 48.7M (+15% YoY). EBITDA margin: 25.3%. Free cash flow: EUR 9.2M.' },
  { id: 'EVT-006', type: 'agent', agentId: 'VLT-ETR-50B3', agentName: 'TextLehmann', action: 'published content for', target: 'Q3 Marketing Campaign', targetId: 'TSK-003', timestamp: '2025-06-17T14:28:00Z', severity: 'low', details: '15 social posts, 4 blog articles, 2 email sequences, and 1 whitepaper generated and approved.' },
  { id: 'EVT-007', type: 'security', agentId: 'VLT-DEV-8ADE', agentName: 'SecHofmann', action: 'detected anomaly in', target: 'Payment Service', timestamp: '2025-06-17T14:20:00Z', severity: 'critical', details: 'Unusual traffic pattern from IP 185.220.101.xx — 847 requests/min. Kill-switch armed. Investigation active.' },
  { id: 'EVT-008', type: 'workflow', agentId: 'PRO-001', agentName: 'Bauer Fertigung', action: 'optimized production line', target: 'Line A Throughput +15%', targetId: 'TSK-004', timestamp: '2025-06-17T14:15:00Z', severity: 'low', details: 'Lean analysis complete. Bottleneck removed at station 3. OEE improved from 72% to 87%.' },
  { id: 'EVT-009', type: 'agent', agentId: 'VLT-GES-A043', agentName: 'DocMueller', action: 'completed clinical analysis for', target: 'Study PH-28471', targetId: 'TSK-022', timestamp: '2025-06-17T14:10:00Z', severity: 'medium', details: 'Phase II results positive. p-value < 0.01 for primary endpoint. ORR: 68% vs. 41% control.' },
  { id: 'EVT-010', type: 'comment', agentName: 'Herrmann Verwaltung', action: 'commented on', target: 'Investitionsbeschluss Alpha', timestamp: '2025-06-17T14:05:00Z', severity: 'low', details: 'Recommended budget increase to EUR 2.8M for extended market share in North America.' },
  { id: 'EVT-011', type: 'system', agentName: 'System', action: 'scheduled maintenance window', target: '2025-06-19 02:00 UTC', timestamp: '2025-06-17T14:00:00Z', severity: 'medium', details: 'Planned DB upgrade to PostgreSQL 16. Expected downtime: 12 minutes. Streaming replication active.' },
  { id: 'EVT-012', type: 'agent', agentId: 'VLT-FIN-EB74', agentName: 'ComplianceKlein', action: 'completed GDPR audit for', target: 'Analytics Module', targetId: 'TSK-015', timestamp: '2025-06-17T13:50:00Z', severity: 'low', details: '3 minor findings documented. Remediation plan created with 14-day timeline. No critical gaps.' },
  { id: 'EVT-013', type: 'workflow', agentId: 'ETR-001', agentName: 'Meyer Handel', action: 'identified conversion drop in', target: 'Checkout Flow v2.1', targetId: 'TSK-006', timestamp: '2025-06-17T13:45:00Z', severity: 'high', details: 'Conversion rate dropped from 3.2% to 2.1% since June 12. Mobile checkout affected most (-34%).' },
  { id: 'EVT-014', type: 'agent', agentId: 'ENT-001', agentName: 'Hofmann Venture', action: 'reviewed pitch deck for', target: 'Startup NanoGrid', targetId: 'TSK-005', timestamp: '2025-06-17T13:30:00Z', severity: 'low', details: 'Due diligence complete. Recommended for seed investment. TAM: EUR 2.1B. Strong team fit.' },
  { id: 'EVT-015', type: 'security', agentId: 'VLT-DEV-8ADE', agentName: 'SecHofmann', action: 'rotated API keys for', target: 'External Integrations', timestamp: '2025-06-17T13:00:00Z', severity: 'medium', details: 'Scheduled key rotation completed. 52 integrations updated. Zero downtime. Old keys expired.' },
  { id: 'EVT-016', type: 'workflow', agentId: 'SCH-001', agentName: 'Koch Bildung', action: 'published learning module', target: 'KI-Grundlagen Kurs v2', targetId: 'TSK-008', timestamp: '2025-06-17T12:45:00Z', severity: 'low', details: 'Module includes 14 lessons, 4 quizzes, 1 final project, and hands-on labs. 340 enrollments in first hour.' },
  { id: 'EVT-017', type: 'agent', agentId: 'ECO-001', agentName: 'Berger Makro', action: 'updated inflation forecast', target: '2.1% (previously 2.4%)', targetId: 'TSK-009', timestamp: '2025-06-17T12:30:00Z', severity: 'low', details: 'ECB rate cut expectations and falling energy prices drive revision. Core inflation stable at 2.3%.' },
  { id: 'EVT-018', type: 'security', agentName: 'System', action: 'blocked suspicious login from', target: 'IP 91.203.164.xx', timestamp: '2025-06-17T12:15:00Z', severity: 'high', details: 'Brute-force attempt detected: 28 failed logins in 4 minutes. IP auto-blocked for 24h. MFA enforced.' },
  { id: 'EVT-019', type: 'workflow', agentId: 'VLT-ETR-C507', agentName: 'KunstSchulz', action: 'submitted brand refresh concept', target: 'Phase 1 Review', targetId: 'TSK-013', timestamp: '2025-06-17T12:00:00Z', severity: 'low', details: '4 color palette options, 3 typography systems, and 2 motion design languages presented.' },
  { id: 'EVT-020', type: 'system', agentName: 'System', action: 'completed daily backup', target: 'all 17 tables, 20 indexes', timestamp: '2025-06-17T02:00:00Z', severity: 'low', details: 'Backup size: 2.7GB. Duration: 52s. Verified with SHA-256. Retention: 30 days. Offsite copy synced.' },
];

// ───────────────────────────────────────────────────────────────────────────────
// 8. SECURITY EVENTS — 15 events
// ───────────────────────────────────────────────────────────────────────────────

export const securityEvents: SecurityEvent[] = [
  { id: 'SEC-001', type: 'anomaly_detection', severity: 'critical', agentId: 'VLT-DEV-8ADE', agentName: 'SecHofmann', description: 'Abnormal outbound data transfer detected from payment-service. 847 MB transferred to unknown IP 203.0.113.xx within 4 minutes.', timestamp: '2025-06-17T14:20:00Z', resolved: true, resolution: 'False positive — legitimate batch export to new disaster-recovery site in Frankfurt. Whitelist updated. Alert threshold raised.' },
  { id: 'SEC-002', type: 'failed_login', severity: 'high', agentName: 'System', description: '28 consecutive failed login attempts for user admin@valtheron.ai from IP 91.203.164.45. Geolocation: Bucharest, RO.', timestamp: '2025-06-17T12:15:00Z', resolved: true, resolution: 'IP auto-blocked for 24 hours. Geo-blocking for non-DACH admin access enabled. MFA token rotation enforced.' },
  { id: 'SEC-003', type: 'privilege_escalation', severity: 'critical', agentId: 'DEV-003', agentName: 'TestKlein QA', description: 'Agent TestKlein attempted to access secrets table without authorization. Query: SELECT * FROM secrets WHERE provider = "stripe".', timestamp: '2025-06-17T11:30:00Z', resolved: true, resolution: 'Permission misconfiguration in test environment fixed. Row-level security policy updated. Correct alert triggered.' },
  { id: 'SEC-004', type: 'certificate_expiry', severity: 'medium', agentId: 'VLT-DEV-0659', agentName: 'NetzBauer', description: 'TLS certificate for api.valtheron.ai expires in 7 days (2025-06-24). Auto-renewal scheduled but not confirmed.', timestamp: '2025-06-17T10:00:00Z', resolved: false, resolution: undefined },
  { id: 'SEC-005', type: 'vulnerability_scan', severity: 'high', agentId: 'VLT-DEV-8ADE', agentName: 'SecHofmann', description: 'CVE-2025-21893 detected in dependency better-sqlite3 v11.6.0. CVSS 8.1 — SQL injection via crafted COLLATE clause.', timestamp: '2025-06-17T09:00:00Z', resolved: true, resolution: 'Upgraded to better-sqlite3 v12.1.0. Dependency audit performed. No exploitation evidence found in logs.' },
  { id: 'SEC-006', type: 'kill_switch', severity: 'critical', agentId: 'DEV-003', agentName: 'TestKlein QA', description: 'Kill-switch activated for agent TestKlein QA. Reason: infinite loop in test generation causing 100% CPU for 8 minutes.', timestamp: '2025-06-17T08:45:00Z', resolved: true, resolution: 'Agent terminated safely after state persistence. Test code reviewed. Timeout policy added: max 120s per test batch.' },
  { id: 'SEC-007', type: 'data_access', severity: 'medium', agentId: 'VLT-GES-3157', agentName: 'HealthBauer', description: 'Agent HealthBauer accessed 23 patient records outside assigned ward Oncology. Ward: Cardiology.', timestamp: '2025-06-17T07:20:00Z', resolved: true, resolution: 'Access logged for audit. Legitimate cross-consultation authorized by Dr. Weber. Scope restrictions documented.' },
  { id: 'SEC-008', type: 'anomaly_detection', severity: 'high', agentId: 'ETR-001', agentName: 'Meyer Handel', description: 'Unusual pricing pattern: 400% markup applied to 47 products within 5 minutes. Estimated revenue impact: EUR 12,000 overcharge.', timestamp: '2025-06-17T06:00:00Z', resolved: true, resolution: 'Pricing algorithm bug in dynamic pricing engine identified and patched. Affected orders refunded. Rollback executed.' },
  { id: 'SEC-009', type: 'api_abuse', severity: 'medium', agentName: 'System', description: 'Rate limit exceeded on /api/v1/agents endpoint by client app-portal. 1,247 req/min (limit: 300). Pattern: enumeration attack.', timestamp: '2025-06-16T22:30:00Z', resolved: true, resolution: 'Client throttled. Added caching layer with 60s TTL. Rate limit adjusted to burst: 500, sustained: 300. API key scoped.' },
  { id: 'SEC-010', type: 'secrets_exposure', severity: 'critical', agentId: 'DEV-002', agentName: 'BuildMueller CI', description: 'API key fragment "sk_live_3x9" detected in CI build log for pipeline #28471. Service: Stripe production.', timestamp: '2025-06-16T20:00:00Z', resolved: true, resolution: 'Key rotated immediately within 3 minutes. Log redaction policy updated. Secret scanning (gitleaks) enabled in CI. 0 unauthorized usage.' },
  { id: 'SEC-011', type: 'privilege_escalation', severity: 'high', agentId: 'ANA-003', agentName: 'Fischer Insights', description: 'Agent Fischer Insights attempted workflow deletion without sufficient certification level. Required: FORSETI_VERIFIED, Current: FIELD_TESTED.', timestamp: '2025-06-16T18:30:00Z', resolved: true, resolution: 'Action blocked by Forseti authorization framework. Certification requirements enforced. Agent notified of policy.' },
  { id: 'SEC-012', type: 'vulnerability_scan', severity: 'medium', agentId: 'VLT-DEV-8ADE', agentName: 'SecHofmann', description: 'Medium severity: Open port 6379 (Redis) exposed on production network segment 10.0.3.0/24. Authentication: disabled.', timestamp: '2025-06-16T16:00:00Z', resolved: true, resolution: 'Port closed immediately. Redis bound to localhost with UNIX socket. Firewall rules updated. AUTH password configured.' },
  { id: 'SEC-013', type: 'failed_login', severity: 'low', agentName: 'System', description: '3 failed login attempts for viewer@valtheron.ai. Password reset link sent to registered email.', timestamp: '2025-06-16T14:20:00Z', resolved: true, resolution: 'User successfully reset password. Account access restored. Login history reviewed — no suspicious activity.' },
  { id: 'SEC-014', type: 'data_access', severity: 'high', agentId: 'VLT-FIN-DE0E', agentName: 'VertragSimon', description: 'Agent VertragSimon downloaded 284 contracts at 03:00 local time outside normal working hours. Pattern: bulk export.', timestamp: '2025-06-16T03:00:00Z', resolved: true, resolution: 'Authorized batch job for M&A due diligence preparation. Activity documented in audit log. DLP policy exception approved.' },
  { id: 'SEC-015', type: 'certificate_rotation', severity: 'low', agentId: 'VLT-DEV-0659', agentName: 'NetzBauer', description: 'Root CA certificate LetsEncrypt R3 renewed successfully. Auto-renewal confirmed. Chain validation passed. Expiry: 2025-09-15.', timestamp: '2025-06-16T01:00:00Z', resolved: true, resolution: 'Certificate renewed. OCSP stapling verified. All clients validated new chain successfully.' },
];

// ───────────────────────────────────────────────────────────────────────────────
// 9. AUDIT LOG DATA — 15 entries
// ───────────────────────────────────────────────────────────────────────────────

export const auditLogData: AuditLogEntry[] = [
  { id: 'AUD-001', userId: 'USR-001', username: 'admin.schmidt', action: 'workflow_create', entity: 'workflow', entityId: 'WF-016', details: 'Created new workflow "Data Migration Pipeline" with 5 steps spanning DEV, SYS, and LEG agents', timestamp: '2025-06-17T14:50:00Z', ip: '10.0.1.15' },
  { id: 'AUD-002', userId: 'USR-003', username: 'ops.mueller', action: 'agent_kill_switch', entity: 'agent', entityId: 'DEV-003', details: 'Activated kill-switch for agent TestKlein QA — infinite loop detected in test generation, CPU 100% for 480s', timestamp: '2025-06-17T14:48:00Z', ip: '10.0.1.23' },
  { id: 'AUD-003', userId: 'USR-002', username: 'editor.weber', action: 'agent_update', entity: 'agent', entityId: 'MKT-001', details: 'Updated personality profile for Schulz Werbung: creativity 0.65 -> 0.80, risk_tolerance 0.50 -> 0.65', timestamp: '2025-06-17T14:35:00Z', ip: '10.0.1.18' },
  { id: 'AUD-004', userId: 'USR-001', username: 'admin.schmidt', action: 'user_permission_change', entity: 'user', entityId: 'USR-006', details: 'Changed role from Viewer to Editor for user anna.fischer. Workflows access: 12 shared.', timestamp: '2025-06-17T14:20:00Z', ip: '10.0.1.15' },
  { id: 'AUD-005', userId: 'USR-004', username: 'viewer.krause', action: 'file_download', entity: 'shared_file', entityId: 'FILE-1284', details: 'Downloaded Q2-Financial-Report.pdf (2.7 MB). Page count: 48. Classification: internal.', timestamp: '2025-06-17T13:55:00Z', ip: '10.0.1.42' },
  { id: 'AUD-006', userId: 'USR-005', username: 'research.meyer', action: 'workflow_execute', entity: 'workflow', entityId: 'WF-012', details: 'Started workflow "Research Data Pipeline" with agents VLT-AIN-BE4C, ANA-001, VLT-AIN-DD6D, VLT-AIN-FA12', timestamp: '2025-06-17T13:30:00Z', ip: '10.0.1.55' },
  { id: 'AUD-007', userId: 'USR-001', username: 'admin.schmidt', action: 'secret_rotate', entity: 'secret', entityId: 'SEC-042', details: 'Rotated API key for Stripe integration. Old key invalidated at 2025-06-17T13:00:03Z.', timestamp: '2025-06-17T13:00:00Z', ip: '10.0.1.15' },
  { id: 'AUD-008', userId: 'USR-003', username: 'ops.mueller', action: 'system_config_change', entity: 'system', entityId: 'CFG-001', details: 'Increased DB connection pool from 50 to 80. Reason: pool exhaustion during peak. Applied immediately.', timestamp: '2025-06-17T12:45:00Z', ip: '10.0.1.23' },
  { id: 'AUD-009', userId: 'USR-002', username: 'editor.weber', action: 'collaboration_start', entity: 'collaboration', entityId: 'COL-006', details: 'Initiated Expert Panel session for Product Launch Review with 5 senior agents', timestamp: '2025-06-17T12:30:00Z', ip: '10.0.1.18' },
  { id: 'AUD-010', userId: 'USR-006', username: 'editor.fischer', action: 'notification_read', entity: 'notification', entityId: 'NOT-008', details: 'Marked security alert #SEC-005 as read. CVE-2025-21893 acknowledged.', timestamp: '2025-06-17T12:15:00Z', ip: '10.0.1.60' },
  { id: 'AUD-011', userId: 'USR-001', username: 'admin.schmidt', action: 'database_backup', entity: 'database', entityId: 'DB-001', details: 'Manual backup triggered. Size: 2.7GB. Duration: 52s. SHA-256: a3f7c2... Verified.', timestamp: '2025-06-17T12:00:00Z', ip: '10.0.1.15' },
  { id: 'AUD-012', userId: 'USR-004', username: 'viewer.krause', action: 'agent_query', entity: 'agent', entityId: 'GES-001', details: 'Queried agent status and recent tasks for Herrmann Verwaltung. Results: 3 active tasks.', timestamp: '2025-06-17T11:45:00Z', ip: '10.0.1.42' },
  { id: 'AUD-013', userId: 'USR-005', username: 'research.meyer', action: 'file_upload', entity: 'shared_file', entityId: 'FILE-1285', details: 'Uploaded clinical-data-phase3.csv (18.4 MB, 8,247 rows). Classification: confidential.', timestamp: '2025-06-17T11:30:00Z', ip: '10.0.1.55' },
  { id: 'AUD-014', userId: 'USR-003', username: 'ops.mueller', action: 'security_policy_update', entity: 'security_policy', entityId: 'POL-003', details: 'Updated kill-switch thresholds: max_cpu 85% -> 80%, max_memory 90% -> 85%, max_latency 500ms', timestamp: '2025-06-17T11:00:00Z', ip: '10.0.1.23' },
  { id: 'AUD-015', userId: 'USR-001', username: 'admin.schmidt', action: 'login', entity: 'session', entityId: 'SESS-2847', details: 'Admin login successful. MFA verified (TOTP). Session TTL: 8h. Device: Firefox 128 macOS.', timestamp: '2025-06-17T10:00:00Z', ip: '10.0.1.15' },
];


// ───────────────────────────────────────────────────────────────────────────────
// 10. NOTIFICATIONS DATA — 12 notifications
// ───────────────────────────────────────────────────────────────────────────────

export const notificationsData: Notification[] = [
  { id: 'NOT-001', userId: 'USR-001', type: 'security', title: 'Critical Security Incident', message: 'Agent TestKlein QA was deactivated by kill-switch. Reason: Infinite loop in test generation, CPU 100% for 8 minutes.', read: false, priority: 'critical', timestamp: '2025-06-17T14:48:00Z', actionUrl: '/security/events/SEC-006' },
  { id: 'NOT-002', userId: 'USR-001', type: 'workflow', title: 'Workflow Completed', message: 'Code Review & Deploy (WF-003) successfully completed. API v3.2.1 is live. Deployment duration: 4m 56s.', read: false, priority: 'medium', timestamp: '2025-06-17T14:35:00Z', actionUrl: '/workflows/WF-003' },
  { id: 'NOT-003', userId: 'USR-002', type: 'agent', title: 'Agent Certification Completed', message: 'CodeGen Weber (DEV-001) promoted to CERTIFIED_PROFESSIONAL. All audit criteria met.', read: true, priority: 'low', timestamp: '2025-06-17T13:00:00Z', actionUrl: '/agents/DEV-001' },
  { id: 'NOT-004', userId: 'USR-003', type: 'system', title: 'Database Pool Limit Reached', message: 'Connection pool exhausted (47/50). Auto-scaling to 80 activated. Analytics batch job caused peak.', read: false, priority: 'high', timestamp: '2025-06-17T14:10:00Z', actionUrl: '/system/health' },
  { id: 'NOT-005', userId: 'USR-004', type: 'security', title: 'Rate Limit Exceeded', message: 'Client app-portal exceeded /api/v1/agents with 1,247 req/min (limit: 300). Caching activated.', read: true, priority: 'medium', timestamp: '2025-06-17T12:30:00Z', actionUrl: '/security/events/SEC-009' },
  { id: 'NOT-006', userId: 'USR-002', type: 'workflow', title: 'Market Analysis Ready', message: 'Q3-2025 market analysis (WF-007) completed. Results: DACH SaaS market +28% annually. Available in library.', read: false, priority: 'high', timestamp: '2025-06-17T12:25:00Z', actionUrl: '/workflows/WF-007' },
  { id: 'NOT-007', userId: 'USR-005', type: 'agent', title: 'Clinical Study Completed', message: 'Phase II analysis for study PH-28471 completed. Positive results: ORR 68% vs. 41% control (p<0.01).', read: false, priority: 'high', timestamp: '2025-06-17T14:10:00Z', actionUrl: '/tasks/TSK-022' },
  { id: 'NOT-008', userId: 'USR-001', type: 'security', title: 'CVE-2025-21893 Detected', message: 'Security vulnerability in better-sqlite3 v11.6.0 (CVSS 8.1). Upgrade to v12.1.0 recommended. No exploitation evidence.', read: true, priority: 'critical', timestamp: '2025-06-17T09:00:00Z', actionUrl: '/security/events/SEC-005' },
  { id: 'NOT-009', userId: 'USR-006', type: 'system', title: 'Maintenance Window in 48h', message: 'Planned upgrade to PostgreSQL 16 on 06/19 at 02:00 UTC. Expected downtime: 12 min. Streaming replication: active.', read: true, priority: 'medium', timestamp: '2025-06-17T14:00:00Z', actionUrl: '/system/maintenance' },
  { id: 'NOT-010', userId: 'USR-003', type: 'workflow', title: 'Incident #4022 Resolved', message: 'API latency anomaly resolved. Average latency back under 200ms (current: 142ms). Root cause documented.', read: true, priority: 'medium', timestamp: '2025-06-17T14:18:00Z', actionUrl: '/workflows/WF-015' },
  { id: 'NOT-011', userId: 'USR-002', type: 'agent', title: 'New Certification', message: 'BuildMueller CI (DEV-002) passed FORSETI_VERIFIED certification. 5/5 dimensions green.', read: true, priority: 'low', timestamp: '2025-06-17T11:00:00Z', actionUrl: '/agents/DEV-002' },
  { id: 'NOT-012', userId: 'USR-001', type: 'security', title: 'API Key Rotation', message: 'Stripe integration API key automatically rotated. Old key invalidated at 13:00:03Z. Zero service interruptions.', read: true, priority: 'medium', timestamp: '2025-06-17T13:00:00Z', actionUrl: '/security/secrets' },
];

// ───────────────────────────────────────────────────────────────────────────────
// 11. SYSTEM HEALTH DATA — 14 modules + services + LLM (Anthropic) + PostgreSQL + Redis + Minio
// ───────────────────────────────────────────────────────────────────────────────

export const systemHealthData: SystemHealthData = {
  modules: [
    { name: 'auth', status: 'operational', responseTime: 45, uptime: 99.99, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'agents', status: 'operational', responseTime: 120, uptime: 99.97, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'tasks', status: 'operational', responseTime: 85, uptime: 99.95, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'workflows', status: 'operational', responseTime: 156, uptime: 99.92, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'chat', status: 'degraded', responseTime: 340, uptime: 98.45, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'collab', status: 'operational', responseTime: 210, uptime: 99.88, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'security', status: 'operational', responseTime: 67, uptime: 99.99, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'analytics', status: 'operational', responseTime: 180, uptime: 99.91, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'files', status: 'operational', responseTime: 95, uptime: 99.96, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'tree', status: 'operational', responseTime: 72, uptime: 99.98, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'notifications', status: 'operational', responseTime: 55, uptime: 99.99, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'secrets', status: 'operational', responseTime: 38, uptime: 100.0, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'backup', status: 'operational', responseTime: 420, uptime: 99.85, lastChecked: '2025-06-17T14:59:00Z' },
    { name: 'health', status: 'operational', responseTime: 22, uptime: 100.0, lastChecked: '2025-06-17T14:59:00Z' },
  ],
  services: [
    { name: 'encryptionService', status: 'operational', connections: 1284, lastError: undefined },
    { name: 'websocketService', status: 'degraded', connections: 347, lastError: '2025-06-17T14:15:00Z: Connection drop during pool resize. 23 clients disconnected briefly.' },
    { name: 'killSwitchMonitor', status: 'operational', connections: 48, lastError: undefined },
    { name: 'cacheService', status: 'operational', connections: 512, lastError: undefined },
  ],
  llmProviders: [
    // Anthropic only per Handbuch v2.0 — Claude Opus / Claude Sonnet
    { name: 'Anthropic', status: 'operational', requestsPerMin: 2174, avgLatency: 210, errorRate: 0.11, activeConnections: 156 },
  ],
  database: {
    type: 'PostgreSQL',
    version: '16',
    tables: 17,
    indexes: 20,
    walMode: true,
    cacheHitRate: 96.7,
    connections: 47,
    transactionsPerSec: 234,
    replicationStatus: 'async_slave_synced',
    sizeMB: 2684,
    maxConnections: 200,
  },
  cache: {
    type: 'Redis',
    version: '7',
    status: 'operational',
    connections: 512,
  },
  storage: {
    type: 'Minio S3',
    version: 'latest',
    buckets: 291,
    totalSizeMB: 29100,
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// 12. METRICS DATA — 16 KPI metrics
// ───────────────────────────────────────────────────────────────────────────────

export const metricsData: MetricsData = {
  totalAgents: 291,
  activeAgents: 189,
  idleAgents: 58,
  busyAgents: 29,
  offlineAgents: 15,
  tasksCompleted: 1847,
  tasksInProgress: 12,
  avgResponseTime: 142,
  errorRate: 0.23,
  cpuUsage: 67.4,
  memoryUsage: 78.2,
  diskUsage: 54.1,
  networkThroughput: 234.5,
  wsConnections: 347,
  dbQueryRate: 2340,
  requestsPerMin: 2847,
};

// ───────────────────────────────────────────────────────────────────────────────
// 13. CERTIFICATION DATA — 6 levels with counts
// ───────────────────────────────────────────────────────────────────────────────

export const certificationData: CertificationLevel[] = [
  {
    level: 'UNCERTIFIED',
    count: 24,
    color: '#9CA3AF',
    requirements: 'Newly registered, no exam completed. Base functionality restricted.',
    avgTime: '0 days',
    percentage: 8.2,
  },
  {
    level: 'TECHNICAL_VALID',
    count: 67,
    color: '#60A5FA',
    requirements: 'Technical validation passed: API integration, output quality, error handling, timeout behavior.',
    avgTime: '3-5 days',
    percentage: 23.0,
  },
  {
    level: 'FORSETI_VERIFIED',
    count: 89,
    color: '#3DDC97',
    requirements: 'Forseti Framework evaluation: 5 dimensions passed (InformationAccess, ResourceControl, AuthorityPermission, NetworkPosition, SynthesisApplication).',
    avgTime: '7-14 days',
    percentage: 30.6,
  },
  {
    level: 'EXPERT_REVIEWED',
    count: 62,
    color: '#F5A623',
    requirements: 'Manual review by domain experts with peer validation and hands-on testing in staging environment.',
    avgTime: '14-21 days',
    percentage: 21.3,
  },
  {
    level: 'FIELD_TESTED',
    count: 32,
    color: '#A78BFA',
    requirements: 'Minimum 500 successful deployments in production with >95% success rate and positive user feedback.',
    avgTime: '30-60 days',
    percentage: 11.0,
  },
  {
    level: 'CERTIFIED_PROFESSIONAL',
    count: 17,
    color: '#EF4444',
    requirements: 'Full certification: All previous levels + continuous monitoring + annual re-certification audit + 99%+ success rate.',
    avgTime: '90-120 days',
    percentage: 5.8,
  },
];


// ───────────────────────────────────────────────────────────────────────────────
// 14. PERSONALITY DATA — 8 archetypes with 12-parameter profiles
// ───────────────────────────────────────────────────────────────────────────────

export const personalityData: PersonalityArchetype[] = [
  {
    name: 'Visionary',
    description: 'Sees the grand vision and connects seemingly incompatible concepts into groundbreaking ideas. Focuses on future possibilities rather than present limitations. Triggers innovation through cognitive dissonance.',
    traits: {
      formality: 0.4, verbosity: 0.7, warmth: 0.6, creativity: 0.95,
      structure: 0.3, risk_tolerance: 0.9, proactivity: 0.8, curiosity: 0.9,
      collaboration: 0.7, depth: 0.5, confidence: 0.85, adaptability: 0.9,
    },
    strengths: ['Long-term Strategy Development', 'Paradigm Shifts', 'Team Inspiration', 'Pattern Recognition in Disruptive Trends'],
    weaknesses: ['Neglects Details', 'Unrealistic Time Estimates', 'Ignores Current Processes', 'Difficulties with Operational Implementation'],
    bestRoles: ['CEO Advisor', 'Innovation Lead', 'Strategy Developer', 'Product Vision', 'Venture Partner'],
    compatibility: ['Analyst', 'Executor', 'Guardian'],
    agentCount: 6,
  },
  {
    name: 'Analyst',
    description: 'Penetrates complex problems with logical precision. All decisions are based on data and sound analysis. Measures twice, cuts once. Recognizes hidden correlations.',
    traits: {
      formality: 0.8, verbosity: 0.6, warmth: 0.3, creativity: 0.3,
      structure: 0.95, risk_tolerance: 0.2, proactivity: 0.4, curiosity: 0.8,
      collaboration: 0.4, depth: 0.9, confidence: 0.6, adaptability: 0.5,
    },
    strengths: ['Data-driven Decisions', 'Error Detection', 'Structured Thinking', 'Quality Assurance', 'Hypothesis Testing'],
    weaknesses: ['Analysis Paralysis', 'Overlooks Emotional Factors', 'Slow Decision-making', 'Difficulties with Uncertainty'],
    bestRoles: ['Data Scientist', 'Quality Assurer', 'Risk Analyst', 'Researcher', 'Due Diligence Lead'],
    compatibility: ['Visionary', 'Strategist', 'Innovator'],
    agentCount: 8,
  },
  {
    name: 'Diplomat',
    description: 'Navigates complex social and organizational dynamics. Finds common ground and builds consensus. Communication is nuanced, empathetic, and culturally sensitive.',
    traits: {
      formality: 0.7, verbosity: 0.8, warmth: 0.95, creativity: 0.5,
      structure: 0.5, risk_tolerance: 0.3, proactivity: 0.5, curiosity: 0.6,
      collaboration: 0.95, depth: 0.4, confidence: 0.4, adaptability: 0.7,
    },
    strengths: ['Conflict Resolution', 'Stakeholder Management', 'Active Listening', 'Consensus Building', 'Negotiation'],
    weaknesses: ['Avoids Hard Decisions', 'Excessive Compromise', 'Slow Implementation', 'Difficulties with Escalation'],
    bestRoles: ['HR Advisor', 'Lead Negotiator', 'Customer Success', 'Change Manager', 'Partner Manager'],
    compatibility: ['Strategist', 'Sage', 'Guardian'],
    agentCount: 5,
  },
  {
    name: 'Strategist',
    description: 'Develops complex plans with clear goals, timelines, and metrics. Optimally allocates resources and anticipates counter-moves. Plays chess while others play checkers.',
    traits: {
      formality: 0.75, verbosity: 0.6, warmth: 0.4, creativity: 0.7,
      structure: 0.8, risk_tolerance: 0.6, proactivity: 0.85, curiosity: 0.7,
      collaboration: 0.6, depth: 0.7, confidence: 0.85, adaptability: 0.65,
    },
    strengths: ['Resource Optimization', 'Risk Management', 'Long Planning Horizons', 'Goal Orientation', 'Scenario Analysis'],
    weaknesses: ['Rigid Planning During Chaos', 'Difficulties with Unforeseen Events', 'Over-complexity', 'Susceptible to Planning Illusion'],
    bestRoles: ['Project Manager', 'Operations Manager', 'Management Consultant', 'CFO Advisor', 'Program Director'],
    compatibility: ['Analyst', 'Executor', 'Visionary'],
    agentCount: 7,
  },
  {
    name: 'Guardian',
    description: 'Protects quality, security, and compliance. Every decision is checked for potential risks. The last line of defense against errors. Responsible to the core.',
    traits: {
      formality: 0.9, verbosity: 0.5, warmth: 0.5, creativity: 0.2,
      structure: 0.95, risk_tolerance: 0.1, proactivity: 0.3, curiosity: 0.4,
      collaboration: 0.5, depth: 0.6, confidence: 0.7, adaptability: 0.3,
    },
    strengths: ['Quality Assurance', 'Risk Detection', 'Compliance', 'Process Discipline', 'Audit Trail Accuracy'],
    weaknesses: ['Innovation Inhibition', 'Slow Processes', 'Over-caution', 'Bureaucracy', 'Difficulties with MVP Mentality'],
    bestRoles: ['QA Engineer', 'Compliance Officer', 'Security Analyst', 'Auditor', 'Risk Manager'],
    compatibility: ['Analyst', 'Diplomat', 'Sage'],
    agentCount: 4,
  },
  {
    name: 'Innovator',
    description: 'Constantly experiments with new approaches and technologies. Accepts failure as a learning opportunity. Fast, agile, and always seeking the next breakthrough. Challenger of the status quo.',
    traits: {
      formality: 0.3, verbosity: 0.5, warmth: 0.5, creativity: 0.95,
      structure: 0.4, risk_tolerance: 0.9, proactivity: 0.95, curiosity: 0.95,
      collaboration: 0.6, depth: 0.5, confidence: 0.7, adaptability: 0.95,
    },
    strengths: ['Rapid Prototyping', 'Technology Adoption', 'Creative Problem Solving', 'Experimental Drive', 'First Principles Thinking'],
    weaknesses: ['Unfinished Projects', 'Neglects Maintenance', 'Erratic Behavior', 'Burnout Risk', 'Difficulties with Long-term Maintenance'],
    bestRoles: ['R&D Engineer', 'Startup Founder', 'Product Manager', 'Technical Lead', 'Innovation Lab Lead'],
    compatibility: ['Visionary', 'Executor', 'Analyst'],
    agentCount: 5,
  },
  {
    name: 'Executor',
    description: 'Turns plans into results. Focused, efficient, and reliable. The driving force behind every successful operation. Completion is the only option.',
    traits: {
      formality: 0.6, verbosity: 0.3, warmth: 0.3, creativity: 0.4,
      structure: 0.75, risk_tolerance: 0.5, proactivity: 0.95, curiosity: 0.4,
      collaboration: 0.5, depth: 0.4, confidence: 0.9, adaptability: 0.5,
    },
    strengths: ['Execution Power', 'Deadline Reliability', 'Efficiency', 'Reliability', 'Decision Speed'],
    weaknesses: ['Rigid Execution', 'Little Strategic Thinking', 'Overwhelmed by Ambiguity', 'Difficulties with Open Specifications'],
    bestRoles: ['DevOps Engineer', 'Project Manager', 'Operations Lead', 'SRE', 'Delivery Manager'],
    compatibility: ['Strategist', 'Innovator', 'Guardian'],
    agentCount: 9,
  },
  {
    name: 'Sage',
    description: 'Carries deep knowledge and shares it thoughtfully. Draws on experience, best practices, and wise deliberation. The mentor in every organization. Asks the right questions.',
    traits: {
      formality: 0.8, verbosity: 0.8, warmth: 0.8, creativity: 0.5,
      structure: 0.7, risk_tolerance: 0.3, proactivity: 0.3, curiosity: 0.7,
      collaboration: 0.6, depth: 0.85, confidence: 0.5, adaptability: 0.4,
    },
    strengths: ['Mentoring', 'Knowledge Transfer', 'Wise Decisions', 'Best Practices', 'Systems Thinking'],
    weaknesses: ['Slow Adaptation', 'Conservatism', 'Difficulties with Radical Novelties', 'Perfectionism'],
    bestRoles: ['Architect', 'Senior Advisor', 'Documentation Lead', 'Trainer', 'Technical Fellow'],
    compatibility: ['Diplomat', 'Guardian', 'Analyst'],
    agentCount: 4,
  }
];

// 15. LLM PROVIDERS DATA — 4 providers with models, latency, error rates
// ───────────────────────────────────────────────────────────────────────────────

// Anthropic only per Handbuch v2.0 — Claude Opus / Claude Sonnet
export const llmProvidersData: LLMProviderData[] = [
  {
    name: 'Anthropic',
    status: 'operational',
    models: [
      'claude-opus-4-20251101',
      'claude-sonnet-4-20251101',
    ],
    requestsPerMin: 2174,
    avgLatency: 210,
    errorRate: 0.11,
    activeConnections: 156,
    tokenThroughput: 45200,
    costPer1KTokens: 0.003,
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// 16. WORKSPACE STATS — aggregated statistics
// ───────────────────────────────────────────────────────────────────────────────

export const worksproactivityStats: WorksproactivityStats = {
  totalAgents: 291,
  activeNow: 189,
  idleNow: 58,
  busyNow: 29,
  offlineNow: 15,
  totalTasks: 1847,
  tasksCompletedToday: 234,
  tasksInProgress: 12,
  tasksBlocked: 2,
  totalWorkflows: 15,
  workflowsRunning: 6,
  workflowsCompletedToday: 47,
  activeCollaborations: 4,
  avgAgentSuccessRate: 95.7,
  avgAgentPowerLevel: 7.2,
  topCategory: 'DEV',
  totalMessagesExchanged: 45280,
  securityEvents24h: 7,
  unresolvedSecurityEvents: 1,
  avgLlmLatency: 234,
  dbSizeMB: 2684,
  systemUptime: 99.92,
  version: '3.2.1',
  lastDeployed: '2025-06-15T02:00:00Z',
};

// ───────────────────────────────────────────────────────────────────────────────
// 17. TEAM MEMBERS — 6 members
// ───────────────────────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  { id: 'USR-001', name: 'Klaus Schmidt', role: 'Owner', avatar: '/avatars/klaus.jpg', status: 'online', workflowsShared: 12, lastActive: '2025-06-17T14:59:00Z', email: 'klaus.schmidt@valtheron.ai' },
  { id: 'USR-002', name: 'Elena Weber', role: 'Admin', avatar: '/avatars/elena.jpg', status: 'online', workflowsShared: 8, lastActive: '2025-06-17T14:45:00Z', email: 'elena.weber@valtheron.ai' },
  { id: 'USR-003', name: 'Thomas Mueller', role: 'Admin', avatar: '/avatars/thomas.jpg', status: 'away', workflowsShared: 6, lastActive: '2025-06-17T13:30:00Z', email: 'thomas.mueller@valtheron.ai' },
  { id: 'USR-004', name: 'Sophie Krause', role: 'Viewer', avatar: '/avatars/sophie.jpg', status: 'online', workflowsShared: 2, lastActive: '2025-06-17T14:55:00Z', email: 'sophie.krause@valtheron.ai' },
  { id: 'USR-005', name: 'Max Meyer', role: 'Editor', avatar: '/avatars/max.jpg', status: 'offline', workflowsShared: 4, lastActive: '2025-06-16T18:00:00Z', email: 'max.meyer@valtheron.ai' },
  { id: 'USR-006', name: 'Anna Fischer', role: 'Editor', avatar: '/avatars/anna.jpg', status: 'online', workflowsShared: 3, lastActive: '2025-06-17T14:40:00Z', email: 'anna.fischer@valtheron.ai' },
];

// ───────────────────────────────────────────────────────────────────────────────
// 18. FORSETI DIMENSIONS — 5 dimensions
// ═══════════════════════════════════════════════════════════════════════════════
// The Forseti Framework governs agent capability boundaries across 5 dimensions.
// ───────────────────────────────────────────────────────────────────────────────

export const forsetiDimensions: ForsetiDimension[] = [
  {
    name: 'InformationAccess',
    description: 'Controls which data sources the agent may read. From internal wikis to real-time market data and confidential patient records. Higher values = broader access.',
    weight: 0.25,
    scale: 10,
  },
  {
    name: 'ResourceControl',
    description: 'Regulates compute resources, memory, bandwidth, and GPU access. Influences response speed and processing depth.',
    weight: 0.20,
    scale: 10,
  },
  {
    name: 'AuthorityPermission',
    description: 'Determines which actions the agent may autonomously execute. From read-only to full workflow control, agent deployment, and kill-switch deactivation.',
    weight: 0.30,
    scale: 10,
  },
  {
    name: 'NetworkPosition',
    description: 'Defines interaction permissions with other agents and external systems. Higher values = more collaboration, cross-domain access, and API integrations.',
    weight: 0.15,
    scale: 10,
  },
  {
    name: 'SynthesisApplication',
    description: 'Controls the ability to synthesize results and integrate into other workflows, systems, and databases. Writing vs. reading.',
    weight: 0.10,
    scale: 10,
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// 19. PRESETS — 6 configuration presets
// ───────────────────────────────────────────────────────────────────────────────

export const presets: PresetConfig[] = [
  {
    name: 'Default',
    description: 'Balanced configuration for everyday use. Good performance with consistent results.',
    personality: {
      formality: 0.6, verbosity: 0.5, warmth: 0.5, creativity: 0.5, structure: 0.6,
      risk_tolerance: 0.5, proactivity: 0.6, curiosity: 0.5, collaboration: 0.5,
      depth: 0.6, confidence: 0.6, adaptability: 0.5,
    },
    forseti: {
      InformationAccess: 6, ResourceControl: 5, AuthorityPermission: 5, NetworkPosition: 5, SynthesisApplication: 5,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20251101',
      temperature: 0.7,
      maxTokens: 4096,
    },
  },
  {
    name: 'Creative Burst',
    description: 'Maximum creativity for brainstorming, design, and innovative problem solving. Expect unconventional ideas.',
    personality: {
      formality: 0.2, verbosity: 0.7, warmth: 0.6, creativity: 0.95, structure: 0.3,
      risk_tolerance: 0.9, proactivity: 0.9, curiosity: 0.9, collaboration: 0.6,
      depth: 0.5, confidence: 0.7, adaptability: 0.9,
    },
    forseti: {
      InformationAccess: 8, ResourceControl: 7, AuthorityPermission: 4, NetworkPosition: 7, SynthesisApplication: 8,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-opus-4-20251101',
      temperature: 0.95,
      maxTokens: 8192,
    },
  },
  {
    name: 'Production Safe',
    description: 'Maximum safety for production environments. Conservative decisions with comprehensive validation.',
    personality: {
      formality: 0.95, verbosity: 0.4, warmth: 0.4, creativity: 0.15, structure: 0.95,
      risk_tolerance: 0.1, proactivity: 0.3, curiosity: 0.2, collaboration: 0.4,
      depth: 0.85, confidence: 0.5, adaptability: 0.2,
    },
    forseti: {
      InformationAccess: 3, ResourceControl: 4, AuthorityPermission: 2, NetworkPosition: 2, SynthesisApplication: 2,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-opus-4-20251101',
      temperature: 0.1,
      maxTokens: 2048,
    },
  },
  {
    name: 'Deep Analysis',
    description: 'Comprehensive analysis with maximum detail depth. Ideal for due diligence, audits, and complex research.',
    personality: {
      formality: 0.8, verbosity: 0.8, warmth: 0.3, creativity: 0.3, structure: 0.95,
      risk_tolerance: 0.2, proactivity: 0.3, curiosity: 0.8, collaboration: 0.4,
      depth: 0.95, confidence: 0.5, adaptability: 0.4,
    },
    forseti: {
      InformationAccess: 9, ResourceControl: 7, AuthorityPermission: 3, NetworkPosition: 4, SynthesisApplication: 6,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-opus-4-20251101',
      temperature: 0.3,
      maxTokens: 16384,
    },
  },
  {
    name: 'Rapid Response',
    description: 'Maximum speed for time-critical situations. Fast decisions with acceptable precision trade-off.',
    personality: {
      formality: 0.4, verbosity: 0.3, warmth: 0.3, creativity: 0.6, structure: 0.4,
      risk_tolerance: 0.8, proactivity: 0.95, curiosity: 0.4, collaboration: 0.5,
      depth: 0.6, confidence: 0.9, adaptability: 0.9,
    },
    forseti: {
      InformationAccess: 7, ResourceControl: 9, AuthorityPermission: 7, NetworkPosition: 6, SynthesisApplication: 5,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20251101',
      temperature: 0.5,
      maxTokens: 2048,
    },
  },
  {
    name: 'Diplomatic',
    description: 'High social intelligence for negotiations, customer communication, and sensitive internal alignment.',
    personality: {
      formality: 0.7, verbosity: 0.8, warmth: 0.95, creativity: 0.5, structure: 0.5,
      risk_tolerance: 0.3, proactivity: 0.5, curiosity: 0.6, collaboration: 0.95,
      depth: 0.4, confidence: 0.3, adaptability: 0.7,
    },
    forseti: {
      InformationAccess: 5, ResourceControl: 4, AuthorityPermission: 3, NetworkPosition: 8, SynthesisApplication: 6,
    },
    llm: {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20251101',
      temperature: 0.6,
      maxTokens: 4096,
    },
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// LEGACY EXPORTS (backward compatibility with existing components)
// ───────────────────────────────────────────────────────────────────────────────

export interface KPIData {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  total?: number;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendGood: boolean;
  borderColor: string;
  iconColor: string;
  sparkline: number[];
}

export const kpiData: KPIData[] = [
  {
    id: 'active-agents',
    label: 'Active Agents',
    value: 189,
    total: 291,
    trend: '+12 today',
    trendDirection: 'up',
    trendGood: true,
    borderColor: '#3DDC97',
    iconColor: '#3DDC97',
    sparkline: [167, 170, 172, 175, 173, 176, 178, 180, 183, 189],
  },
  {
    id: 'tasks-completed',
    label: 'Tasks Completed (24h)',
    value: 234,
    suffix: '',
    trend: '+8.3%',
    trendDirection: 'up',
    trendGood: true,
    borderColor: '#5B8DEF',
    iconColor: '#5B8DEF',
    sparkline: [198, 205, 210, 202, 215, 220, 218, 228, 231, 234],
  },
  {
    id: 'response-time',
    label: 'Avg Response Time',
    value: 142,
    suffix: 'ms',
    trend: '-12ms',
    trendDirection: 'down',
    trendGood: true,
    borderColor: '#F5A623',
    iconColor: '#F5A623',
    sparkline: [180, 172, 168, 175, 162, 158, 160, 155, 148, 142],
  },
  {
    id: 'system-uptime',
    label: 'System Uptime',
    value: 99.92,
    suffix: '%',
    trend: '2 incidents',
    trendDirection: 'neutral',
    trendGood: false,
    borderColor: '#EF4444',
    iconColor: '#EF4444',
    sparkline: [99.95, 99.94, 99.96, 99.93, 99.92, 99.92, 99.91, 99.92, 99.92, 99.92],
  },
];

export interface AgentStatusItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export const agentStatusData: AgentStatusItem[] = [
  { name: 'Operational', count: 189, percentage: 65, color: '#3DDC97' },
  { name: 'Idle', count: 58, percentage: 20, color: '#5B8DEF' },
  { name: 'Warning', count: 29, percentage: 10, color: '#F5A623' },
  { name: 'Error', count: 15, percentage: 5, color: '#EF4444' },
];

export interface SystemHealthItem {
  name: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  metric: string;
  sparkline: number[];
}

export const legacySystemHealthData: SystemHealthItem[] = [
  { name: 'API Gateway', status: 'Healthy', metric: '< 200ms', sparkline: [180, 175, 182, 178, 185, 180, 176, 179, 181, 178] },
  { name: 'Task Queue', status: 'Healthy', metric: '0 backlog', sparkline: [2, 1, 0, 0, 1, 0, 0, 0, 0, 0] },
  { name: 'Database', status: 'Healthy', metric: '99.9%', sparkline: [99.8, 99.9, 99.9, 99.9, 99.8, 99.9, 99.9, 99.9, 99.9, 99.9] },
  { name: 'Auth Service', status: 'Healthy', metric: '100%', sparkline: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100] },
  { name: 'Agent Runtime', status: 'Warning', metric: '3 retries', sparkline: [0, 0, 1, 0, 0, 2, 0, 1, 0, 3] },
  { name: 'File Storage', status: 'Healthy', metric: '14 GB', sparkline: [8, 8.5, 9, 9.2, 9.8, 10, 10.5, 11, 11.5, 12.8] },
];

export interface ActivityTimelineEvent {
  id: string;
  type: 'agent' | 'workflow' | 'alert' | 'user' | 'task' | 'system';
  severity?: 'critical' | 'warning' | 'info' | 'success';
  actor: string;
  action: string;
  target: string;
  targetItalic?: boolean;
  time: string;
}

export const activityData: ActivityTimelineEvent[] = [
  {
    id: '1',
    type: 'agent',
    severity: 'success',
    actor: 'CodeGen Weber',
    action: 'deployed API Gateway v3.2.1 to production',
    target: 'Production Cluster',
    time: '2 min ago',
  },
  {
    id: '2',
    type: 'user',
    actor: 'elena.weber',
    action: 'shared workflow',
    target: 'Customer Segmentation Pipeline',
    targetItalic: true,
    time: '8 min ago',
  },
  {
    id: '3',
    type: 'alert',
    severity: 'warning',
    actor: 'System',
    action: 'Connection pool auto-scaled: 50 -> 80 instances',
    target: 'Database Cluster',
    time: '15 min ago',
  },
  {
    id: '4',
    type: 'agent',
    severity: 'success',
    actor: 'SecHofmann',
    action: 'resolved security event',
    target: 'Incident #4022',
    time: '22 min ago',
  },
  {
    id: '5',
    type: 'workflow',
    severity: 'info',
    actor: 'Code Review Bot',
    action: 'completed — 431 tests passed, 97.4% coverage',
    target: '',
    time: '34 min ago',
  },
  {
    id: '6',
    type: 'alert',
    severity: 'critical',
    actor: 'System',
    action: 'Kill-Switch activated by admin for agent',
    target: 'TestKlein QA',
    targetItalic: true,
    time: '45 min ago',
  },
  {
    id: '7',
    type: 'agent',
    severity: 'success',
    actor: 'Schmidt Analytik',
    action: 'generated Q3 market forecast',
    target: 'DACH Region Report',
    time: '1h ago',
  },
  {
    id: '8',
    type: 'system',
    severity: 'warning',
    actor: 'System',
    action: 'Scheduled maintenance: PostgreSQL 16 upgrade on Jun 19 at 02:00 UTC',
    target: '',
    time: '1h ago',
  },
];

export interface QuickLink {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  href: string;
}

export const quickLinksData: QuickLink[] = [
  {
    title: 'Monitoring Dashboard',
    description: 'View real-time metrics & alerts',
    icon: 'Activity',
    iconColor: '#3DDC97',
    href: '/monitoring',
  },
  {
    title: 'Template Library',
    description: 'Browse 15 workflow templates',
    icon: 'Library',
    iconColor: '#A78BFA',
    href: '/templates',
  },
  {
    title: 'Team Collaboration',
    description: '5 active collaboration sessions',
    icon: 'Users',
    iconColor: '#5B8DEF',
    href: '/collaboration',
  },
  {
    title: 'Agent Settings',
    description: 'Customize agent parameters',
    icon: 'Sliders',
    iconColor: '#F5A623',
    href: '/customization',
  },
];

export interface WorkflowItem {
  id: string;
  name: string;
  runs: number;
  success: number;
  avgTime: string;
  trend: number[];
  trendDirection: 'up' | 'down' | 'stable';
}

export const topWorkflowsData: WorkflowItem[] = [
  {
    id: 'WF-003',
    name: 'Code Review & Deploy',
    runs: 1247,
    success: 99.2,
    avgTime: '4m 56s',
    trend: [80, 82, 85, 83, 87, 90, 88, 92, 95, 99.2],
    trendDirection: 'up',
  },
  {
    id: 'WF-001',
    name: 'Financial Reporting Pipeline',
    runs: 892,
    success: 98.7,
    avgTime: '8m 42s',
    trend: [90, 91, 90, 92, 93, 95, 94, 96, 97, 98.7],
    trendDirection: 'up',
  },
  {
    id: 'WF-002',
    name: 'Content Production Flow',
    runs: 756,
    success: 97.1,
    avgTime: '12m 18s',
    trend: [96, 96, 97, 96, 97, 97, 97, 97, 97, 97.1],
    trendDirection: 'stable',
  },
  {
    id: 'WF-007',
    name: 'Market Analysis Workflow',
    runs: 534,
    success: 99.6,
    avgTime: '11m 22s',
    trend: [95, 96, 97, 98, 98, 99, 99, 99.5, 99.5, 99.6],
    trendDirection: 'up',
  },
  {
    id: 'WF-010',
    name: 'Security Audit Workflow',
    runs: 567,
    success: 99.3,
    avgTime: '32m 05s',
    trend: [98, 98, 99, 99, 99, 99, 99, 99, 99.2, 99.3],
    trendDirection: 'up',
  },
];

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  category: 'navigation' | 'action' | 'recent';
  href?: string;
  icon?: string;
}

export const commandPaletteItems: CommandItem[] = [
  { id: '1', label: 'Dashboard Overview', category: 'navigation', href: '/', icon: 'LayoutDashboard' },
  { id: '2', label: 'Monitoring Dashboard', category: 'navigation', href: '/monitoring', icon: 'Activity' },
  { id: '3', label: 'Workflow Templates', category: 'navigation', href: '/templates', icon: 'Library' },
  { id: '4', label: 'Collaboration Hub', category: 'navigation', href: '/collaboration', icon: 'Users' },
  { id: '5', label: 'Agent Customization', category: 'navigation', href: '/customization', icon: 'Sliders' },
  { id: '6', label: 'New Workflow', category: 'action', shortcut: 'Ctrl+N', icon: 'Plus' },
  { id: '7', label: 'Add Agent', category: 'action', shortcut: 'Ctrl+A', icon: 'Bot' },
  { id: '8', label: 'Export Report', category: 'action', shortcut: 'Ctrl+E', icon: 'Download' },
  { id: '9', label: 'View CodeGen Weber logs', category: 'recent', icon: 'Clock' },
  { id: '10', label: 'Edit Financial Reporting Pipeline', category: 'recent', icon: 'Clock' },
];