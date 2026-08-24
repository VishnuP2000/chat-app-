import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { registerSocketEvents } from "./socketEvents";

export let io: Server;

export const initSocketServer = (
  httpServer: HttpServer
): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "https://chat-app-cmrb.vercel.app",
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });
console.log('enter the socketServer')
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN!
      ) as {
        id?: string;
        user?: {
          id?: string;
        };
      };

      const userId =
        decoded.user?.id || decoded.id;

      if (!userId) {
        return next(
          new Error("User ID missing from token")
        );
      }

      socket.data.userId = userId;

      next();
    } catch (error) {
      console.error(
        "Socket authentication error:",
        error
      );

      next(new Error("Authentication error"));
    }
  });

  registerSocketEvents(io);

//   console.log("🚀 Socket.IO Server initialized");    
//   server.listen(4000, () => {
//   console.log("🚀 Server running on port 4000");
// });
return io;
};