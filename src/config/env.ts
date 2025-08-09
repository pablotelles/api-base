import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string(),
  MONGO_URI: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_API_BASE: z.string().optional(),
  JWT_SECRET: z.string().min(16, 'JWT secret must be at least 16 characters long'),
});

export type ENV = z.infer<typeof envSchema>;

const parseEnv: ENV = envSchema.parse(process.env);

export function getEnv(value: keyof ENV): string {
  return parseEnv[value]!;
}

export function isDevelopment(): boolean {
  return getEnv('NODE_ENV') === 'development';
}
export function isProduction(): boolean {
  return getEnv('NODE_ENV') === 'production';
}
