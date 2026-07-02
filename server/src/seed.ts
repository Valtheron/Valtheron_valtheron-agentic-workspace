// Seeds the SQLite database with the 291 agents from the dashboard's
// mock data (derived from Handbuch v2.0). Run via: npm run seed
import { db } from './db.js';
import { agentsData } from '../../dashboard/src/lib/mockData.js';

const insert = db.prepare(`
  INSERT OR REPLACE INTO agents (
    id, name, display_name, category, status, role,
    llm_provider, llm_model, llm_model_short, personality,
    certification_level, power_level, tasks_completed, success_rate,
    last_active, description, tags
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedAll = db.transaction(() => {
  for (const a of agentsData) {
    insert.run(
      a.id, a.name, a.display_name, a.category, a.status, a.role,
      a.llmProvider, a.llmModel, a.llmModelShort, a.personality,
      a.certificationLevel, a.powerLevel, a.tasksCompleted, a.successRate,
      a.lastActive, a.description, JSON.stringify(a.tags),
    );
  }
});

seedAll();
const count = db.prepare('SELECT COUNT(*) AS n FROM agents').get() as { n: number };
console.log(`Seeded ${count.n} agents into the database.`);
