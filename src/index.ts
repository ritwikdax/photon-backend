import express, { Request, Response } from "express";
import cors from "cors";
import {
  Sort,
  SortDirection,
} from "mongodb";
import { v4 } from "uuid";
import { buildProjection, buildQuery } from "./utils.js";
import { projectsByStatus } from "./analytics.pipelines.js";
import {db} from "./database.js";
import { addAuditLogs } from "./mw/auditLogs.middleware.js";
const DEFAULT_LIMIT = 1000;


const app = express();
app.use(cors());
app.use(express.json());
app.use(addAuditLogs);

 app.use("/analytics", (req: Request,res: Response)=>{
    if (!db) return res.status(503).json({ error: "Database not connected yet" });
  // return projectsByStatus pipeline result
  db.collection("projects")
    .aggregate(projectsByStatus)
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      res.status(500).json({ error: err.message });
    });
  

 }) 
app.use("/api/:collection", async (req: Request, res: Response) => {
  const { collection: collectionName } = req.params;
  if (!db) return res.status(503).json({ error: "Database not connected yet" });
  const collection = db.collection(collectionName);
  const now = new Date();

  try {
    switch (req.method) {
      case "POST": {
        const doc = {
          id: v4(),
          createdAt: now,
          updatedAt: now,
          ...req.body,
        };
        const result = await collection.insertOne(doc);
        return res.status(201).json({ insertedId: result.insertedId });
      }

      case "GET": {
        const filter = buildQuery(req.query as any);
        const projection = buildProjection(req.query.fields as any);
        const limit = Number(req.query.limit ?? DEFAULT_LIMIT);
        const sort: Sort = {
          createdAt: "desc" as SortDirection,
        };
        const skip = Number(req.query.skip ?? 0);

        const items = await collection
          .find(filter, {
            projection,
            limit,
            sort,
            skip,
          })
          .toArray();
        return res.json(items);
      }

      case "PUT": {
        const filter = buildQuery(req.query as any);
        if (Object.keys(filter).length === 0)
          return res.status(400).json({ error: "Provide filter via query" });
        const updateData = { ...req.body, updatedAt: now };
        const result = await collection.updateMany(filter, {
          $set: updateData,
        });
        console.log(result);
        return res.json({ modifiedCount: result.modifiedCount });
      }

      case "DELETE": {
        const filter = buildQuery(req.query as any);
        if (Object.keys(filter).length === 0)
          return res.status(400).json({ error: "Provide filter via query" });
        const result = await collection.deleteMany(filter);
        return res.json({ deletedCount: result.deletedCount });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("❌ Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
