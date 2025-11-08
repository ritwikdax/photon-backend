export const ENV_VARIABLES = {
  GCP_SERVICE_ACCOUNT_B64: "GCP_SERVICE_ACCOUNT_B64",
  REDIS_DB_PASSWORD: "REDIS_DB_PASSWORD",
  REDIS_DB_USERNAME: "REDIS_DB_USERNAME",
  REDIS_DB_HOST: "REDIS_DB_HOST",
  MONGO_DB_NAME: "MONGO_DB_NAME",
  MONGO_USERNAME: "MONGO_USERNAME",
  MONGO_PASSWORD: "MONGO_PASSWORD",
  JWT_SECRET: "JWT_SECRET",
  PHOTON_TRACKING_APP_BASE_URL: "PHOTON_TRACKING_APP_BASE_URL",
  PHOTON_SELECT_APP_BASE_URL: "PHOTON_SELECT_APP_BASE_URL",
} as const;

export function env(variableName: keyof typeof ENV_VARIABLES) {
  const value = process.env[`${variableName}`];
  if (!value) {
    throw new Error("Environment Variable Missing!!");
  }
  return value;
}
