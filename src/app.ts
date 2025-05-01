import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import routes from "./app/routes/v1";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Welcome to Rahat's DMS project API",
  });
});

// global error handler
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    errorMessages: [{ path: req.originalUrl, message: "Api not found" }],
  });
});

export default app;
