import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, ENV_VARIABLES } from "../../utils/env.js";

const excludePaths = [/^\/thumbnail\/[^/]+$/, /^\/preview\/[^/]+$/];

export function authGuardPublicMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (excludePaths.some((pattern) => pattern.test(req.path))) {
      return next(); // Skip middleware
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Authorization Bearer token is missing",
      });
    }

    //Verify Public Token
    const paylaod = jwt.verify(token, env(ENV_VARIABLES.JWT_SECRET)) as any;

    const projectId = paylaod["projectId"];
    const merchantId = paylaod["merchantId"];

    if (!projectId || !merchantId) {
      //No go ahead
      return res
        .status(403)
        .json({ error: true, message: "Details missing from token" });
    } else {
      res.locals["projectId"] = projectId;
      res.locals["merchantId"] = merchantId;
    }
    next();
  } catch (err: any) {
    console.error("❌ Error in authGuardPublicMiddleware:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      path: req.path,
      headers: req.headers.authorization ? "Present" : "Missing",
    });
    return res.status(401).json({ error: true, message: err?.message });
  }
}
