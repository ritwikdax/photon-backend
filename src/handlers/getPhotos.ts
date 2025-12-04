import { Request, Response } from "express";
import { google } from "googleapis";
import { auth } from "../cred.js";

export async function listImagePreviewsHandler(req: Request, res: Response) {
  const folderId = req.params["folderId"];
  const nextPageToken = req.query["nextPageToken"];

  if (!folderId) {
    return res
      .status(403)
      .json({ error: true, message: "projectId or folderId is missing" });
  }

  try {
    const drive = google.drive({ version: "v3", auth });
    let driveQuery: any;
    if (nextPageToken) {
      driveQuery = {
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
        pageToken: nextPageToken,
        orderBy: "name",
      };
    } else {
      driveQuery = {
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
        pageToken: nextPageToken,
        orderBy: "name",
      };
    }

    const result = (await drive.files.list(driveQuery)) as any;

    const files = result.data.files.map((f: any) => ({
      ...f,
      thumbnailLink: `/public/thumbnail/${f.id}`,
      hdPreviewLink: `/public/preview/${f.id}`,
      originalLink: `https://drive.google.com/uc?export=view&id=${f.id}`,
    }));
    res.set({
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    return res
      .status(200)
      .json({ nextPageToken: result.data.nextPageToken, images: files });
  } catch (err: any) {
    console.error("❌ Error in listImagePreviewsHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      folderId,
      nextPageToken,
    });
    return res.status(500).json({
      error: true,
      message: "Something Went Wrong In Fetching Images",
    });
  }
}
