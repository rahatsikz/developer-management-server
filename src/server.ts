import http from "http";
import app from "./app";
import { Server as IOServer } from "socket.io";
import config from "./config";
import registerChatHandlers from "./sockets/chat.handlers";

async function mainFunc() {
  // 1) Use your Express app to create an HTTP server
  const server = http.createServer(app);

  // 2) Attach Socket.IO, allowing your frontend origin
  const io = new IOServer(server, {
    cors: {
      origin: config.app_url, // same as your Express CORS origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 3) (Optional) make the io instance available elsewhere
  app.set("io", io);

  // 4) Wire up your chat handlers
  registerChatHandlers(io);

  // 5) Start listening
  server.listen(config.port, () => {
    console.log(
      `🚀 Developer management + Chat server running on port ${config.port}`
    );
  });
}

mainFunc();
