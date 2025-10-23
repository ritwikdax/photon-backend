import { Router } from "express";
import trackDeliverablesHandler from "../handlers/trackDeliverables.js";

const publicRouter = Router();
publicRouter.get("/track/:projectId", trackDeliverablesHandler);

export { publicRouter };
