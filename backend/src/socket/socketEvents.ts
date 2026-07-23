import { Server, Socket } from "socket.io";
import { messageservice } from "../services/implementations/messages/messages.service";

// Map to track online users: userId -> Set of socketIds
export const onlineUsers = new Map<string, Set<string>>();

export const registerSocketEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    
    const currentUserId = (socket as any).userId;
    if (!currentUserId) {
        socket.disconnect();
        return;
    }

    if (!onlineUsers.has(currentUserId)) {
      onlineUsers.set(currentUserId, new Set());
    }
    onlineUsers.get(currentUserId)!.add(socket.id);

    console.log(`👤 User connected: ${currentUserId} with socket: ${socket.id}`);
    io.emit("user-online", { userId: currentUserId });
    socket.emit("online-users-list", Array.from(onlineUsers.keys()));

    // join-chat: User joins a specific chat room
    socket.on("join-chat", (data: { chatId: string } | string) => {
      const chatId = typeof data === 'string' ? data : data?.chatId;
      if (chatId) {
        socket.join(chatId);
        console.log(`🚪 Socket ${socket.id} joined room: ${chatId}`);
      }
    });

    // leave-chat: User leaves a specific chat room
    socket.on("leave-chat", (data: { chatId: string } | string) => {
      const chatId = typeof data === 'string' ? data : data?.chatId;
      if (chatId) {
        socket.leave(chatId);
        console.log(`🚪 Socket ${socket.id} left room: ${chatId}`);
      }
    });

    // send-message: Alice sends a message to Bob
    socket.on("send-message", async (data: { chatId: string; receiverId: string; content: string }) => {
      const { chatId, receiverId, content } = data;
      if (!currentUserId) {
        console.error("send-message error: currentUserId not set for socket " + socket.id);
        return;
      }

      try {
        // Save using MessageService (which uses MessageRepository)
        const result = await messageservice.foundMessages(chatId, content, currentUserId);
        const chat = result.data;

        if (chat && chat.messages && chat.messages.length > 0) {
          const latestMessage = chat.messages[chat.messages.length - 1];

          // Emit to all users in the chat room except sender
          socket.to(chatId).emit("receive-message", latestMessage);

          // If the receiver is online, notify them (potentially multiple sockets)
          const receiverSockets = onlineUsers.get(receiverId);
          if (receiverSockets && receiverSockets.size > 0) {
            receiverSockets.forEach(socketId => {
              io.to(socketId).emit("new-message-notification", {
                chatId,
                message: latestMessage,
              });
            });
          }
        }
      } catch (error) {
        console.error("Error in send-message handler:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // typing: Alice is typing...
    socket.on("typing", (data: { chatId: string }) => {
      if (!currentUserId) return;
      socket.to(data.chatId).emit("typing", { chatId: data.chatId, userId: currentUserId });
    });

    // stop-typing: Alice stopped typing...
    socket.on("stop-typing", (data: { chatId: string }) => {
      if (!currentUserId) return;
      socket.to(data.chatId).emit("stop-typing", { chatId: data.chatId, userId: currentUserId });
    });

    // message-delivered: Bob received Alice's message
    socket.on("message-delivered", async (data: { chatId: string }) => {
      if (!currentUserId) return;
      try {
        await messageservice.markMessagesDelivered(data.chatId, currentUserId);
        socket.to(data.chatId).emit("message-delivered", { chatId: data.chatId, userId: currentUserId });
      } catch (error) {
        console.error("Error in message-delivered handler:", error);
      }
    });

    // message-read: Bob opened/read Alice's message
    socket.on("message-read", async (data: { chatId: string }) => {
      if (!currentUserId) return;
      try {
        await messageservice.markMessagesRead(data.chatId, currentUserId);
        socket.to(data.chatId).emit("message-read", { chatId: data.chatId, userId: currentUserId });
      } catch (error) {
        console.error("Error in message-read handler:", error);
      }
    });

    // disconnect: Clean up on connection loss
    socket.on("disconnect", () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        onlineUsers.get(currentUserId)!.delete(socket.id);
        if (onlineUsers.get(currentUserId)!.size === 0) {
          onlineUsers.delete(currentUserId);
          console.log(`❌ User disconnected completely: ${currentUserId}`);
          io.emit("user-offline", { userId: currentUserId });
        }
      }
    });
  });
};
