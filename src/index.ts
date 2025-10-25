import express from "express";
import cors from "cors";
import { publicRouter } from "./routers/publicRouter.js";
import { aggregateHandler } from "./handlers/aggregate.js";
import { crud } from "./handlers/crud.js";
import { validateCollection } from "./mw/collection.validator.js";
import { analyticsRouter } from "./routers/analyticsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/analytics", analyticsRouter);
//Support client side aggregation
app.post("/aggregate/:collection", aggregateHandler);
app.use("/api/:collection", validateCollection, crud);
app.use("/public", publicRouter);

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
