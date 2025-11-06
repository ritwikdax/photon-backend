import { Request, Response } from "express";
import { db } from "../database.js";

export async function getSelectionAllowedHandler(req: Request, res: Response) {
  const projectId = req.params["projectId"];

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
    console.error(err.message);
    res.status(500).send("Error fetching details");
  }
}
