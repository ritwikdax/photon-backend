import { MongoClient, Db, ServerApiVersion } from "mongodb";

const MONGO_USERNAME = process.env.MONGO_USERNAME || "photon";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "MxCpYt84qtrVjf9T";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "crud";

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.9bqgxk7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = MONGO_DB_NAME;

let db: Db;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect once on startup
client
  .connect()
  .then((client) => {
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log(err);
  });

export { db };
