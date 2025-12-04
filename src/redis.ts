import { createClient } from "redis";
import { env, ENV_VARIABLES } from "./utils/env.js";

const redisClient = createClient({
  username: env(ENV_VARIABLES.REDIS_DB_USERNAME),
  password: env(ENV_VARIABLES.REDIS_DB_PASSWORD),
  socket: {
    host: env(ENV_VARIABLES.REDIS_DB_HOST),
    port: 10012,
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", {
    error: err,
    message: err?.message,
    stack: err?.stack,
    host: env(ENV_VARIABLES.REDIS_DB_HOST),
  });
});

redisClient.on("connect", () => {
  console.log("🔄 Redis client connecting...");
});

redisClient.on("ready", () => {
  console.log("🎉 Redis DB Connected and Ready!");
});

redisClient
  .connect()
  .then(() => {
    console.log("✅ Redis connection established");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to Redis:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      host: env(ENV_VARIABLES.REDIS_DB_HOST),
    });
  });
export { redisClient };
