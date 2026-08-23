"use strict";
// import { Server, Socket } from "socket.io";
// import { Server as HttpServer } from "http";
// import  MessageModel  from "../models/message.modal";
// import { ChatModel } from "../models/chat.modal";
// import jwt from "jsonwebtoken";
// interface AuthSocket extends Socket {
//   userId?: string;
// }
// // Store online users: userId → socketId
// export const onlineUsers = new Map<string, string>();
// export const initSocket = (httpServer: HttpServer) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:5173",   // ✅ must match your frontend URL
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });
// console.log('chat.socket.ts')
//   // ─── Auth Middleware ──────────────────────────────────────────
//   io.use((socket: AuthSocket, next) => {
//     const token =
//       socket.handshake.auth?.token ||
//       socket.handshake.headers?.authorization?.split(" ")[1];
//     if (!token) return next(new Error("Unauthorized: No token"));
//     try {
//       // Replace with your own JWT verify logic
// const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//       socket.userId = decoded.userId;
//       next();
//     } catch {
//       next(new Error("Unauthorized: Invalid token"));
//     }
//   });
//   // ─── Connection↙️ ───────────────────────────────────────────────
//   io.on("connection", (socket: AuthSocket) => {
//     const userId = socket.userId;
//     console.log(`✅ new connection established: ${userId}`);
//       socket.onAny((event, ...args) => {
//     console.log("📡 RECEIVED EVENT:", event);
//     console.log("📦 DATA:", args);
//   });
//       if (!userId) {
//     socket.disconnect();
//     return;
//   }
//     // Register user as online ↗️
//     onlineUsers.set(userId, socket.id);
//     io.emit("user_online", { userId });
//     // ─── Join room ──────────────────────────────────────────────
//     socket.on("join_room", (chatId: string) => {
//       console.log("JOIN ROOM:", chatId);
//       socket.join(chatId);
//       socket.emit("mark_read", chatId);   // auto mark as read on open
//         console.log("socket.rooms",socket.rooms);
//     });
//     // ─── Leave room ─────────────────────────────────────────────
//     socket.on("leave_room", (chatId: string) => {
//       console.log('leave_room',chatId)
//       socket.leave(chatId);
//     });
//     // ─── Send message ────────────────────────────────────────────
//     socket.on("send_message",async (data: {chatId: string;receiverId: string; content: string;messageType?: "text" | "image" | "file";}) => {
//         try {
//           console.log("MESSAGE RECEIVED")
//           console.log("socket.on data",data)
//           const { chatId, receiverId, content, messageType = "text" } = data;
//           console.log("socket.on receiverId",receiverId)
//           console.log('soket.on room',socket.rooms)
//           // 1. Save to DB
//           const message = await MessageModel.create({
//             chatId,
//             sender: userId,
//             receiver: receiverId,
//             content,
//             messageType,
//             readBy: [userId],
//           });
//           // 2. Update chat metadata
//           await ChatModel.findByIdAndUpdate(chatId, {
//             lastMessage: message._id,
//             $push: { messages: message._id },
//             $inc: { [`unreadCounts.${receiverId}`]: 1 },
//           });
//           // 3. Populate sender details
//           const populated = await message.populate("sender", "name avatar");
//           // 4. Broadcast to everyone in the room
//           io.to(chatId).emit("receive_message", populated);
//           // 5. Notify receiver if online but in a different room
//           const receiverSocketId = onlineUsers.get(receiverId);
//           if (receiverSocketId) {
//             io.to(receiverSocketId).emit("new_message_notification", {
//               chatId,
//               message: populated,
//             });
//           }
//         } catch (err) {
//           console.error("send_message error:", err);
//           socket.emit("error", { message: "Failed to send message" });
//         }
//       }
//     );
//     // ─── Typing indicators ────────────────────────────────────────
// socket.on("typing_start", (chatId: string) => {
//   console.log("Typing started:", {
//     userId,
//     chatId,
//     socketId: socket.id,
//   });
//   socket.to(chatId).emit("typing_start", {
//     userId,
//     chatId,
//   });
// });
// socket.on("typing_stop", (chatId: string) => {
//   console.log("Typing stopped:", {
//     userId,
//     chatId,
//   });
//   socket.to(chatId).emit("typing_stop", {
//     userId,
//     chatId,
//   });
// });
//     // ─── Mark messages as read ────────────────────────────────────
//     socket.on("mark_read", async (chatId: string) => {
//       try {
//         await MessageModel.updateMany(
//           { chatId, readBy: { $ne: userId } },
//           { $addToSet: { readBy: userId } }
//         );
//         await ChatModel.findByIdAndUpdate(chatId, {
//           $set: { [`unreadCounts.${userId}`]: 0 },
//         });
//         socket.to(chatId).emit("messages_read", { chatId, readBy: userId });
//       } catch (err) {
//         socket.emit("error", { message: "Failed to mark as read" });
//       }
//     });
//     // ─── Disconnect ───────────────────────────────────────────────
//     socket.on("disconnect", () => {
//       onlineUsers.delete(userId);
//       io.emit("user_offline", { userId });
//       console.log(`❌ Disconnected: ${userId}`);
//     });
//   });
//   return io;
// };
