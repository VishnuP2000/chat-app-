"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketEvents = exports.onlineUsers = void 0;
const messages_service_1 = require("../services/implementations/messages/messages.service");
const mongoose_1 = require("mongoose");
// Map to track online users: userId -> Set of socketIds
exports.onlineUsers = new Map();
console.log('enter the registerSocketEvents');
const registerSocketEvents = (io) => {
    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);
        const currentUserId = socket.data.userId;
        console.log('currentUserId', currentUserId);
        if (!currentUserId) {
            console.log("❌ No userId found");
            socket.disconnect();
            return;
        }
        if (!exports.onlineUsers.has(currentUserId)) {
            exports.onlineUsers.set(currentUserId, new Set());
        }
        exports.onlineUsers.get(currentUserId).add(socket.id);
        console.log(`👤 User connected: ${currentUserId} with socket: ${socket.id}`);
        io.emit("user-online", { userId: currentUserId });
        socket.emit("online-users-list", Array.from(exports.onlineUsers.keys()));
        // join-chat: User joins a specific chat room
        socket.on("join-chat", (data) => {
            console.log('enter join-chat', data);
            const chatId = typeof data === 'string' ? data : data?.chatId;
            if (chatId) {
                socket.join(chatId);
                console.log(`🚪 Socket ${socket.id} joined room: ${chatId}`);
            }
        });
        // leave-chat: User leaves a specific chat room
        socket.on("leave-chat", (data) => {
            console.log('enter leave-chat');
            const chatId = typeof data === 'string' ? data : data?.chatId;
            if (chatId) {
                socket.leave(chatId);
                console.log(`🚪 Socket ${socket.id} left room: ${chatId}`);
            }
        });
        // send-message: Alice sends a message to Bob
        socket.on("send-message", async (data) => {
            console.log("🔥 SEND MESSAGE EVENT RECEIVED");
            console.log("📦 Data:", data);
            console.log("👤 Current user:", currentUserId);
            const { chatId, receiverId, content } = data;
            if (!currentUserId) {
                console.error("❌ currentUserId missing");
                return;
            }
            if (!chatId) {
                console.error("❌ chatId missing");
                return;
            }
            if (!receiverId) {
                console.error("❌ receiverId missing");
                return;
            }
            if (!content?.trim()) {
                console.error("❌ content missing");
                return;
            }
            try {
                const result = await messages_service_1.messageservice.foundMessages(chatId, content, currentUserId);
                console.log("✅ Message saved:", result);
                const chat = result.data;
                if (!chat?.messages?.length) {
                    console.log("⚠️ No messages returned");
                    return;
                }
                const latestMessage = chat.messages[chat.messages.length - 1];
                if (latestMessage instanceof mongoose_1.Types.ObjectId) {
                    console.log("❌ Message was not populated");
                    return;
                }
                const message = latestMessage;
                const socketMessage = {
                    id: message._id.toString(),
                    chatId: message.chatId.toString(),
                    content: message.content,
                    senderId: message.senderId,
                    timestamp: message.createdAt,
                };
                console.log("📨 Emitting:", socketMessage);
                io.to(chatId).emit("receive-message", socketMessage);
                // Also emit directly to the receiver's connected sockets so they receive it
                // even if they haven't explicitly joined the chatId room yet.
                if (exports.onlineUsers.has(receiverId)) {
                    const receiverSockets = exports.onlineUsers.get(receiverId);
                    receiverSockets?.forEach((socketId) => {
                        io.to(socketId).emit("receive-message", socketMessage);
                    });
                }
            }
            catch (error) {
                console.error("❌ Error sending message:", error);
                socket.emit("error", {
                    message: "Failed to send message",
                });
            }
        });
        // typing: Alice is typing...
        socket.on("typing_start", (data) => {
            console.log('typing_start', data);
            console.log("Chat ID:", data?.chatId);
            console.log("Current user:", currentUserId);
            console.log("Socket rooms:", [...socket.rooms]);
            if (!currentUserId || !data?.chatId) {
                console.log("❌ Invalid typing_start data");
                return;
            }
            socket.to(data.chatId).emit("typing", { chatId: data.chatId, userId: currentUserId });
        });
        // stop-typing: Alice stopped typing...
        socket.on("typing_stop", (data) => {
            if (!currentUserId || !data?.chatId) {
                console.log("❌ Invalid typing_stop data");
                return;
            }
            socket.to(data.chatId).emit("stop-typing", { chatId: data.chatId, userId: currentUserId });
        });
        //     socket.on("typing_start", (chatId: string) => {
        //   console.log("Typing started:", {
        //     chatId,
        //     socketId: socket.id,
        //   });
        //   socket.to(chatId).emit("typing_start", {
        //     chatId,
        //   });
        // });
        // socket.on("typing_stop", (chatId: string) => {
        //   console.log("Typing stopped:", {
        //     chatId,
        //   });
        //   socket.to(chatId).emit("typing_stop", {
        //     chatId,
        //   });
        // });
        // message-delivered: Bob received Alice's message
        socket.on("message-delivered", async (data) => {
            if (!currentUserId)
                return;
            try {
                await messages_service_1.messageservice.markMessagesDelivered(data.chatId, currentUserId);
                socket.to(data.chatId).emit("message-delivered", { chatId: data.chatId, userId: currentUserId });
            }
            catch (error) {
                console.error("Error in message-delivered handler:", error);
            }
        });
        // message-read: Bob opened/read Alice's message
        socket.on("message-read", async (data) => {
            if (!currentUserId)
                return;
            try {
                await messages_service_1.messageservice.markMessagesRead(data.chatId, currentUserId);
                socket.to(data.chatId).emit("message-read", { chatId: data.chatId, userId: currentUserId });
            }
            catch (error) {
                console.error("Error in message-read handler:", error);
            }
        });
        // disconnect: Clean up on connection loss
        socket.on("disconnect", () => {
            if (currentUserId && exports.onlineUsers.has(currentUserId)) {
                exports.onlineUsers.get(currentUserId).delete(socket.id);
                if (exports.onlineUsers.get(currentUserId).size === 0) {
                    exports.onlineUsers.delete(currentUserId);
                    console.log(`❌ User disconnected completely: ${currentUserId}`);
                    io.emit("user-offline", { userId: currentUserId });
                }
            }
        });
    });
};
exports.registerSocketEvents = registerSocketEvents;
