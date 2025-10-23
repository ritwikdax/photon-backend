import { Request, Response } from "express";
import { db } from "../database.js";
import { trackDeliverablesPipeline } from "../aggregation/trackDeliverables.js";

export default async function trackDeliverablesHandler(
  req: Request,
  res: Response
) {
  const result = db.collection("projectDeliverables").aggregate([
    {
      $match: { projectId: req.params.projectId },
    },
    ...trackDeliverablesPipeline,
  ]);

  const deliverablesData = await result.toArray();
  if (deliverablesData.length) {
    db.collection("projects").updateOne(
      { id: req.params.projectId },
      { $set: { lastTrackedAt: new Date() }, $inc: { trackCount: 1 } }
    );
  }
  if (!deliverablesData.length) {
    return res.status(404).json({ message: "No deliverables found" });
  }
  return res
    .status(200)
    .json((deliverablesData?.length && deliverablesData[0]) || {});
}
