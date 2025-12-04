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

// Global error handler middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Unhandled error in Express app:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });

    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  }
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("❌ Unhandled Promise Rejection:", {
    reason,
    message: reason?.message,
    stack: reason?.stack,
    promise,
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", {
    error: err,
    message: err?.message,
    stack: err?.stack,
  });
  // Exit the process after logging
  process.exit(1);
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
