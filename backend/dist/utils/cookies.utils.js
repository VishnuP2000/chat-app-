"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const setCookies = (res, type, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
};
exports.setCookies = setCookies;
