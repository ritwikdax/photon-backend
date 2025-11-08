import { NextFunction, Request, Response } from "express";
export async function merchantGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isActiveMerchant = res.locals["isActiveMerchant"];

    console.log({ isActiveMerchant, message: "Merchant statu" });
    if (!isActiveMerchant) {
      return res.status(403).json({
        message: "Merchant has been disabled;",
      });
    }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "Merchant Status error" });
  }
}
