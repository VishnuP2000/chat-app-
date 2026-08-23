"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Generate Access Token
 * @param user - user object (must include id)
 * @returns Signed JWT access token
 */
const generateAccessToken = (userID) => {
    console.log('UserID', userID);
    const secret_key = process.env.ACCESS_TOKEN;
    if (!secret_key) {
        throw new Error("ACCESS_TOKEN secret key is missing in environment variables");
    }
    // return jwt.sign({  user:{ id:decoded.user.id} }, secret_key, { expiresIn: "15m" });
    return jsonwebtoken_1.default.sign({ id: userID }, secret_key, { expiresIn: "15s" });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate Refresh Token
 * @param user - user object (must include id)
 * @returns Signed JWT refresh token
 */
const generateRefreshToken = (user) => {
    const refresh_key = process.env.REFRESH_TOKEN;
    if (!refresh_key) {
        throw new Error("REFRESH_TOKEN secret key is missing in environment variables");
    }
    return jsonwebtoken_1.default.sign({ user: user }, refresh_key, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verify Access Token
 * @param token - JWT access token string
 * @returns Decoded payload if valid, otherwise null
 */
// export const verifyAccessToken = (token: string) => {
//   try {
//     return jwt.verify(token, process.env.ACCESS_TOKEN as string);
//   } catch (error) {
//     console.log("error", error);
//     return null;
//   }
// };
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN);
    }
    catch (error) {
        console.log("error", error);
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
