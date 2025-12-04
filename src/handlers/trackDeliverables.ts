import { Request, Response } from "express";
import { getDb } from "../database.js";
import { trackDeliverablesPipeline } from "../aggregation/trackDeliverables.js";
import { COLLECTIONS } from "../const.js";

export default async function trackDeliverablesHandler(
  req: Request,
  res: Response
) {
  try {
    const projectId = res.locals["projectId"];
    const merchantID = res.locals["merchantId"];

    const db = await getDb(merchantID);
    const result = db.collection(COLLECTIONS.PROJECT_DELIVERABLES).aggregate([
      {
        $match: { projectId: projectId },
      },
      ...trackDeliverablesPipeline,
    ]);

    const deliverablesData = await result.toArray();

    if (!deliverablesData.length) {
      return res.status(404).json({ message: "No deliverables found" });
    }

    //Increment track count
    db.collection("projects").updateOne(
      { id: projectId },
      { $set: { lastTrackedAt: new Date() }, $inc: { trackCount: 1 } }
    );

    return res
      .status(200)
      .json((deliverablesData?.length && deliverablesData[0]) || {});
  } catch (err: any) {
    console.error("❌ Error in trackDeliverablesHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      projectId: res.locals["projectId"],
      merchantId: res.locals["merchantId"],
    });
    return res.status(500).json({
      error: true,
      message: "Error tracking deliverables",
    });
  }
}
