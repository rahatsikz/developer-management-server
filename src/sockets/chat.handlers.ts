import { Server as IOServer, Socket } from "socket.io";
import { ChatService } from "../app/services/chat.service";

export default function registerChatHandlers(io: IOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`↪️  ${socket.id} joined chat ${chatId}`);
    });

    socket.on(
      "sendMessage",
      async (payload: { chatId: string; userId: string; content: string }) => {
        try {
          const message = await ChatService.createMessage(
            payload.chatId,
            payload.userId,
            payload.content
          );
          io.to(payload.chatId).emit("newMessage", message);
        } catch (err) {
          console.error("Error handling sendMessage:", err);
        }
      }
    );

    socket.on("disconnect", () =>
      console.log(`❌ Socket disconnected: ${socket.id}`)
    );
  });
}
