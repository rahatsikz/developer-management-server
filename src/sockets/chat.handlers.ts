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

          io.emit("newMessageGlobal", message);
        } catch (err) {
          console.error("Error handling sendMessage:", err);
        }
      }
    );

    socket.on(
      "messageSeen",
      async (payload: {
        chatId: string;
        messageIds: string[];
        userId: string;
      }) => {
        try {
          // Mark messages as seen in DB
          const updatedMessages = await ChatService.seenMessages(
            payload.messageIds,
            payload.userId
          );

          // Notify all clients in the chat except the one who just saw
          socket.to(payload.chatId).emit("messageSeen", {
            chatId: payload.chatId,
            messages: updatedMessages,
          });
        } catch (err) {
          console.error("Error handling messageSeen:", err);
        }
      }
    );

    socket.on("disconnect", () =>
      console.log(`❌ Socket disconnected: ${socket.id}`)
    );
  });
}
