"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRequestRepository = void 0;
const typedi_1 = require("typedi");
const chatRequest_modal_1 = require("../../models/chatRequest.modal");
const base_repository_1 = require("../base.repository");
let chatRequestRepository = class chatRequestRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chatRequest_modal_1.ChatRequestModel);
    }
    async sendRequest(senderId, receiverId) {
        try {
            console.log("enter the findRequst 2", senderId);
            console.log("enter the findRequst 2", receiverId);
            return await this.model.create({
                sender: senderId,
                receiver: receiverId,
                status: "pending",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (updateAndPopulate): ${error.message}`);
            }
            throw new Error("Unknown error occurred in updateAndPopulate");
        }
    }
    async findRequest(senderId, receiverId) {
        try {
            console.log("enter the findRequst", senderId);
            console.log("enter the findRequst", receiverId);
            return await this.model.findOne({
                $or: [
                    {
                        sender: senderId,
                        receiver: receiverId,
                    },
                    {
                        sender: receiverId,
                        receiver: senderId,
                    },
                ],
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (updateAndPopulate): ${error.message}`);
            }
            throw new Error("Unknown error occurred in updateAndPopulate");
        }
    }
    async FindSentRequests(senderId) {
        return await chatRequest_modal_1.ChatRequestModel.find({
            sender: senderId,
        });
    }
    async FindReceivedRequests(receiverId) {
        return await chatRequest_modal_1.ChatRequestModel.find({
            receiver: receiverId,
        });
    }
    async updateStatus(requestId, status) {
        try {
            return await this.model.findByIdAndUpdate(requestId, { status }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (updateStatus): ${error.message}`);
            }
            throw new Error("Unknown error occurred in updateStatus");
        }
    }
};
exports.chatRequestRepository = chatRequestRepository;
exports.chatRequestRepository = chatRequestRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], chatRequestRepository);
