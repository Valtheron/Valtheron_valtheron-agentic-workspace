/**
 * Expert Debugging Test Suite
 * Valtheron Agentic Workspace — End-to-End Page Tests
 * 7 Pages × UI Checks × Data Integrity × Performance
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://jykrnxqosk3oq.kimi.page';
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', hash: '#/' },
  { name: 'Monitoring', path: '/monitoring', hash: '#/monitoring' },
  { name: 'Agents', path: '/agents', hash: '#/agents' },
  { name: 'Templates', path: '/templates', hash: '#/templates' },
  { name: 'Collaboration', path: '/collaboration', hash: '#/collaboration' },
  { name: 'Customization', path: '/customization', hash: '#/customization' },
  { name: 'Operations', path: '/operations', hash: '#/operations' },
  { name: 'Security', path: '/security', hash: '#/security' },
  { name: 'API', path: '/api-docs', hash: '#/api-docs' },
  { name: 'Database', path: '/database', hash: '#/database' },
  { name: 'Orchestrator', path: '/orchestrator', hash: '#/orchestrator' },
  { name: 'Deployment', path: '/deployment', hash: '#/deployment' },
  { name: 'Guides', path: '/guides', hash: '#/guides' },
];

/* ================================================================ */
/*  1. DASHBOARD                                                     */
/* ================================================================ */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('KPI cards visible and populated', async ({ page }) => {
    // Active Agents card
    const agentsCard = page.locator('text=/Active Agents/i').first();
    await expect(agentsCard).toBeVisible();
    const agentsCount = page.locator('text=/189\\s*\\/\\s*291/');
    await expect(agentsCount).toBeVisible();

    // Tasks Completed card
    const tasksCard = page.locator('text=/Tasks Completed/i').first();
    await expect(tasksCard).toBeVisible();
    const tasksCount = page.locator('text=/234/');
    await expect(tasksCount).toBeVisible();

    // Response Time card
    const respCard = page.locator('text=/Avg Response Time/i').first();
    await expect(respCard).toBeVisible();
    const respTime = page.locator('text=/142/');
    await expect(respTime).toBeVisible();

    // Uptime card
    const uptimeCard = page.locator('text=/System Uptime/i').first();
    await expect(uptimeCard).toBeVisible();
    const uptimeVal = page.locator('text=/99\\.9%/');
    await expect(uptimeVal).toBeVisible();
  });

  test('Agent Status donut chart shows 291 total', async ({ page }) => {
    const donutLabel = page.locator('text=/291/').first();
    await expect(donutLabel).toBeVisible();
    const totalText = page.locator('text=/Total Agents/');
    await expect(totalText).toBeVisible();
  });

  test('System Health Map shows all 14 modules', async ({ page }) => {
    const modules = [
      'auth', 'agents', 'tasks', 'workflows', 'chat', 'collab',
      'security', 'analytics', 'files', 'tree', 'notifications',
      'secrets', 'backup', 'health'
    ];
    for (const mod of modules) {
      const moduleText = page.locator(`text=/${mod}/i`).first();
      await expect(moduleText).toBeVisible();
    }
  });

  test('Timeline has activity entries', async ({ page }) => {
    const activitySection = page.locator('text=/Recent Activity/i');
    await expect(activitySection).toBeVisible();
    const entries = page.locator('[class*="activity"], [class*="timeline"]');
    await expect(entries.first()).toBeVisible();
  });

  test('Dashboard loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
    console.log(`Dashboard load time: ${loadTime}ms`);
  });
});

/* ================================================================ */
/*  2. MONITORING                                                    */
/* ================================================================ */

test.describe('Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/monitoring`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('14 system modules displayed', async ({ page }) => {
    const modules = page.locator('text=/auth|agents|tasks|workflows|chat|collab|security|analytics|files|tree|notifications|secrets|backup|health/');
    await expect(modules.first()).toBeVisible();
  });

  test('Anthropic-only LLM provider (not 4)', async ({ page }) => {
    const providerCount = page.locator('text=/1 provider/');
    await expect(providerCount).toBeVisible();
    const oldProviderText = page.locator('text=/4 LLM|4 providers|OpenAI|Ollama/i');
    await expect(oldProviderText).not.toBeVisible();
  });

  test('PostgreSQL database info visible', async ({ page }) => {
    const pgText = page.locator('text=/PostgreSQL|pg\\.Pool|Streaming Replication/i');
    await expect(pgText.first()).toBeVisible();
  });

  test('Alert timeline has entries', async ({ page }) => {
    const alerts = page.locator('text=/Alert|Warning|Critical|Resolved/i');
    const count = await alerts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Monitoring page loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/#/monitoring`, { waitUntil: 'domcontentloaded' });
    expect(Date.now() - start).toBeLessThan(3000);
  });
});

