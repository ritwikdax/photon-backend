import "dotenv/config";
import express from "express";
import cors from "cors";
import { publicRouter } from "./routers/publicRouter.js";
import { authGuardMiddleware } from "./mw/private/authguard.middileware.js";
import { privateRouter } from "./routers/privateRouter.js";
import { injectMerchantDetailsMiddleware } from "./mw/private/injectMerchantDetailsMiddleware.js";
import { merchantGuardMiddleware } from "./mw/private/merchantguard.middleware.js";
import { authGuardPublicMiddleware } from "./mw/public/authguardPublic.middleware.js";

const app = express();
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", authGuardPublicMiddleware, publicRouter);
app.use(
  "/api",
  authGuardMiddleware,
  injectMerchantDetailsMiddleware,
  merchantGuardMiddleware,
  privateRouter
);

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
