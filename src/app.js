import express from "express";

import notificationsRoutes from "./routes/notifications";
import notificationsMiddleware from "./middlewares/notifications";
import cors from "./middlewares/cors";
import eventsRoutes from "./routes/events";
import eventsMiddleware from "./middlewares/events";

const app = express();

app
  .use(express.json())
  .use(cors)
  .use("/notifications", notificationsMiddleware)
  .use("/notifications", notificationsRoutes)
  .use("/events", eventsMiddleware)
  .use("/events", eventsRoutes);

export default app;
