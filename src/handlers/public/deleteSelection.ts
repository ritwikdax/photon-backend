import { Request, Response } from "express";
import { getDb } from "../../database.js";
import { COLLECTIONS } from "../../const.js";

export async function deleteSelectionHandler(req: Request, res: Response) {
  try {
    const projectId = res.locals["projectId"];
    const merchantId = res.locals["merchantId"];
    const imageId = req.params["imageId"];

    if (!imageId) {
      return res
        .status(403)
        .json({ error: true, message: "Image Id not found" });
    }
    const db = await getDb(merchantId);

    await db
      .collection(COLLECTIONS.SELECTED_IMAGES)
      .deleteOne({ imageId: imageId, projectId: projectId });
    return res.status(201).json({ message: "Image deleted successfully" });
  } catch (err: any) {
    console.error("❌ Error in deleteSelectionHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      imageId: req.params["imageId"],
      projectId: res.locals["projectId"],
      merchantId: res.locals["merchantId"],
    });
    return res.status(500).send("Error deleting selected image");
  }
}
