"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = require("../utils/customError");
// This middleware protects a route by verifying the access token
const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("authMiddleware", authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log('Access token missing');
            throw new customError_1.AppError("Access token missing", 401);
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const userId = decoded.user.id;
        req.user = { id: userId };
        // req.user = { id: decoded.user.id };
        console.log("complate the middlware");
        next();
    }
    catch (error) {
        console.log("get the middleware error,,,,,,,,,", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};
exports.verifyAccessToken = verifyAccessToken;
