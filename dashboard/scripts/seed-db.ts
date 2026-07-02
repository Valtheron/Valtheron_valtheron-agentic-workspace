import Database from 'better-sqlite3';
import * as path from 'node:path';
import * as fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

interface SeedResult {
  success: boolean;
  recordsInserted: number;
}

export function seedDatabase(): SeedResult {
  const dbUrl = process.env.DATABASE_URL || 'file:./data/valtheron_dev.db';
  const rawPath = dbUrl.replace('file:', '');
  const absolutePath = path.resolve(process.cwd(), rawPath);

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  const db = new Database(absolutePath, { verbose: console.log });

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');

  let recordsInserted = 0;

  const runTransaction = db.transaction(() => {
    // 1. Core Users Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        mfa_secret TEXT,
        mfa_enabled INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 2. Encrypted Agent Credentials Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS agent_credentials (
        id TEXT PRIMARY KEY,
        agent_name TEXT NOT NULL,
        encrypted_api_key TEXT NOT NULL,
        iv TEXT NOT NULL,
        auth_tag TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 3. Immutable Audit Log Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        payload TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Seed Initial Local Developer Account
    const userCheck = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get('dev@valtheron.local') as { count: number };
    
    if (userCheck.count === 0) {
      db.prepare(`
        INSERT INTO users (id, email, mfa_secret, mfa_enabled)
        VALUES (?, ?, ?, ?)
      `).run('usr_dev_01', 'dev@valtheron.local', 'USRLOCALMFASECRETKEY32CHARS', 0);
      recordsInserted++;

      db.prepare(`
        INSERT INTO audit_logs (id, actor, action, payload)
        VALUES (?, ?, ?, ?)
      `).run(
        'aud_init_01',
        'SYSTEM',
        'WORKSPACE_SEED',
        JSON.stringify({ message: 'Local development environment workspace seeded successfully.' })
      );
      recordsInserted++;
    }
  });

  try {
    runTransaction();
    db.close();
    return { success: true, recordsInserted };
  } catch (error) {
    console.error('Database seeding transaction failed:', error);
    db.close();
    throw error;
  }
}

if (require.main === module) {
  console.log('🗄️ Initializing SQLite database and executing seed scripts...');
  try {
    const result = seedDatabase();
    console.log(`✅ Seeding complete. Records inserted: ${result.recordsInserted}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed.');
    process.exit(1);
  }
}
