# Valtheron Agentic Workspace — Dashboard (Quellcode)

Der vollständige, editierbare Quellcode des Valtheron-Dashboards
(ursprünglich mit Kimi AI erstellt, Live-Demo: https://jykrnxqosk3oq.kimi.page/#/).

**Tech-Stack:** React 19 · TypeScript · Vite 7 · Tailwind CSS 3 · shadcn/ui (Radix) · Recharts · Framer Motion · React Router 7

## Entwicklung

```bash
cd dashboard
npm install
npm run dev        # Dev-Server mit Hot Reload → http://localhost:5173
```

## Produktions-Build

```bash
npm run build      # TypeScript-Check + Vite-Build → dist/
npm run preview    # Build lokal testen → http://localhost:4173
```

Der Build erzeugt exakt die Assets der Live-Demo (identische Chunk-Hashes).
Eine fertig gebaute Offline-Kopie liegt in [`../dashboard-demo/`](../dashboard-demo/).

## Struktur

```
src/
├── components/        Layout (Sidebar, Topbar) + shadcn/ui-Komponenten
│   └── ui/            40+ shadcn/ui-Basiskomponenten
├── pages/             Die 13 Views: Home, Monitoring, Agents, Templates,
│                      Collaboration, Customization, Guides, Operations,
│                      Security, API, Database, Orchestrator, Deployment
├── hooks/             Custom Hooks
└── lib/
    ├── mockData.ts    Authentische Mock-Daten nach Handbuch v2.0
    │                  (291 Agenten, 16 Kategorien, 8 Archetypen,
    │                   12 Persönlichkeitsparameter, 6 Cert-Level)
    ├── templatesData.ts  Workflow-Templates
    └── utils.ts       Utilities (cn)
tests/                 Playwright-Tests (Doku-Validierung)
scripts/               seed-db.ts, validate-env.ts
```

## Datenquelle

Die Mock-Daten in `src/lib/mockData.ts` sind aus dem „Kochbuch" dieses Repos abgeleitet:

- [`guides/Valtheron_Handbuch_v2.pdf`](../guides/Valtheron_Handbuch_v2.pdf) — Handbuch v2.0 (primäre Quelle)
- [`guides/PERSONAS_ANALYSE_UND_EMPFEHLUNGEN.md`](../guides/PERSONAS_ANALYSE_UND_EMPFEHLUNGEN.md) — Agenten-Personas
- [`guides/AGENTIC_WORKSPACE_KONZEPT.md`](../guides/AGENTIC_WORKSPACE_KONZEPT.md) — Gesamtkonzept
- [`architecture/`](../architecture/) und [`api/`](../api/) — Architektur & API

## Tests

```bash
npx playwright test    # nutzt tests/*.spec.ts (Chromium erforderlich)
```

## Hinweis zur npm-Registry

Die `package-lock.json` wurde von der Kimi-internen npm-Mirror auf die
öffentliche Registry (`registry.npmjs.org`) umgestellt; die Integrity-Hashes
sind unverändert.