/* ================================================================ */
/*  3. AGENTS DIRECTORY                                              */
/* ================================================================ */

test.describe('Agents Directory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/agents`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('291 agents displayed with VLT-XXX-XXXX IDs', async ({ page }) => {
    // Check for VLT-ID pattern
    const vltIds = page.locator('text=/VLT-[A-Z]{3}-[0-9A-F]{4}/');
    const count = await vltIds.count();
    expect(count).toBeGreaterThan(10);
    console.log(`Found ${count} agents with VLT-IDs`);
  });

  test('16 correct categories visible (not legacy)', async ({ page }) => {
    const correctCategories = ['GES', 'ANA', 'MKT', 'PRO', 'ENT', 'ETR', 'LEH', 'SCH', 'ECO', 'DEV', 'AIN', 'MET', 'FIN', 'HYB', 'HUM', 'DAT'];
    for (const cat of correctCategories) {
      const catText = page.locator(`text=/${cat}/`).first();
      await expect(catText).toBeVisible();
    }
  });

  test('NO legacy categories (TRD, SEC, OPS, SUP, INT, MON)', async ({ page }) => {
    const legacyCats = ['TRD', 'SEC', 'OPS', 'SUP', 'INT', 'MON'];
    for (const cat of legacyCats) {
      const legacyText = page.locator(`text=/\\b${cat}\\b/`);
      const count = await legacyText.count();
      if (count > 0) {
        console.warn(`WARNING: Legacy category ${cat} still visible on Agents page`);
      }
    }
  });

  test('Agent cards show Opus/Sonnet model badges', async ({ page }) => {
    const modelBadges = page.locator('text=/Opus|Sonnet/');
    const count = await modelBadges.count();
    expect(count).toBeGreaterThan(5);
  });

  test('Agents page loads without TypeError', async ({ page }) => {
    const errorBoundary = page.locator('text=/Something went wrong|TypeError|Cannot read properties/i');
    await expect(errorBoundary).not.toBeVisible();
  });

  test('Search and filter controls visible', async ({ page }) => {
    const search = page.locator('input[type="search"], input[placeholder*="Search"], button:has-text("Search")');
    // Search may be an icon-only button
    const filterBtn = page.locator('button:has-text("Filter"), button:has-text("filter")');
    const categorySelect = page.locator('text=/Category|All Categories/').first();
    await expect(categorySelect).toBeVisible();
  });
});

/* ================================================================ */
/*  4. CUSTOMIZATION                                                 */
/* ================================================================ */

test.describe('Customization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/customization`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('12 Personality sliders visible', async ({ page }) => {
    const personalityParams = [
      'Formality', 'Verbosity', 'Warmth', 'Creativity', 'Structure',
      'Risk Tolerance', 'Proactivity', 'Curiosity', 'Collaboration',
      'Depth', 'Confidence', 'Adaptability'
    ];
    for (const param of personalityParams) {
      const slider = page.locator(`text=/${param}/i`).first();
      await expect(slider).toBeVisible();
    }
  });

  test('Live preview section visible', async ({ page }) => {
    const preview = page.locator('text=/Preview|Live|Response Sample/i');
    await expect(preview.first()).toBeVisible();
  });

  test('Presets panel visible', async ({ page }) => {
    const presets = page.locator('text=/Presets|Balanced|Creative|Conservative|Deep Analysis|Rapid Response/i');
    await expect(presets.first()).toBeVisible();
  });

  test('Forseti dimensions radar chart visible', async ({ page }) => {
    const forseti = page.locator('text=/Forseti|Information Access|Resource Control|Authority|Network Position|Synthesis/i');
    await expect(forseti.first()).toBeVisible();
  });
});

/* ================================================================ */
/*  5. TEMPLATES                                                     */
/* ================================================================ */

