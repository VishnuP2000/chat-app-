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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepository = exports.ChatRepository = void 0;
const typedi_1 = __importStar(require("typedi"));
const chat_modal_1 = require("../../models/chat.modal");
const base_repository_1 = require("../base.repository");
let ChatRepository = class ChatRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chat_modal_1.ChatModel);
    }
    async createChat(data) {
        try {
            console.log('createChat');
            return await this.model.create(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (create): ${error.message}`);
            }
            throw new Error("Unknown error occurred in create");
        }
    }
    async findOneByUsers(userIds) {
        try {
            const participantsKey = userIds
                .map(id => id.toString())
                .sort()
                .join("_");
            return await this.model
                .findOne({ participantsKey })
                .exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (findOneByUsers): ${error.message}`);
            }
            throw new Error("Unknown error occurred in findOneByUsers");
        }
    }
    async findByChatId(id) {
        try {
            console.log('findByChatId', id);
            return await this.model.findById(id)
                .populate({
                path: "users",
                select: "name email"
            })
                .populate({
                path: "messages",
                select: "content senderId status createdAt",
                populate: {
                    path: "senderId",
                    select: "name email _id ",
                },
            })
                .populate({
                path: "lastMessage",
                select: "content senderId createdAt"
            })
                .exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (findById): ${error.message}`);
            }
            throw new Error("Unknown error occurred in findById");
        }
    }
    async updateAndPopulate(id, update) {
        try {
            return await this.model.findByIdAndUpdate(id, update, { new: true })
                .populate({
                path: "users",
                select: "name email"
            })
                .populate({
                path: "messages",
                select: "content senderId status createdAt",
                populate: {
                    path: "senderId",
                    select: "name email",
                },
            })
                .populate({
                path: "lastMessage",
                select: "content senderId createdAt"
            })
                .exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (updateAndPopulate): ${error.message}`);
            }
            throw new Error("Unknown error occurred in updateAndPopulate");
        }
    }
    async findAllByUserId(userId) {
        try {
            return await this.model.find({
                users: userId
            })
                .populate({
                path: "users",
                select: "name email"
            })
                .populate({
                path: "messages",
                select: "content senderId status createdAt",
                populate: {
                    path: "senderId",
                    select: "name email",
                },
            })
                .populate({
                path: "lastMessage",
                select: "content senderId createdAt"
            })
                .exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (findAllByUserId): ${error.message}`);
            }
            throw new Error("Unknown error occurred in findAllByUserId");
        }
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ChatRepository);
exports.chatRepository = typedi_1.default.get(ChatRepository);
