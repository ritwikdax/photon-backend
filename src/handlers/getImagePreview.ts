import axios from "axios";
import { Request, Response } from "express";
import { google } from "googleapis";
import { auth } from "../cred.js";

export async function getImagePreviewHandler(req: Request, res: Response) {
  const fileId = req.params["fileId"];

  if (!fileId) {
    return res.status(403).json({ error: true, message: "File id not found" });
  }
  try {
    const drive = google.drive({ version: "v3", auth });
    const file = await drive.files.get({
      fileId,
      fields: "thumbnailLink, modifiedTime",
    });

    const thumbnailUrl = file.data.thumbnailLink?.replace(/=s\d+/, "=s640");
    if (!thumbnailUrl) {
      return res.status(404).send("No thumbnail available for this file");
    }

    const response = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
    });

    // Let browser cache aggressively — your server won't re-fetch
    res.set({
      "Content-Type": response.headers["content-type"] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${fileId}"`,
    });

    res.send(response.data);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Error fetching thumbnail");
  }
}
