import { NextFunction, Request, Response } from "express";
import { COLLECTIONS } from "../const.js";

export function validateCollection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collection: collectionName } = req.params;
  if (!COLLECTIONS.includes(collectionName)) {
    return res.status(403).json({
      status: "error",
      message: `Collection name ${collectionName} not allowed`,
    });
  }
  next();
}
