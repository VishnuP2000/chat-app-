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
exports.chatService = exports.ChatService = void 0;
const typedi_1 = __importStar(require("typedi"));
const user_repository_1 = require("../../../repositories/implementations/user.repository");
const customError_1 = require("../../../utils/customError");
const httpStatus_1 = require("../../../enum/httpStatus");
const chat_repository_1 = require("../../../repositories/implementations/chat.repository");
const mongoose_1 = require("mongoose");
const chatRequestReposiotory_1 = require("../../../repositories/implementations/chatRequestReposiotory");
let ChatService = class ChatService {
    constructor(userRepo, chatRepo, chatRequestRepo) {
        this.userRepo = userRepo;
        this.chatRepo = chatRepo;
        this.chatRequestRepo = chatRequestRepo;
    }
    async getAllUsers(page, limit, userId) {
        console.log("getAllUsers");
        return await this.userRepo.findAllUsers(page, limit, userId);
    }
    async createOrGetChat(dto) {
        console.log("userMail", dto.userMail);
        const selectedUser = await this.userRepo.findUserByEmail(dto.userMail);
        if (!selectedUser) {
            throw new customError_1.AppError("User not found", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const currentUserId = new mongoose_1.Types.ObjectId(dto.currentUserId);
        const selectedUserId = selectedUser._id;
        const participantsKey = [
            currentUserId.toString(),
            selectedUserId.toString(),
        ]
            .sort()
            .join("_");
        console.log("selectedUser", selectedUser);
        // Check if chat exists already
        const existingChat = await this.chatRepo.findOneByUsers([
            currentUserId,
            selectedUserId,
        ]);
        console.log("existingChat", existingChat);
        if (existingChat) {
            return {
                success: true,
                message: "Existing chat found",
                data: existingChat,
            };
        }
        // Create new chat
        const newChat = await this.chatRepo.createChat({
            users: [
                currentUserId,
                selectedUserId,
            ],
            participantsKey,
            unreadCounts: new Map([
                [currentUserId.toString(), 0],
                [selectedUserId.toString(), 0],
            ]),
        });
        console.log("newChat", newChat);
        return { success: true, message: "Chat created", data: newChat };
    }
    async dataFetch(userId) {
        console.log("chatId", userId);
        const chatObjectId = new mongoose_1.Types.ObjectId(userId);
        console.log("chatObjectId", chatObjectId);
        const chat = await this.chatRepo.findByChatId(chatObjectId);
        console.log("chatservied", chat);
        if (!chat) {
            throw new customError_1.AppError("Chat not found", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return {
            success: true,
            message: "Messages fetched successfully",
            data: chat,
        };
    }
    async getAllChatsByUserId(userId) {
        console.log("getAllChatsByUserId", userId);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        if (!userObjectId) {
            throw new customError_1.AppError("chat's is not found", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return await this.chatRepo.findAllByUserId(userObjectId);
    }
    async sendRequest(senderId, receiverId) {
        console.log('sendRequest in AuthService sender', senderId);
        console.log('sendRequest in AuthService receiverId', receiverId);
        const existing = await this.chatRequestRepo.findRequest(senderId, receiverId);
        if (existing) {
            throw new customError_1.AppError("Request already exists between these users", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        return await this.chatRequestRepo.sendRequest(senderId, receiverId);
    }
    async getFindSentRequests(senderId) {
        return this.chatRequestRepo.FindSentRequests(senderId);
    }
    async getFindReceivedRequests(receiverId) {
        return this.chatRequestRepo.FindReceivedRequests(receiverId);
    }
    // async getPendingRequests(userId: string) {
    //   return await this.chatRepo.getPendingRequests(userId);
    // }
    async acceptRequest(requestId, userId) {
        console.log("acceptRequest in service");
        const request = await this.chatRequestRepo.findById(requestId);
        if (!request) {
            throw new customError_1.AppError("Chat request not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        // Only receiver can accept
        if (request.receiver.toString() !== userId) {
            throw new customError_1.AppError("You are not allowed to accept this request", httpStatus_1.HttpStatus.FORBIDDEN);
        }
        // Already accepted
        if (request.status === "accepted") {
            throw new customError_1.AppError("Request already accepted", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const senderId = new mongoose_1.Types.ObjectId(request.sender.toString());
        const receiverId = new mongoose_1.Types.ObjectId(request.receiver.toString());
        // Find existing chat
        const existingChat = await this.chatRepo.findOneByUsers([
            senderId,
            receiverId,
        ]);
        console.log("existingChat", existingChat);
        // If chat already exists, just accept request
        if (existingChat) {
            await this.chatRequestRepo.updateStatus(requestId, "accepted");
            return existingChat;
        }
        // Create consistent key
        const participantsKey = [
            senderId.toString(),
            receiverId.toString(),
        ]
            .sort()
            .join("_");
        // Accept request
        await this.chatRequestRepo.updateStatus(requestId, "accepted");
        // Create chat
        const chat = await this.chatRepo.createChat({
            users: [
                senderId,
                receiverId,
            ],
            participantsKey,
            unreadCounts: new Map([
                [senderId.toString(), 0],
                [receiverId.toString(), 0],
            ]),
        });
        console.log("chat", chat);
        return chat;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => user_repository_1.UserRepository)),
    __param(1, (0, typedi_1.Inject)(() => chat_repository_1.ChatRepository)),
    __param(2, (0, typedi_1.Inject)(() => chatRequestReposiotory_1.chatRequestRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ChatService);
exports.chatService = typedi_1.default.get(ChatService);
