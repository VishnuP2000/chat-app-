"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const setCookies = (res, type, token) => {
    console.log('setCookies');
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(type, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: type === "accessToken"
            ? 15 * 60 * 1000 // 15 minutes
            : 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
exports.setCookies = setCookies;
