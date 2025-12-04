import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, ENV_VARIABLES } from "../../utils/env.js";
import { redisClient } from "../../redis.js";

export async function generatePublicToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const merchantId = res.locals["merchantId"];
    const projectId = req.query["projectId"];
    if (!merchantId || !projectId) {
      return res
        .status(404)
        .json({ error: true, message: "Merchant Id or Project Id not found" });
    }

    const CACHE_KEY = `public_token_${projectId}_${merchantId}`;
    const cachedToken = await redisClient.get(CACHE_KEY);

    if (cachedToken) {
      res.locals["publicToken"] = cachedToken;
      return next();
    }

    const claims = {
      merchantId,
      projectId,
    };
    const publicToken = jwt.sign(claims, env(ENV_VARIABLES.JWT_SECRET));
    await redisClient.set(CACHE_KEY, publicToken);
    res.locals["publicToken"] = publicToken;
    next();
  } catch (err: any) {
    console.error("❌ Error in generatePublicToken:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      merchantId: res.locals["merchantId"],
      projectId: req.query["projectId"],
    });
    res
      .status(500)
      .json({ error: true, message: err?.message ?? "No Error Message found" });
  }
}
