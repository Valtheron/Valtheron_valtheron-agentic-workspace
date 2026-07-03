import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? path.join(here, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'valtheron.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id                  TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    display_name        TEXT NOT NULL,
    category            TEXT NOT NULL,
    status              TEXT NOT NULL,
    role                TEXT NOT NULL,
    llm_provider        TEXT NOT NULL,
    llm_model           TEXT NOT NULL,
    llm_model_short     TEXT NOT NULL,
    personality         TEXT NOT NULL,
    certification_level TEXT NOT NULL,
    power_level         INTEGER NOT NULL,
    tasks_completed     INTEGER NOT NULL,
    success_rate        REAL NOT NULL,
    last_active         TEXT NOT NULL,
    description         TEXT NOT NULL,
    tags                TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id            TEXT PRIMARY KEY,
    agent_id      TEXT NOT NULL REFERENCES agents(id),
    prompt        TEXT NOT NULL,
    result        TEXT,
    status        TEXT NOT NULL DEFAULT 'running',
    model         TEXT,
    input_tokens  INTEGER,
    output_tokens INTEGER,
    error         TEXT,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    finished_at   TEXT
  );
`);
