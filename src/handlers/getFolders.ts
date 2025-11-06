import { Request, Response } from "express";
import { db } from "../database.js";
import { getFolderDetails } from "../utils/getFolderDetyailsById.js";

export async function getFoldersHandler(req: Request, res: Response) {
  try {
    const projectId = req.params["projectId"];

    if (!projectId) {
      res.status(403).json({
        error: true,
        message: "Project Id is expected as request URL params",
      });
    }

    const result = await db
      .collection("imageSelections")
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
  } catch (err) {
    res
      .status(403)
      .json({ error: true, message: "Make sure folders ids are correct" });
  }
}
