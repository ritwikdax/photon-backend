import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function authGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Authorization Bearer token is missing",
      });
    }

    const decoded = jwt.decode(token ?? "", { complete: true });
    const email = (decoded?.payload as any)["email"];
    res.locals["email"] = email;
    res.locals["token"] = token;
    if (!email) {
      return res.status(401).json({
        error: true,
        message: "User Email Not Found",
      });
    }
    next();
  } catch (err: any) {
    console.error("❌ Error in authGuardMiddleware:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      hasAuthHeader: !!req.headers["authorization"],
    });
    return res
      .status(401)
      .json({ error: true, message: "User not logged in or invalid token" });
  }
}
