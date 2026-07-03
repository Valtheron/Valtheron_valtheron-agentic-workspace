# Deployment — Valtheron live auf einer eigenen Domain

Ein **einziger Container** liefert Frontend, Backend und die SQLite-Datenbank
zusammen aus. Frontend und API teilen sich damit eine Domain — keine CORS- oder
URL-Konfiguration nötig. Kein Kubernetes erforderlich.

```
        deine-domain.tld
              │  HTTPS
        ┌─────▼───────────────────────┐
        │  Valtheron-Container         │
        │  ├─ GET /            → Dashboard (React-Build)
        │  ├─ GET /api/*       → Backend (Express + Agenten)
        │  └─ /data/valtheron.db (SQLite, auf Volume)
        └──────────────────────────────┘
```

## Voraussetzungen

- Ein **Anthropic API-Key** (die Agenten laufen echt).
- Ein **Hosting-Ziel** (siehe unten) und eine deiner Domains.
- Secrets werden als **Umgebungsvariablen** gesetzt, **nie** committed:
  | Variable | Zweck |
  |---|---|
  | `ANTHROPIC_API_KEY` | Pflicht — Agenten-Ausführung |
  | `JWT_SECRET` | Pflicht — langer Zufallswert, signiert die Login-Tokens |
  | `ADMIN_PASSWORD` | Startpasswort des Admins (`admin@valtheron.ai`) |
  | `ANTHROPIC_MODEL` | optional — erzwingt ein Modell |

---

## Variante A — Eigener Server / VPS (Docker Compose)

Am einfachsten, wenn du einen kleinen Linux-Server hast (Hetzner, DigitalOcean,
IONOS …). Ab ~4–5 €/Monat.

```bash
# auf dem Server:
git clone <dieses-repo> valtheron && cd valtheron
cp .env.example .env        # ANTHROPIC_API_KEY, JWT_SECRET, ADMIN_PASSWORD ausfüllen
docker compose up -d --build
# → läuft auf Port 3001
```

Danach einen Reverse-Proxy mit automatischem HTTPS davorsetzen (empfohlen:
[Caddy](https://caddyserver.com) — ein Zweizeiler kümmert sich um Let's-Encrypt-
Zertifikate):

```
# /etc/caddy/Caddyfile
deine-domain.tld {
    reverse_proxy localhost:3001
}
```

**DNS:** einen `A`-Record deiner Domain auf die IP des Servers zeigen lassen.

---

## Variante B — Managed Hosting (kein Server-Wartung)

Dienste, die direkt aus dem GitHub-Repo bauen und deployen. Am einfachsten,
wenn du keinen Server verwalten willst.

| Dienst | Eignung | Custom Domain |
|---|---|---|
| **Render** | erkennt den Dockerfile, Web-UI, günstiger Start-Tarif | ✅ inkl. HTTPS |
| **Railway** | sehr einfaches Setup, nutzungsbasiert | ✅ |
| **Fly.io** | global, günstig, braucht CLI | ✅ |

**➡️ Fertige Schritt-für-Schritt-Anleitung für Render + `valtheron.online`:
[`RENDER.md`](RENDER.md).** Das Repo enthält bereits ein
[`render.yaml`](../render.yaml)-Blueprint — Render richtet den Service damit
fast per Klick ein (Region Frankfurt, Docker, Health-Check, Datenträger für
die DB). Secrets trägst du in Renders verschlüsselte Environment-Maske ein,
Custom Domain + HTTPS laufen über die Weboberfläche.

---

## Domain-Einrichtung (allgemein)

Beim Anbieter deiner Domain (dort, wo du sie gekauft hast) im DNS setzen:

- **Root-Domain** (`valtheron.online`): `A`-Record → Server-IP
  (VPS), oder den vom Managed-Host vorgegebenen Wert.
- **Subdomain** (`app.valtheron.online`): `CNAME` → Zielhost.

HTTPS-Zertifikate übernehmen Caddy (VPS) bzw. der Managed-Host automatisch.

---

## Datenbank

SQLite reicht für Start und moderate Last und liegt im Container unter `/data`
(Volume). Für echten Mehrbenutzer-Hochlastbetrieb ist der nächste Schritt
PostgreSQL — Blueprint dafür: [`roadmap/v2-database-scaling.md`](../roadmap/v2-database-scaling.md).

## Nach dem Deploy

1. Domain im Browser öffnen → Dashboard lädt.
2. **Console** öffnen → mit `admin@valtheron.ai` + `ADMIN_PASSWORD` anmelden.
3. Passwort ändern bzw. MFA aktivieren, Agenten-Tasks laufen jetzt öffentlich.
