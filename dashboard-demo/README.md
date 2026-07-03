# Valtheron Dashboard Demo

Interaktive Demo des **Valtheron Agentic Workspace** Dashboards (erstellt mit Kimi AI).

- **Live-Demo:** https://jykrnxqosk3oq.kimi.page/#/
- **Quellcode:** [`../dashboard/`](../dashboard/) — vollständiges React/Vite-Projekt (editierbar)
- **Offline-Kopie:** dieses Verzeichnis enthält den vollständigen Build der Demo und läuft ohne Internetverbindung.

![Dashboard Overview](screenshots/dashboard-overview.png)

## Lokal starten

Die Demo ist eine statische Single-Page-App (React + Vite Build). Sie braucht nur einen einfachen Webserver:

```bash
cd dashboard-demo
python3 -m http.server 8080
# oder: npx serve .
```

Dann im Browser öffnen: <http://localhost:8080/#/>

> Hinweis: Direktes Öffnen der `index.html` per Doppelklick funktioniert nicht,
> da der Browser die JS-Module nur über HTTP lädt.

## Seiten der Demo

| Route | Inhalt |
|---|---|
| `#/` | Dashboard Overview – Kennzahlen (Active Agents, Tasks, Response Time, Uptime), Agent Status, System Health Map, Recent Activity, Top Workflows |
| `#/monitoring` | Echtzeit-Monitoring mit Metriken und Alerts |
| `#/agents` | Agenten-Katalog mit den Personas aus allen Kategorien (AI-Native, Developers, Teachers, FinTech, Marketers, Writers, Analysts, Hybrid, Meta, Human-Centric, E-Commerce, Entertainers, Data-Specialist, …) |
| `#/templates` | Workflow-Template-Bibliothek |
| `#/collaboration` | Team-Kollaboration und aktive Sessions |
| `#/customization` | Agent-Einstellungen und Anpassung |
| `#/guides` | Guides und Dokumentation |
| `#/operations` | Operations-Ansicht |
| `#/security` | Security-Übersicht (inkl. Kill-Switch) |
| `#/api-docs` | API-Dokumentation |
| `#/database` | Datenbank-Ansicht |
| `#/orchestrator` | Agent-Orchestrator |
| `#/deployment` | Deployment-Ansicht |

## Bezug zur Dokumentation in diesem Repository

Die Demo visualisiert die Konzepte aus dem „Kochbuch“ dieses Repos:

- [`guides/AGENTIC_WORKSPACE_KONZEPT.md`](../guides/AGENTIC_WORKSPACE_KONZEPT.md) – Gesamtkonzept des Workspace
- [`guides/PERSONAS_ANALYSE_UND_EMPFEHLUNGEN.md`](../guides/PERSONAS_ANALYSE_UND_EMPFEHLUNGEN.md) – die Agenten-Personas aus dem Agents-Katalog
- [`guides/MASTER_ANLEITUNG.md`](../guides/MASTER_ANLEITUNG.md) und [`guides/Valtheron_Handbuch_v2.pdf`](../guides/Valtheron_Handbuch_v2.pdf) – Handbuch
- [`architecture/agent-orchestrator.md`](../architecture/agent-orchestrator.md) – Orchestrator-Architektur
- [`architecture/security-model.md`](../architecture/security-model.md) – Security-Modell (Kill-Switch etc.)
- [`api/express-endpoints.md`](../api/express-endpoints.md) – API-Endpunkte
- [`deployment/kubernetes-helm.md`](../deployment/kubernetes-helm.md) – Deployment

## Technischer Hinweis

Dieses Verzeichnis enthält den **kompilierten Produktions-Build** (minifiziertes
JavaScript/CSS). Der vollständige Quellcode liegt in [`../dashboard/`](../dashboard/)
und erzeugt mit `npm run build` exakt diese Assets (identische Chunk-Hashes).
Für Weiterentwicklung dort arbeiten; dieser Build dient als Referenz und Vorschau.
