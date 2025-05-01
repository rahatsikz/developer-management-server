import { Server } from "http";
import app from "./app";
import config from "./config";

async function mainFunc() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Developer management server is running on port ${config.port}`);
  });
}

mainFunc();
