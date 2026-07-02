import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateSecret, generateURI, verifySync } from 'otplib';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'valtheron-dev-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET nicht gesetzt — Dev-Secret aktiv. Für Produktion in .env setzen!');
}
const TOKEN_TTL = '12h';

export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  role: string;
  password_hash: string;
  mfa_secret: string | null;
  mfa_enabled: number;
}

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function logAudit(userEmail: string | null, action: string, detail: string, ip?: string): void {
  db.prepare('INSERT INTO audit_log (user_email, action, detail, ip) VALUES (?, ?, ?, ?)')
    .run(userEmail, action, detail, ip ?? null);
}

export function ensureAdminUser(): void {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@valtheron.ai');
  if (existing) return;
  const password = process.env.ADMIN_PASSWORD ?? 'valtheron2026';
  db.prepare('INSERT INTO users (id, email, display_name, role, password_hash) VALUES (?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), 'admin@valtheron.ai', 'Administrator', 'admin', bcrypt.hashSync(password, 10));
  console.log(`[auth] Admin angelegt: admin@valtheron.ai (Passwort: ${process.env.ADMIN_PASSWORD ? 'aus ADMIN_PASSWORD' : 'valtheron2026 — bitte ändern!'})`);
}

export function login(email: string, password: string, totpCode?: string):
  | { ok: true; token: string; user: { email: string; displayName: string; role: string; mfaEnabled: boolean } }
  | { ok: false; status: number; error: string } {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return { ok: false, status: 401, error: 'E-Mail oder Passwort falsch' };
  }
  if (user.mfa_enabled) {
    if (!totpCode) return { ok: false, status: 401, error: 'MFA-Code erforderlich' };
    if (!verifySync({ token: totpCode, secret: user.mfa_secret! }).valid) {
      return { ok: false, status: 401, error: 'MFA-Code ungültig' };
    }
  }
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return {
    ok: true,
    token,
    user: { email: user.email, displayName: user.display_name, role: user.role, mfaEnabled: !!user.mfa_enabled },
  };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Nicht angemeldet' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Token ungültig oder abgelaufen' });
  }
}

// MFA-Setup: Secret erzeugen (Schritt 1), mit erstem Code bestätigen (Schritt 2).
export function mfaEnroll(userId: string): { secret: string; otpauth: string } {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
  const secret = generateSecret();
  db.prepare('UPDATE users SET mfa_secret = ?, mfa_enabled = 0 WHERE id = ?').run(secret, userId);
  return { secret, otpauth: generateURI({ issuer: 'Valtheron Workspace', label: user.email, secret }) };
}

export function mfaVerify(userId: string, code: string): boolean {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
  if (!user.mfa_secret || !verifySync({ token: code, secret: user.mfa_secret }).valid) return false;
  db.prepare('UPDATE users SET mfa_enabled = 1 WHERE id = ?').run(userId);
  return true;
}

// Für sensible Operationen (Kill-Switch): wenn MFA aktiviert ist, Code verlangen.
export function verifySensitiveOp(userId: string, totpCode?: string): { ok: boolean; error?: string } {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
  if (!user.mfa_enabled) return { ok: true };
  if (!totpCode) return { ok: false, error: 'MFA-Code erforderlich für diese Operation' };
  if (!verifySync({ token: totpCode, secret: user.mfa_secret! }).valid) {
    return { ok: false, error: 'MFA-Code ungültig' };
  }
  return { ok: true };
}
