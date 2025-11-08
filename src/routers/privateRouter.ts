import { Router } from "express";
import { getOccupiedIdsHandler } from "../handlers/getOccupiedIds.js";
import { aggregateHandler } from "../handlers/aggregate.js";
import { validateCollection } from "../mw/private/collection.validator.js";
import { crud } from "../handlers/crud.js";
import { getMerchatDetailsHandler } from "../handlers/getMerchantDetails.js";
import { generatePublicToken } from "../mw/private/generatePublicToken.middleware.js";
import { getUrlHandler } from "../handlers/private/getUrl.js";

const privateRouter = Router();

privateRouter.get("/merchantDetails", getMerchatDetailsHandler);
privateRouter.post("/analytics/getOccupiedIds", getOccupiedIdsHandler);
privateRouter.post("/aggregate/:collection", aggregateHandler);
privateRouter.get("/url", generatePublicToken, getUrlHandler);
privateRouter.use("/:collection", validateCollection, crud);

export { privateRouter };
