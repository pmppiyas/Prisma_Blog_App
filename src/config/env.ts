import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  DB_URL: string;
}

const loadEnvVars = (): EnvConfig => {
  const reqEnvVars: string[] = ["PORT", "NODE_ENV", "DB_URL"];

  reqEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVars();
