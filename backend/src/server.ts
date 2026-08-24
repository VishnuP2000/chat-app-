import dotenv from "dotenv";
import 'dotenv/config'
dotenv.config();
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import "reflect-metadata";
import cors from "cors";

import userRouter from "./routes/userRouter";
import { connectDB } from "./config/db";
import chatRouter from "./routes/chatRouter";
import messageRouter from "./routes/messageRouter";

import "./models/chat.modal";
import "./models/message.modal";
import "./models/user.model";


const app = express();

const httpServer = http.createServer(app);

connectDB();

// const allowedOrigins = [
//   "https://chat-app-beige-one-42.vercel.app",
// ];

app.use(
  cors({
    origin: "https://chat-app-cmrb.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route does not exist",
  });
});
// SOCKET.IO
import { initSocketServer } from "./socket/socketServer";
console.log('initSocketServer server.js start')
initSocketServer(httpServer);
console.log('initSocketServer server.js end')


httpServer.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});