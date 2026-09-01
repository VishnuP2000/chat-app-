"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAccessToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        console.log("authMiddleware token:", token ? "present" : "missing");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token missing",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        console.log("Decoded token:", decoded);
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
        console.log("Authenticated user:", req.user);
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
