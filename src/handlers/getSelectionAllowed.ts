import { Request, Response } from "express";
import { getDb } from "../database.js";

export async function getSelectionAllowedHandler(req: Request, res: Response) {
  const projectId = res.locals["projectId"];
  const merchantId = res.locals["merchantId"];

  const db = await getDb(merchantId);

  if (!projectId) {
    return res.status(403).json({ error: true, message: "Not found" });
  }
  try {
    const result = await db
      .collection("imageSelections")
      .findOne({ projectId: projectId });
    return res.status(200).json({
      maxSelectionCount: result?.maxSelectionCount,
      isSelectionAllowed: result?.isSelectionAllowed,
    });
  } catch (err: any) {
    console.error("❌ Error in getSelectionAllowedHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      projectId: res.locals["projectId"],
      merchantId: res.locals["merchantId"],
    });
    res.status(500).send("Error fetching details");
  }
}
