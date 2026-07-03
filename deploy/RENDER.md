# Live gehen mit Render + valtheron.online

Diese Anleitung bringt das komplette System (Dashboard + Backend + Agenten)
öffentlich auf **valtheron.online**. Klick-basiert, kein Server zu warten.
Alles im Repo ist vorbereitet — du füllst nur noch Formulare aus.

**Was du brauchst:** ein Render-Konto (render.com), deinen Anthropic-API-Key,
und Zugang zum DNS deiner Domains (dort, wo du sie gekauft hast).

---

## Schritt 1 — Service aus dem Blueprint anlegen

1. Auf [render.com](https://render.com) mit GitHub anmelden.
2. **New → Blueprint** wählen und dieses Repository verbinden.
3. Render liest die [`render.yaml`](../render.yaml) und schlägt den Service
   **valtheron** vor (Region Frankfurt, Docker, Health-Check `/api/health`,
   1 GB Datenträger für die Datenbank). Mit **Apply** bestätigen.

## Schritt 2 — Secrets eintragen

Render fragt beim ersten Deploy nach den als `sync: false` markierten Werten.
Im Service unter **Environment**:

| Variable | Wert |
|---|---|
| `ANTHROPIC_API_KEY` | dein Key (`sk-ant-…`) |
| `ADMIN_PASSWORD` | ein sicheres Startpasswort für `admin@valtheron.ai` |

`JWT_SECRET` wird von Render automatisch erzeugt — nichts zu tun.
Die Werte liegen verschlüsselt bei Render; **keine `.env`-Datei mehr nötig**.

Nach dem Speichern baut Render das Docker-Image und startet den Service.
Du bekommst zunächst eine Adresse wie `valtheron.onrender.com` — dort sollte
das Dashboard bereits laden und die Console nach Login echte Agenten ausführen.

## Schritt 3 — Domain verbinden

Im Render-Service unter **Settings → Custom Domains**:

1. `valtheron.online` und `www.valtheron.online` hinzufügen.
2. Render zeigt dir die einzutragenden DNS-Records an. Beim Anbieter deiner
   Domain im DNS setzen (Werte, die Render anzeigt, haben Vorrang — die hier
   sind das übliche Muster):

   | Name/Host | Typ | Wert |
   |---|---|---|
   | `@` (Root) | `A` | die von Render angezeigte IP (oder `ALIAS`/`ANAME` auf `valtheron.onrender.com`, falls dein Anbieter das unterstützt) |
   | `www` | `CNAME` | `valtheron.onrender.com` |

3. Render stellt das HTTPS-Zertifikat automatisch aus (Let's Encrypt), sobald
   die DNS-Einträge greifen (kann bis zu ~1 h dauern).

> **Hinweis Root-Domain:** Manche Anbieter erlauben kein `CNAME` auf `@`.
> Dann entweder Renders angezeigte `A`-IP nutzen, oder `ALIAS`/`ANAME`
> (z. B. bei Cloudflare, Namecheap „ALIAS"). Render dokumentiert beides im
> Custom-Domain-Dialog.

## Schritt 4 — Die anderen Domains als Weiterleitung

Empfehlung aus unserem Gespräch: **valtheron.online** ist die Hauptadresse,
die übrigen leiten dorthin um.

- `valtheron.de`, `agentworkspace.online`, `valtheron.info` → per **301-Redirect**
  auf `https://valtheron.online`. Das geht meist direkt beim Domain-Anbieter
  („Weiterleitung"/„Redirect"), ohne eigenen Server.
- `agenticworkspacegenius.sbs` → für eine spätere Kampagne/Landingpage
  aufheben, oder ebenfalls weiterleiten.

---

## Danach

1. `https://valtheron.online` öffnen → Dashboard lädt.
2. **Console** → Login mit `admin@valtheron.ai` + deinem `ADMIN_PASSWORD`.
3. **MFA aktivieren** (Authenticator-App) — ab dann ist der Zugang
   zwei-Faktor-geschützt, auch der Kill-Switch verlangt dann einen Code.
4. Ab jetzt deployt **jeder Merge in den Default-Branch automatisch** neu
   (`autoDeploy: true`) — dasselbe Muster wie bei GitHub Pages, nur mit
   echtem Backend.

## Kosten (Richtwerte)

- Render **Starter** Web-Service: ~7 $/Monat (läuft durchgehend).
- 1 GB Datenträger: im Starter meist enthalten bzw. wenige Cent.
- Anthropic-API: nutzungsabhängig pro ausgeführtem Agenten-Task.
- Zum reinen Ausprobieren gibt es einen **Free**-Tarif — der schläft bei
  Inaktivität ein (erster Aufruf dauert dann ~30 s) und die SQLite-Daten
  können dabei zurückgesetzt werden. Für „echt live" den Starter nehmen.

## Verhältnis zur GitHub-Pages-Demo

Die bestehende Pages-Seite
(`valtheron.github.io/Valtheron_valtheron-agentic-workspace`) bleibt als
schnelle **Offline-Vorschau** (Mock-Daten, kein Login) bestehen.
`valtheron.online` ist das **echte System** mit Backend. Beide stören sich
nicht; du kannst Pages später abschalten, wenn du nur noch die Domain willst.

## Datenbank-Ausbau (später)

SQLite reicht für Start und moderate Last. Für echten Hochlast-Mehrbenutzer-
betrieb bietet Render eine **verwaltete PostgreSQL**-Datenbank; der Umbau ist
in [`roadmap/v2-database-scaling.md`](../roadmap/v2-database-scaling.md)
beschrieben.
