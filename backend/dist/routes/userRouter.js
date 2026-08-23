"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/implementations/auth.controllers");
const Multer_1 = __importDefault(require("../config/Multer"));
const userRouter = (0, express_1.Router)();
console.log('second');
userRouter.post("/signUp", Multer_1.default.single("image"), auth_controllers_1.authControllers.signUp.bind(auth_controllers_1.authControllers));
userRouter.post("/signIn", auth_controllers_1.authControllers.signIn.bind(auth_controllers_1.authControllers));
userRouter.post("/refresh-token", auth_controllers_1.authControllers.refreshToken.bind(auth_controllers_1.authControllers));
exports.default = userRouter;
