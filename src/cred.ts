import { google } from "googleapis";
import "dotenv/config";

const json = Buffer.from(
  process.env.GCP_SERVICE_ACCOUNT_B64 ?? "",
  "base64"
).toString("utf8");
export const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(json),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
