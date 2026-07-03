# ── Stage 1: Dashboard bauen (React/Vite → statische Dateien) ──
FROM node:22-slim AS frontend
WORKDIR /app/dashboard
COPY dashboard/package.json dashboard/package-lock.json ./
RUN npm ci
COPY dashboard/ ./
RUN npm run build          # erzeugt dashboard/dist

# ── Stage 2: Laufzeit (Backend + ausgeliefertes Frontend) ──
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app/server

# better-sqlite3 bringt Prebuilds mit; python/make/g++ nur als Fallback.
COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server/ ./
# Gebautes Frontend an den Ort kopieren, den der Server erwartet.
COPY --from=frontend /app/dashboard/dist /app/dashboard/dist

# SQLite-Daten auf ein Volume legen, damit sie Neustarts überleben.
ENV DATA_DIR=/data
VOLUME /data

EXPOSE 3001
# Seed ist idempotent (INSERT OR REPLACE) — füllt die 291 Agenten bei jedem Start.
CMD ["sh", "-c", "npm run seed && npm start"]
