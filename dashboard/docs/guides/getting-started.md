# Getting Started with Valtheron Agentic Workspace

Welcome to the Valtheron Agentic Workspace. This guide will walk you through setting up your local development environment.

Valtheron is built on a highly secure, zero-trust local architecture utilizing **React 19**, **Express 5.1**, **TypeScript**, and **SQLite**. All sensitive data rests behind **AES-256-GCM** encryption, and every system interaction is captured by an immutable local audit trail.

---

## Prerequisites Checklist

Ensure your local machine meets the following baseline requirements:

- [ ] **Node.js**: `v20.11.0` (LTS) or higher (Recommended: `v21.x` / `v22.x`)
- [ ] **Package Manager**: `pnpm v9.x` or higher
- [ ] **Compiler**: `TypeScript v5.4` or higher
- [ ] **Database Engine**: SQLite 3 (Library bindings handled via `better-sqlite3`)
- [ ] **Development OS**: macOS Sonoma+, Linux (Ubuntu 22.04+), or Windows 11 (WSL2 recommended)

---

## Step 1: Clone and Install Dependencies

Clone the repository and install the monorepo dependencies using `pnpm`.

```bash
git clone https://github.com/Valtheron/valtheron-agentic-workspace.git
cd valtheron-agentic-workspace
pnpm install
```

---

## Step 2: Environment Configuration

Copy the environment template to create your local configuration.

```bash
cp .env.example .env
```

### Cryptographic Key Generation
Valtheron requires a cryptographically secure 256-bit (32-byte) key for **AES-256-GCM** encryption of agent credentials and workspace secrets.

Generate a compliant key using the following Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update your `.env` file with the generated key and configure your local SQLite database path:

```env
# System Configuration
NODE_ENV=development
PORT=8080
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=file:./data/valtheron_dev.db

# Cryptography (AES-256-GCM)
# Paste your generated 64-character hex key here:
ENCRYPTION_SECRET=9f8a2c3b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b

# MFA Configuration
MFA_ISSUER=ValtheronLocalDev
```

---

## Step 3: Environment Validation Script

To prevent runtime failures due to misconfigured environment variables or weak cryptographic keys, run our automated validation script.

Create or verify the existence of `scripts/validate-env.ts`:

```typescript
import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface ValidationResult {
  success: boolean;
  errors: string[];
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];

  // 1. Verify Database Directory exists or can be created
  const dbUrl = process.env.DATABASE_URL || 'file:./data/valtheron_dev.db';
  if (dbUrl.startsWith('file:')) {
    const relativePath = dbUrl.replace('file:', '');
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const dir = path.dirname(absolutePath);
    
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err: any) {
      errors.push(`Failed to create database directory at ${dir}: ${err.message}`);
    }
  }

  // 2. Validate AES-256-GCM Cryptographic Secret
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    errors.push('ENCRYPTION_SECRET is missing from the environment configuration.');
  } else {
    const hexRegex = /^[0-9a-fA-F]{64}$/;
    if (!hexRegex.test(secret)) {
      errors.push('ENCRYPTION_SECRET must be a 64-character hex-encoded string (32 bytes).');
    } else {
      try {
        const buffer = Buffer.from(secret, 'hex');
        if (buffer.length !== 32) {
          errors.push(`ENCRYPTION_SECRET key length is invalid. Expected 32 bytes, got ${buffer.length} bytes.`);
        }
      } catch {
        errors.push('ENCRYPTION_SECRET failed hex decoding validation.');
      }
    }
  }

  // 3. Validate Node Environment
  if (!process.env.NODE_ENV) {
    errors.push('NODE_ENV is not defined. Set it to "development" or "production".');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

// Execute validation when run directly
if (require.main === module) {
  console.log('🔍 Validating Valtheron environment configuration...');
  const result = validateEnvironment();
  if (result.success) {
    console.log('✅ Environment configuration is valid and secure.');
    process.exit(0);
  } else {
    console.error('❌ Environment validation failed:');
    result.errors.forEach((err) => console.error(`   - ${err}`));
    process.exit(1);
  }
}
```

Run the validation suite:

```bash
npx ts-node scripts/validate-env.ts
```

---

## Step 4: Database Initialization & Seeding

Valtheron uses SQLite in **Write-Ahead Logging (WAL)** mode to ensure high-performance concurrent reads and writes.

```bash
npx ts-node scripts/seed-db.ts
```

---

## Step 5: Express 5.1 Server Verification

Start the Express backend:

```bash
pnpm --filter api dev
```

---

## Step 6: React 19 Client Verification

Start the React frontend:

```bash
pnpm --filter client dev
```

---

## Troubleshooting

### SQLite Database Lock Errors (`SQLITE_BUSY`)
```bash
sqlite3 ./data/valtheron_dev.db "PRAGMA journal_mode;"
# Output must be: wal
```

### Invalid Hex Key Length
- Regenerate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Ensure no spaces or quotes in `.env` value
