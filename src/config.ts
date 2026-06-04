import { loadEnvFile } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  platform: string;
  dbURL: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    dbURL: envOrThrow("DB_URL"),
  } as APIConfig,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  } as DBConfig,
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export default config;
