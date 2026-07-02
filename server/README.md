# Valtheron Server — Backend & Agent-Runtime

Das echte Backend hinter dem Dashboard: Express 5 + SQLite + Anthropic API.
Die 291 Agenten aus dem Handbuch v2.0 liegen in einer echten Datenbank, und
über die **Agent Console** im Dashboard (`#/console`) führen sie echte Tasks
über Claude aus — live gestreamt.

## Setup

```bash
cd server
npm install
cp .env.example .env      # ANTHROPIC_API_KEY eintragen
npm run seed              # Datenbank mit den 291 Agenten befüllen
npm start                 # → http://localhost:3001
```

Dann das Dashboard starten (`cd dashboard && npm run dev`) und im Browser
die Seite **Console** öffnen — der Badge oben rechts zeigt „Backend verbunden".

## API

| Endpoint | Beschreibung |
|---|---|
| `GET /api/health` | Liveness-Check |
| `GET /api/agents` | Alle 291 Agenten aus der Datenbank |
| `GET /api/metrics` | Agent- und Task-Statistiken (inkl. Token-Verbrauch) |
| `GET /api/tasks` | Die letzten 50 ausgeführten Tasks |
| `GET /api/tasks/:id` | Einzelner Task inkl. Ergebnis |
| `POST /api/tasks` | `{agentId, prompt}` → führt den Agenten aus; Antwort ist ein SSE-Stream (`start` / `delta` / `done` / `error`) |

## Wie ein Agent läuft

1. `POST /api/tasks` legt einen Task in SQLite an (Status `running`).
2. Aus dem Agenten-Datensatz (Name, Rolle, Kategorie, Archetyp, Beschreibung,
   Tags) wird ein System-Prompt gebaut — der Agent „ist" seine Persona.
3. Modell nach Handbuch v2.0: Opus-Kategorien → `claude-opus-4-8`,
   Sonnet-Kategorien → `claude-sonnet-5` (Override via `ANTHROPIC_MODEL`).
   Adaptive Thinking ist aktiviert.
4. Die Antwort wird tokenweise als Server-Sent Events an das Frontend
   gestreamt und am Ende mit Token-Verbrauch in der Datenbank gespeichert.
5. Bricht der Client ab, wird der Modell-Request abgebrochen (keine
   verwaisten Kosten).

## Umgebungsvariablen

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | API-Key — **niemals committen**, gehört in `.env` (gitignored) |
| `PORT` | — | Default `3001` |
| `ANTHROPIC_MODEL` | — | Erzwingt ein Modell für alle Agenten (z. B. Kostenkontrolle) |
| `DATA_DIR` | — | Ablageort der SQLite-DB (Default `server/data/`) |

Hinter einem Corporate-Proxy wird `HTTPS_PROXY` automatisch respektiert.

## Nächste Ausbaustufen (Roadmap)

- Auth (JWT + MFA) und Audit-Trail gemäß `architecture/security-model.md`
- Kill-Switch, der laufende Tasks serverseitig beendet
- Workflows (sequential / hierarchical / debate) gemäß
  `architecture/agent-orchestrator.md`
- Migration SQLite → PostgreSQL gemäß `roadmap/v2-database-scaling.md`
