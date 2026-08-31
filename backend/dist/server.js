"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const db_1 = require("./config/db");
const chatRouter_1 = __importDefault(require("./routes/chatRouter"));
const messageRouter_1 = __importDefault(require("./routes/messageRouter"));
require("./models/chat.modal");
require("./models/message.modal");
require("./models/user.model");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
(0, db_1.connectDB)();
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
].filter((origin) => Boolean(origin));
console.log("Allowed Origins:", allowedOrigins);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/user", userRouter_1.default);
app.use("/chat", chatRouter_1.default);
app.use("/message", messageRouter_1.default);
app.get("/test", (req, res) => {
    console.log("🔥 TEST ROUTE HIT");
    return res.json({
        success: true,
        message: "Server is working",
    });
});
app.use((req, res) => {
    console.log("❌ 404:", req.method, req.originalUrl);
    res.status(404).json({
        message: "Route does not exist",
    });
});
// SOCKET.IO
const socketServer_1 = require("./socket/socketServer");
console.log('initSocketServer server.js start');
(0, socketServer_1.initSocketServer)(httpServer);
console.log('initSocketServer server.js end');
httpServer.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
