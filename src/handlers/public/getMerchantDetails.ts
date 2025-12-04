import { Request, Response } from "express";
import { db } from "../../database.js";
import { ROOT_COLLECTIONS } from "../../const.js";

export async function getMerchantLogoHandler(req: Request, res: Response) {
  try {
    const merchantId = res.locals["merchantId"];
    const merchantDetails = await db
      .collection(ROOT_COLLECTIONS.MERCHANTS)
      .findOne({ id: merchantId });

    return res.status(200).json({
      logo: merchantDetails?.logo,
      logoDark: merchantDetails?.logoDark,
    });
  } catch (err: any) {
    console.error("❌ Error in getMerchantLogoHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      merchantId: res.locals["merchantId"],
    });
    return res.status(500).send("Error fetching merchant details");
  }
}