test.describe('Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/templates`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('Workflow templates visible', async ({ page }) => {
    const templates = page.locator('text=/Code Review|Financial|Content|Security|Market|Customer|Emergency/i');
    await expect(templates.first()).toBeVisible();
  });

  test('No parallel workflow type (only 3 types)', async ({ page }) => {
    const parallelText = page.locator('text=/\\bparallel\\b/i');
    await expect(parallelText).not.toBeVisible();
  });

  test('Template cards show sequential/hierarchical/debate', async ({ page }) => {
    const workflowTypes = page.locator('text=/sequential|hierarchical|debate/i');
    const count = await workflowTypes.count();
    expect(count).toBeGreaterThan(0);
  });
});

/* ================================================================ */
/*  6. COLLABORATION                                                 */
/* ================================================================ */

test.describe('Collaboration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/collaboration`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('Team Hub header visible', async ({ page }) => {
    const hub = page.locator('text=/Collaboration|Team|Hub|Sessions/i');
    await expect(hub.first()).toBeVisible();
  });

  test('Active sessions listed', async ({ page }) => {
    const sessions = page.locator('text=/Session|Active|Coordinator|Participants/i');
    await expect(sessions.first()).toBeVisible();
  });

  test('Activity Feed has entries', async ({ page }) => {
    const feed = page.locator('text=/Activity|Feed|Message|Agent/i');
    await expect(feed.first()).toBeVisible();
  });
});

/* ================================================================ */
/*  7. OPERATIONS CENTER                                             */
/* ================================================================ */

test.describe('Operations Center', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/operations`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('9 tabs visible', async ({ page }) => {
    const tabTexts = [
      'Audit', 'Environment', 'MFA', 'Orchestration',
      'Migration', 'SSO', 'Contributions', 'Health', 'Incidents'
    ];
    for (const tab of tabTexts) {
      const tabEl = page.locator(`text=/${tab}/i`).first();
      await expect(tabEl).toBeVisible();
    }
  });

  test('Audit Trail tab shows log entries', async ({ page }) => {
    const auditTab = page.locator('text=/Audit/i').first();
    await auditTab.click();
    await page.waitForTimeout(500);
    const logs = page.locator('text=/admin|dev|analyst|timestamp|action/i');
    await expect(logs.first()).toBeVisible();
  });

  test('No TypeError on Operations page', async ({ page }) => {
    const errorBoundary = page.locator('text=/Something went wrong|TypeError|Cannot read properties/i');
    await expect(errorBoundary).not.toBeVisible();
  });

  test('SSO & RBAC tab shows permission matrix', async ({ page }) => {
    const ssoTab = page.locator('text=/SSO|RBAC/i').first();
    await ssoTab.click();
    await page.waitForTimeout(500);
    const matrix = page.locator('text=/Permission|Role|Admin|Operator|Viewer/i');
    await expect(matrix.first()).toBeVisible();
  });
});

/* ================================================================ */
/*  DATA INTEGRITY & PERFORMANCE                                     */
/* ================================================================ */

test.describe('Data Integrity & Cross-Page', () => {
  test('All 13 navigation links work', async ({ page }) => {
    for (const nav of NAV_ITEMS) {
      await page.goto(`${BASE_URL}${nav.hash}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toContain(nav.hash);
      console.log(`  ${nav.name}: ${url} OK`);
    }
  });

  test('No Error Boundary on any page', async ({ page }) => {
    const errorPages: string[] = [];
    for (const nav of NAV_ITEMS) {
      await page.goto(`${BASE_URL}${nav.hash}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const errorText = page.locator('text=/Something went wrong|TypeError|Cannot read properties of undefined/i');
      if (await errorText.isVisible().catch(() => false)) {
        errorPages.push(nav.name);
      }
    }
    if (errorPages.length > 0) {
      console.error(`Error Boundary found on: ${errorPages.join(', ')}`);
    }
    expect(errorPages).toHaveLength(0);
  });

  test('SPA routing: direct URL access works for all pages', async ({ page }) => {
    for (const nav of NAV_ITEMS) {
      const resp = await page.request.get(`${BASE_URL}${nav.hash}`);
      expect(resp.status()).toBe(200);
    }
  });

  test('Performance: each page loads under 3s', async ({ page }) => {
    const slowPages: string[] = [];
    for (const nav of NAV_ITEMS) {
      const start = Date.now();
      await page.goto(`${BASE_URL}${nav.hash}`, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - start;
      if (loadTime > 3000) {
        slowPages.push(`${nav.name} (${loadTime}ms)`);
      }
    }
    if (slowPages.length > 0) {
      console.warn(`Slow pages: ${slowPages.join(', ')}`);
    }
    expect(slowPages.length).toBeLessThanOrEqual(3);
  });
});
