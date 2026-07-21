/**
 * Centralized Environment Configuration
 *
 * Single source of truth for all environment variables.
 * The application will fail at startup if any required variable is missing.
 * All modules must import from this file — never use process.env directly.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

function requireEnvInt(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (!raw) return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`[Config] Environment variable ${name} must be an integer, got: "${raw}"`);
  }
  return parsed;
}

// ─── Validate & Export ───────────────────────────────────────────────────────

export const env = {
  // ─── Application ───────────────────────────────────────────────────────────
  NODE_ENV: optionalEnv("NODE_ENV", "development"),
  PORT: requireEnvInt("PORT", 5000),

  // ─── Database ──────────────────────────────────────────────────────────────
  MONGO_URI: requireEnv("MONGO_URI"),

  // ─── JWT Authentication ────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: optionalEnv("JWT_ACCESS_EXPIRES_IN", "15m"),
  JWT_REFRESH_EXPIRES_IN: optionalEnv("JWT_REFRESH_EXPIRES_IN", "7d"),

  // ─── CORS & URLs ───────────────────────────────────────────────────────────
  FRONTEND_URL: optionalEnv("FRONTEND_URL", "http://localhost:3000"),
  SITE_URL: optionalEnv("SITE_URL", "http://localhost:3000"),

  // ─── Google OAuth ──────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID: optionalEnv("GOOGLE_CLIENT_ID", ""),

  // ─── Cloudinary (File Storage) ─────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),

  // ─── OpenRouter (AI / LLM) ────────────────────────────────────────────────
  OPENROUTER_API_KEY: optionalEnv("OPENROUTER_API_KEY", ""),

  // ─── Redis (BullMQ Job Queue) ─────────────────────────────────────────────
  REDIS_HOST: optionalEnv("REDIS_HOST", "127.0.0.1"),
  REDIS_PORT: requireEnvInt("REDIS_PORT", 6379),
  REDIS_PASSWORD: optionalEnv("REDIS_PASSWORD", ""),

  // ─── SMTP (Email) ──────────────────────────────────────────────────────────
  SMTP_HOST: optionalEnv("SMTP_HOST", ""),
  SMTP_PORT: requireEnvInt("SMTP_PORT", 587),
  SMTP_USER: optionalEnv("SMTP_USER", ""),
  SMTP_PASS: optionalEnv("SMTP_PASS", ""),
  SMTP_FROM: optionalEnv("SMTP_FROM", "DevCircle <noreply@devcircle.com>"),

  // ─── Rate Limiting ─────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: requireEnvInt("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  RATE_LIMIT_MAX: requireEnvInt("RATE_LIMIT_MAX", 100),
} as const;

// ─── Startup Warnings ─────────────────────────────────────────────────────────
if (env.JWT_ACCESS_SECRET.length < 32) {
  console.warn("[Config] ⚠️  JWT_ACCESS_SECRET is too short — use 32+ characters in production.");
}

if (env.JWT_REFRESH_SECRET.length < 32) {
  console.warn("[Config] ⚠️  JWT_REFRESH_SECRET is too short — use 32+ characters in production.");
}

if (!env.GOOGLE_CLIENT_ID) {
  console.warn("[Config] ℹ️  GOOGLE_CLIENT_ID is not set — Google OAuth will not function.");
}

if (!env.OPENROUTER_API_KEY) {
  console.warn("[Config] ℹ️  OPENROUTER_API_KEY is not set — AI features will not function.");
}

if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
  console.warn("[Config] ℹ️  SMTP credentials are not fully configured — emails will be mocked to console.");
}
