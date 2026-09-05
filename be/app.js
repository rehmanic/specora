import express from "express";
import { registerMiddlewares } from "./src/middlewares/global.js";
import { registerRoutes } from "./src/config/routes/index.js";
import { registerErrorHandlers } from "./src/middlewares/errorHandler.js";

const app = express();
registerMiddlewares(app);
registerRoutes(app);
registerErrorHandlers(app);

export default app;
