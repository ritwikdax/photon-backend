import { Request, Response } from "express";
import { ENV_VARIABLES, env } from "../../utils/env.js";

export async function getUrlHandler(req: Request, res: Response) {
  try {
    const publicToken = res.locals["publicToken"];
    return res.status(200).json({
      track: `${env(
        ENV_VARIABLES.PHOTON_TRACKING_APP_BASE_URL
      )}?token=${publicToken}`,
      selection: `${env(
        ENV_VARIABLES.PHOTON_SELECT_APP_BASE_URL
      )}?token=${publicToken}`,
    });
  } catch (err: any) {
    console.error("❌ Error in getUrlHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      publicToken: res.locals["publicToken"],
    });
    res
      .status(500)
      .json({ error: true, message: err?.message ?? "No Error Message found" });
  }
}
