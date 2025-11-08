import { google } from "googleapis";
import "dotenv/config";
import { env, ENV_VARIABLES } from "./utils/env.js";

const json = Buffer.from(
  env(ENV_VARIABLES.GCP_SERVICE_ACCOUNT_B64),
  "base64"
).toString("utf8");
export const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(json),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
