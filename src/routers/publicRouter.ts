import { Router } from "express";
import trackDeliverablesHandler from "../handlers/trackDeliverables.js";
import { listImagePreviewsHandler } from "../handlers/getPhotos.js";
import { getFoldersHandler } from "../handlers/getFolders.js";
import { getThumbnailsHandler } from "../handlers/getThumbnails.js";
import { getSelectionAllowedHandler } from "../handlers/getSelectionAllowed.js";
import { getSelectedImagesHandler } from "../handlers/public/getSelectedImages.js";
import { addSelectedImagehandler } from "../handlers/public/addSelectedImage.js";
import { deleteSelectionHandler } from "../handlers/public/deleteSelection.js";

const publicRouter = Router();

//Photon Tracking
publicRouter.get("/track", trackDeliverablesHandler);

//Photon Select
publicRouter.get("/folders", getFoldersHandler);
publicRouter.get("/images/:folderId/", listImagePreviewsHandler);
publicRouter.get("/thumbnail/:fileId", getThumbnailsHandler);
publicRouter.get("/maxSelection", getSelectionAllowedHandler);
publicRouter.get("/selectedImages", getSelectedImagesHandler);

publicRouter.post("/selectImage", addSelectedImagehandler);
publicRouter.delete("/selectImage/:imageId", deleteSelectionHandler);

export { publicRouter };
