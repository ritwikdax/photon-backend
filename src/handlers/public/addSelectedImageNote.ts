import { Request, Response } from "express";
import { getDb } from "../../database.js";
import { COLLECTIONS } from "../../const.js";
import { addImageNoteSchema } from "./schemas/addImageNoteSchema.js";

export async function addSelectedImageNoteHandler(req: Request, res: Response) {
  try {
    const now = new Date();
    const projectId = res.locals["projectId"];
    const merchantId = res.locals["merchantId"];
    const imageId = req.params["imageId"];

    if (!imageId) {
      return res
        .status(403)
        .json({ error: true, message: "Image Id not found" });
    }

    const body = req.body;
    const parsedBody = addImageNoteSchema.parse(body);

    const db = await getDb(merchantId);
    const result = await db
      .collection(COLLECTIONS.IMAGE_SELECTIONS)
      .findOne({ projectId: projectId });

    if (!result || !result.isSelectionAllowed) {
      return res
        .status(403)
        .json({ error: true, message: "Image selection not allowed" });
    }

    await db.collection(COLLECTIONS.SELECTED_IMAGES).updateOne(
      { imageId: imageId, projectId: projectId },
      {
        $set: {
          note: parsedBody.note,
          updatedAt: now,
        },
      }
    );

    return res.status(201).json({ message: "Image note added successfully" });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Error adding note to selected image");
  }
}
