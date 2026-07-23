import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSocketEvents } from "./socketEvents";
import jwt from "jsonwebtoken";

export let io: Server;

export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // matches frontend url in vite config (can also handle 5174 etc)
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as any;
      (socket as any).userId = decoded.user?.id || decoded.id; 
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  console.log("Initializing Socket.IO Server...");
  registerSocketEvents(io);
  return io;
};
