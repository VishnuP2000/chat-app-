"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAccessToken = (req, res, next) => {
    try {
        // accessToken is now sent via Authorization: Bearer header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const userId = decoded.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }
        req.user = {
            id: String(userId),
        };
        next();
    }
    catch (error) {
        console.error("Access token error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};
exports.verifyAccessToken = verifyAccessToken;
