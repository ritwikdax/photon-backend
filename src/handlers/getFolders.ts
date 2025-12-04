import { Request, Response } from "express";
import { getDb } from "../database.js";
import { getFolderDetails } from "../utils/getFolderDetyailsById.js";
import { COLLECTIONS } from "../const.js";

export async function getFoldersHandler(req: Request, res: Response) {
  try {
    const projectId = res.locals["projectId"];
    const merchantId = res.locals["merchantId"];

    const db = await getDb(merchantId);
    const result = await db
      .collection(COLLECTIONS.IMAGE_SELECTIONS)
      .findOne({ projectId: projectId });

    const ids = result?.folderIds;
    if (!Array.isArray(ids) || (Array.isArray(ids) && !ids.length)) {
      return res.status(404).json({ error: true, message: "No folders found" });
    }

    const folderDetails = [];
    for (const id of ids) {
      const details = await getFolderDetails(id);
      folderDetails.push({ folderId: details.id, name: details.name });
    }
    res.status(200).json({ folders: folderDetails });
  } catch (err: any) {
    console.error("❌ Error in getFoldersHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      projectId: res.locals["projectId"],
      merchantId: res.locals["merchantId"],
    });
    res
      .status(403)
      .json({ error: true, message: "Make sure folders ids are correct" });
  }
}
