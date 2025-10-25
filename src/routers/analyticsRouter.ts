import { Router } from "express";
import { getOccupiedIdsHandler } from "../handlers/getOccupiedIds.js";

const analyticsRouter = Router();
analyticsRouter.post("/getOccupiedIds", getOccupiedIdsHandler);

export { analyticsRouter };
