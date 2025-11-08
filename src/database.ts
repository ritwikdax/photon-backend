import { MongoClient, Db, ServerApiVersion } from "mongodb";
import { env, ENV_VARIABLES } from "./utils/env.js";
const MONGO_USERNAME = env(ENV_VARIABLES.MONGO_USERNAME);
const MONGO_PASSWORD = env(ENV_VARIABLES.MONGO_PASSWORD);
const MONGO_DB_NAME = env(ENV_VARIABLES.MONGO_DB_NAME);

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.9bqgxk7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbCache: Record<string, ReturnType<MongoClient["db"]>> = {};

let db: Db;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
client
  .connect()
  .then(() => {
    console.log(`✅ Connected Mongo Client`);
    db = client.db(MONGO_DB_NAME);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log(err);
  });

async function getDb(merchantId: string) {
  if (!dbCache[merchantId]) {
    dbCache[merchantId] = client.db(`merchantDb_${merchantId}`);
  }
  return dbCache[merchantId];
}

export { getDb, db };
