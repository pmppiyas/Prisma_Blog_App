import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  CD: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
}

const loadEnvVars = (): EnvConfig => {
  const reqEnvVars: string[] = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "CLOUD_NAME",
    "API_KEY",
    "API_SECRET",
  ];

  reqEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    CD: {
      CLOUD_NAME: process.env.CLOUD_NAME as string,
      API_KEY: process.env.API_KEY as string,
      API_SECRET: process.env.API_SECRET as string,
    },
  };
};

export const envVars = loadEnvVars();
