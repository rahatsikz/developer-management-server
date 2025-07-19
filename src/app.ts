import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import routes from "./app/routes/v1";
import session from "express-session";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: [config.app_url!],
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "dms.sid", // cookie name
    secret: config.session_secret!,
    resave: false, // only save when session is modified
    saveUninitialized: false, // don't create session until something is stored
    cookie: {
      httpOnly: true, // JS can’t read the cookie
      secure: false, // set to true if you serve over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
    },
  })
);

// route
app.use("/api/v1", routes);

app.get("/create-repo", (req, res) => {
  if (!(req.session as any).githubToken) {
    return res.redirect("/api/v1/auth/github/login");
  }
  // Render a basic HTML form, or send JSON telling client to POST name/projectId:
  res.send(`
    <form action="/api/v1/repository" method="post">
      <input name="name" placeholder="Repo name" required />
      <input name="projectId" placeholder="Project ID" required />
      <button>Create Repo</button>
    </form>
  `);
});

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
