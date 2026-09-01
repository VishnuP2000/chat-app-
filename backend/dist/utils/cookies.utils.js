"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
// Sets only the refreshToken as an HTTP-only cookie.
// accessToken is now returned in the API response body.
const setCookies = (res, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    };
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setCookies = setCookies;
