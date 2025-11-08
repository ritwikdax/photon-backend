import { Request, Response } from "express";
import { getDb } from "../database.js";
import { buildProjection, buildQuery } from "../utils.js";
import { Sort, SortDirection } from "mongodb";
import { v4 } from "uuid";

const DEFAULT_LIMIT = 1000;

export async function crud(req: Request, res: Response) {
  const { collection: collectionName } = req.params;

  const db = await getDb(res.locals["merchantId"]);
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

        if (req.body["startDateTime"] && req.body["endDateTime"]) {
          doc["startDateTime"] = new Date(req.body["startDateTime"]);
          doc["endDateTime"] = new Date(req.body["endDateTime"]);
        }

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

        if (req.body["startDateTime"] && req.body["endDateTime"]) {
          updateData["startDateTime"] = new Date(req.body["startDateTime"]);
          updateData["endDateTime"] = new Date(req.body["endDateTime"]);
        }

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
}
