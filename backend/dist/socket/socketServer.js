"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketEvents_1 = require("./socketEvents");
const initSocketServer = (httpServer) => {
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PATCH"],
            credentials: true,
        },
    });
    console.log('enter the socketServer');
    exports.io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
            const userId = decoded.user?.id || decoded.id;
            if (!userId) {
                return next(new Error("User ID missing from token"));
            }
            socket.data.userId = userId;
            next();
        }
        catch (error) {
            console.error("Socket authentication error:", error);
            next(new Error("Authentication error"));
        }
    });
    (0, socketEvents_1.registerSocketEvents)(exports.io);
    //   console.log("🚀 Socket.IO Server initialized");    
    //   server.listen(4000, () => {
    //   console.log("🚀 Server running on port 4000");
    // });
    return exports.io;
};
exports.initSocketServer = initSocketServer;
