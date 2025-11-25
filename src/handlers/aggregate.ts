import { Request, Response } from "express";
import { getDb } from "../database.js";

export async function aggregateHandler(req: Request, res: Response) {
  const { collection: collectionName } = req.params;
  try {
    const db = await getDb(res.locals["merchantID"]);
    if (!db)
      return res.status(503).json({ error: "Database not connected yet" });
    const collection = db.collection(collectionName);
    const pipeline = req.body.pipeline || [];

    // ⚠️ Optional: validate allowed operators
    const forbiddenOps = [
      "$out",
      "$merge",
      "$redact",
      "$function",
      "$accumulator",
      "$set",
    ];

    if (!Array.isArray(pipeline))
      return res.status(400).json({ error: "Pipeline must be an array" });

    if (!pipeline?.length) {
      return res
        .status(400)
        .json({ error: "Empty Pipeline, nothing to aggregate" });
    }

    const hasForbidden = pipeline.some((stage: any) =>
      Object.keys(stage).some((key) => forbiddenOps.includes(key))
    );
    if (hasForbidden) {
      return res.status(400).json({ error: "Forbidden aggregation operators" });
    }

    const result = await collection.aggregate(pipeline).toArray();
    return res.json(result);
  } catch (err: any) {
    console.error("❌ Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
