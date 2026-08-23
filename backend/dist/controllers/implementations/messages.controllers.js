"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagecontrollers = exports.messageControllers = void 0;
const typedi_1 = __importStar(require("typedi"));
const messages_service_1 = require("../../services/implementations/messages/messages.service");
let messageControllers = class messageControllers {
    constructor(messageservice) {
        this.messageservice = messageservice;
    }
    async sendMessage(req, res) {
        try {
            console.log("ControllersendMessage");
            const { chatId, content } = req.body.payload;
            const senderId = req.user.id;
            console.log("senderId", senderId);
            console.log("chatId", chatId);
            console.log("content", content);
            const users = await this.messageservice.foundMessages(chatId, content, senderId);
            console.log("get users", users.data);
            return res.status(200).json({
                success: true,
                data: users.data,
            });
        }
        catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch users",
            });
        }
    }
    async findUser(req, res) {
        try {
            console.log("findUsers");
            const { chatId } = req.params;
            console.log("userChatId", chatId);
            const result = await this.messageservice.findUserId(chatId);
            console.log("messageControllerUserChatId", result.data);
            return res.status(200).json({
                success: true,
                data: result.data,
            });
        }
        catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch users",
            });
        }
    }
};
exports.messageControllers = messageControllers;
exports.messageControllers = messageControllers = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => messages_service_1.messageService)),
    __metadata("design:paramtypes", [Object])
], messageControllers);
exports.messagecontrollers = typedi_1.default.get(messageControllers);
