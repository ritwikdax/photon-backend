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

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect().then((res) => {
  console.log("🎉 Redis DB Connected!");
});
export { redisClient };
