import { google } from "googleapis";
import { auth } from "../cred.js";
export async function getFolderDetails(folderId: string) {
  try {
    const drive = google.drive({ version: "v3", auth });

    const res = await drive.files.get({
      fileId: folderId,
      fields:
        "id, name, mimeType, createdTime, modifiedTime, owners, size, webViewLink",
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error in getFolderDetails:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      folderId,
    });
    throw err; // Re-throw to let the caller handle it
  }
}
