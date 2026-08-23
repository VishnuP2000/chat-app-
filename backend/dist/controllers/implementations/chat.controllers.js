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
exports.chatControllers = exports.ChatControllers = void 0;
// backend/src/controllers/implementations/chat.controllers.ts
const typedi_1 = __importStar(require("typedi"));
const chat_service_1 = require("../../services/implementations/chat/chat.service");
const customError_1 = require("../../utils/customError");
const httpStatus_1 = require("../../enum/httpStatus");
let ChatControllers = class ChatControllers {
    constructor(chatservice) {
        this.chatservice = chatservice;
    }
    async getUsers(req, res) {
        try {
            console.log("hello");
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const userId = req.user?.id;
            console.log("userId", userId);
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            console.log("page", page);
            console.log("limit", limit);
            const result = await this.chatservice.getAllUsers(page, limit, userId);
            console.log("result.totalUsers", result.totalUsers);
            console.log("Math.ceil(result.totalUsers / limit)", Math.ceil(result.totalUsers / limit));
            return res.status(200).json({
                success: true,
                users: result.users,
                totalUsers: result.totalUsers,
                totalPages: Math.ceil(result.totalUsers / limit),
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
    async chatUsers(req, res) {
        try {
            console.log("chatUsers");
            const { userMail } = req.body;
            console.log("userMail", userMail);
            const currentUserId = req.user?.id; //
            console.log("currentUserId", currentUserId);
            if (!userMail) {
                return res
                    .status(400)
                    .json({ message: "userMail is required", success: false });
            }
            const chat = await this.chatservice.createOrGetChat({
                userMail,
                currentUserId,
            });
            console.log("chatcontroller", chat);
            return res.status(200).json({
                success: true,
                data: chat.data,
            });
        }
        catch (error) {
            console.log("err", error);
            if (error instanceof customError_1.AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
    async getChatUsers(req, res) {
        try {
            console.log("getMessage");
            const { chatId } = req.params;
            console.log("controller chatId", chatId);
            const chatData = await this.chatservice.dataFetch(chatId);
            console.log("chatData", chatData.data);
            return res.status(200).json({
                success: true,
                message: "Messages fetched successfully",
                data: chatData.data,
            });
        }
        catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Failed to fetch messages" });
        }
    }
    async getAllChats(req, res) {
        try {
            console.log("getAllChats");
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const chatsResult = await this.chatservice.getAllChatsByUserId(userId);
            console.log("chatsResult", chatsResult);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                data: chatsResult,
            });
        }
        catch (error) {
            console.error("Error fetching all chats:", error);
            return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to fetch chats",
            });
        }
    }
    async sendRequest(req, res) {
        const senderId = req.user?.id;
        const { receiverId } = req.body;
        console.log('senderId', senderId);
        console.log('receiverId', receiverId);
        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }
        const request = await this.chatservice.sendRequest(senderId, receiverId);
        console.log('request', request);
        return res.json({
            success: true,
            data: request,
        });
    }
    async getPendingRequests(req, res) {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const requests = await this.chatservice.getFindSentRequests(userId);
        console.log('requests controller', requests);
        return res.json({
            success: true,
            data: requests,
        });
    }
    async getReceivedRequests(req, res) {
        try {
            console.log('enter the getReceivedRequest');
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const requests = await this.chatservice.getFindReceivedRequests(userId);
            console.log('requestsss', requests);
            return res.status(200).json({
                success: true,
                data: requests,
            });
        }
        catch (error) {
        }
    }
    async acceptRequest(req, res) {
        try {
            console.log('acceptRequest');
            const { requestId } = req.params;
            console.log('requestId', requestId);
            const userId = req.user?.id;
            console.log('userId', userId);
            if (!requestId) {
                return res.status(400).json({
                    success: false,
                    message: "Request ID is required",
                });
            }
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const chat = await this.chatservice.acceptRequest(requestId, userId);
            return res.status(200).json({
                success: true,
                message: "Request accepted and chat created",
                data: chat,
            });
        }
        catch (error) {
            console.error("Accept request error:", error);
            if (error instanceof customError_1.AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Failed to accept request",
            });
        }
        //     }
        //     async rejectRequest(req: AuthRequest, res: Response) {
        //     const { requestId } = req.params;
        //     await this.chatRequestService.rejectRequest(requestId);
        //     return res.json({
        //         success: true,
        //     });
        // }  
    }
};
exports.ChatControllers = ChatControllers;
exports.ChatControllers = ChatControllers = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => chat_service_1.ChatService)),
    __metadata("design:paramtypes", [Object])
], ChatControllers);
exports.chatControllers = typedi_1.default.get(ChatControllers);
