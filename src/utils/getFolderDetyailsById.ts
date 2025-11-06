import { google } from "googleapis";
import { auth } from "../cred.js";
export async function getFolderDetails(folderId: string) {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.get({
    fileId: folderId,
    fields:
      "id, name, mimeType, createdTime, modifiedTime, owners, size, webViewLink",
  });

  return res.data;
}
