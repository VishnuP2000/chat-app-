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
exports.messageservice = exports.messageService = void 0;
const typedi_1 = __importStar(require("typedi"));
const chat_repository_1 = require("../../../repositories/implementations/chat.repository");
const message_repository_1 = require("../../../repositories/implementations/message.repository");
const mongoose_1 = require("mongoose");
const customError_1 = require("../../../utils/customError");
const httpStatus_1 = require("../../../enum/httpStatus");
let messageService = class messageService {
    constructor(chatRepo, messageRepo) {
        this.chatRepo = chatRepo;
        this.messageRepo = messageRepo;
    }
    async foundMessages(chatId, content, senderId) {
        console.log("founderMessageService chatId", chatId);
        console.log("founderMessageService content", content);
        console.log("founderMessageService senderId", senderId);
        const messageObjectId = new mongoose_1.Types.ObjectId(chatId);
        const senderIdObjectId = new mongoose_1.Types.ObjectId(senderId);
        console.log("messageObjectId", messageObjectId);
        // 1️⃣ Fast lookup just to verify chat exists and get users
        const existingChat = await this.chatRepo.findById(chatId);
        if (!existingChat) {
            throw new customError_1.AppError("Chat not found", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const receiverId = existingChat.users.find((u) => u.toString() !== senderId);
        if (!receiverId) {
            throw new customError_1.AppError("Receiver not foundd", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        console.log("create message via messageRepo");
        // 1️⃣ Create message using repository
        const message = await this.messageRepo.create({
            chatId: messageObjectId,
            senderId: senderIdObjectId,
            content,
            status: "sent",
            readBy: [senderIdObjectId]
        });
        console.log("message", message);
        // 3️⃣ Update chat and Re-fetch populated relations in one go
        const updatedChat = await this.chatRepo.updateAndPopulate(messageObjectId, {
            $push: { messages: message._id },
            $set: { lastMessage: message._id },
            $inc: {
                [`unreadCounts.${receiverId.toString()}`]: 1,
            },
        });
        console.log("updatedChat after new message", updatedChat);
        if (!updatedChat) {
            throw new customError_1.AppError("Chat not found after update", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        console.log("return success");
        return { success: true, message: "message send", data: updatedChat };
    }
    async findUserId(userChatId) {
        console.log("findUser", userChatId);
        const usersUserChatId = new mongoose_1.Types.ObjectId(userChatId);
        const response = await this.chatRepo.findByChatId(usersUserChatId);
        console.log('findUserId response', response);
        if (!response) {
            throw new customError_1.AppError("Chat not found", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: "message send", data: response };
    }
    async markMessagesRead(chatId, userId) {
        console.log("markMessagesRead service", chatId, userId);
        const chatObjectId = new mongoose_1.Types.ObjectId(chatId);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        await this.messageRepo.markAsRead(chatObjectId, userObjectId);
        await this.chatRepo.updateById(chatObjectId, {
            $set: { [`unreadCounts.${userId}`]: 0 }
        });
        const updatedChat = await this.chatRepo.findByChatId(chatObjectId);
        if (!updatedChat) {
            throw new customError_1.AppError("Chat not found after read update", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: "Messages marked as read", data: updatedChat };
    }
    async markMessagesDelivered(chatId, userId) {
        console.log("markMessagesDelivered service", chatId, userId);
        const chatObjectId = new mongoose_1.Types.ObjectId(chatId);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        await this.messageRepo.markAsDelivered(chatObjectId, userObjectId);
        const updatedChat = await this.chatRepo.findByChatId(chatObjectId);
        if (!updatedChat) {
            throw new customError_1.AppError("Chat not found after delivery update", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: "Messages marked as delivered", data: updatedChat };
    }
};
exports.messageService = messageService;
exports.messageService = messageService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => chat_repository_1.ChatRepository)),
    __param(1, (0, typedi_1.Inject)(() => message_repository_1.MessageRepository)),
    __metadata("design:paramtypes", [Object, Object])
], messageService);
exports.messageservice = typedi_1.default.get(messageService);
