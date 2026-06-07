/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import { router } from "./app/routes";
import { success } from "zod";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);
app.use('/api/v1/',AuthRoutes)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome To Tour management System",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
