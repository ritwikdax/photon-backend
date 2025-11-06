import { Router } from "express";
import trackDeliverablesHandler from "../handlers/trackDeliverables.js";
import { listImagePreviewsHandler } from "../handlers/getPhotos.js";
import { getFoldersHandler } from "../handlers/getFolders.js";
import { getThumbnailsHandler } from "../handlers/getThumbnails.js";
import { getImagePreviewHandler } from "../handlers/getImagePreview.js";
import { getSelectionAllowedHandler } from "../handlers/getSelectionAllowed.js";

const publicRouter = Router();
publicRouter.get("/track/:projectId", trackDeliverablesHandler);
publicRouter.get("/images/:projectId/:folderId/", listImagePreviewsHandler);
publicRouter.get("/folders/:projectId", getFoldersHandler);
publicRouter.get("/thumbnail/:fileId", getThumbnailsHandler);
//publicRouter.get("/preview/:fileId", getImagePreviewHandler);
publicRouter.get("/maxSelection/:projectId", getSelectionAllowedHandler);

//publicRouter.get("/folders");

export { publicRouter };
