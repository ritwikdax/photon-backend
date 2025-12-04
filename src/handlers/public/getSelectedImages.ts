import { Request, Response } from "express";
import { getDb } from "../../database.js";
import { COLLECTIONS } from "../../const.js";

export async function getSelectedImagesHandler(req: Request, res: Response) {
  try {
    const projectId = res.locals["projectId"];
    const merchantId = res.locals["merchantId"];
    const db = await getDb(merchantId);
    const images = await db
      .collection(COLLECTIONS.SELECTED_IMAGES)
      .find(
        { projectId: projectId },
        { projection: { imageId: 1, _id: 0, imageFileName: 1, note: 1 } }
      )
      .toArray();

    return res.status(200).json(images);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Error fetching selected images");
  }
}
