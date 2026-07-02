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

## Anmeldung

Beim ersten Start wird ein Admin angelegt: `admin@valtheron.ai` (Passwort aus
`ADMIN_PASSWORD`, Default `valtheron2026`). In der **Console** im Dashboard
anmelden; das JWT liegt danach im Browser und wird an alle schreibenden
Endpunkte gehängt. Optional lässt sich **MFA (TOTP)** aktivieren
(`/api/auth/mfa/enroll` → QR/Secret in einer Authenticator-App → `/verify`);
danach verlangt sowohl der Login als auch der Kill-Switch einen 6-stelligen Code.

## API

| Endpoint | Auth | Beschreibung |
|---|---|---|
| `GET /api/health` | — | Liveness, Kill-Switch-Status, Anzahl laufender Tasks |
| `GET /api/agents` | — | Alle 291 Agenten aus der Datenbank |
| `GET /api/metrics` | — | Agent-, Task- und Workflow-Statistiken (inkl. Token-Verbrauch) |
| `POST /api/auth/login` | — | `{email, password, totp?}` → JWT |
| `GET /api/auth/me` | JWT | Aktueller Nutzer |
| `POST /api/auth/mfa/enroll` · `/verify` | JWT | MFA (TOTP) einrichten/bestätigen |
| `GET /api/audit` | JWT | Audit-Trail (letzte 100 Einträge) |
| `GET /api/tasks` · `/api/tasks/:id` | — | Ausgeführte Tasks |
| `POST /api/tasks` | JWT | `{agentId, prompt}` → Einzel-Agent, SSE-Stream |
| `GET /api/kill-switch` | — | Kill-Switch-Status |
| `POST /api/kill-switch` · `/reset` | JWT | Not-Aus aktivieren (beendet laufende Tasks, sperrt neue) / zurücksetzen |
| `GET /api/workflows` | — | Letzte Workflows inkl. Schritte |
| `POST /api/workflows` | JWT | `{type, task, agentIds[]}` → Multi-Agent-Workflow, SSE-Stream |

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

## Multi-Agent-Workflows (Schritt 5)

`POST /api/workflows` orchestriert 2–4 Agenten. Die Reihenfolge der `agentIds`
bestimmt die Rollen. Drei Typen gemäß `architecture/agent-orchestrator.md`:

- **sequential** — Pipeline: jeder Agent verbessert das Ergebnis des vorherigen.
- **hierarchical** — Agent 1 ist Koordinator (zerlegt den Auftrag in Teilaufgaben,
  die restlichen Agenten arbeiten sie ab), am Ende Synthese durch den Koordinator.
- **debate** — jeder Agent bezieht Position und repliziert auf die anderen,
  der letzte Agent moderiert das Fazit.

Jeder Schritt wird in `workflow_steps` persistiert und live per SSE gestreamt
(`workflow_start` / `step_start` / `delta` / `step_done` / `workflow_done`).
Der Kill-Switch beendet auch laufende Workflow-Schritte sofort.

## Nächste Ausbaustufen (Roadmap)

- Migration SQLite → PostgreSQL gemäß `roadmap/v2-database-scaling.md`
- Rollen/Rechte über den Admin hinaus (RBAC), Rate-Limiting
- Deployment nach `deployment/kubernetes-helm.md`
