import { Buffer } from 'node:buffer';
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
