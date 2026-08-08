import Container, { Inject, Service } from "typedi";
import {
  getAllDto,
  GetChatDto,
  GetUsersResult,
  SignInDto,
  SignUpDto,
} from "../../../dto/user/auth.dtos";
import {
  AuthResponse,
  giveChatResult,
  SignInResult,
} from "../../../Interfaces/Interfaces";
import { IAuthService } from "../../interface/auth/auth.Iservice";
import { IUser } from "../../../models/user.model";
import { IUserRepository } from "../../../repositories/interface/user/user.IRepository";
import { UserRepository, userRepository } from "../../../repositories/implementations/user.repository";
import { BaseRepository } from "../../../repositories/base.repository";
import { IRepository } from "../../../repositories/interface/base.Irepository";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";
import bcrypt, { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { id } from "zod/v4/locales";
import { ChatModel, IChat } from "../../../models/chat.modal";
import { ChatRepository, chatRepository } from "../../../repositories/implementations/chat.repository";
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { Types } from "mongoose";
import { IChatService } from "../../interface/chat/chat.IService";
import { chatRequestRepository } from "../../../repositories/implementations/chatRequestReposiotory";
import { IChatRequestRepository } from "../../../repositories/interface/ChatRequest.IRepository";
import { IChatRequest } from "../../../models/chatRequest.modal";
@Service()
export class ChatService implements IChatService {
  constructor(
    @Inject(()=>UserRepository)
    private readonly userRepo:IUserRepository,
    @Inject(()=>ChatRepository)
    private readonly chatRepo:IChatRepository<IChat>,
    @Inject(()=>chatRequestRepository)
    private readonly chatRequestRepo:IChatRequestRepository<IChatRequest>
  ){}

  async getAllUsers(page:number,limit:number,userId:string): Promise<GetUsersResult>  {
    console.log("getAllUsers");
     return await this.userRepo.findAllUsers(page,limit,userId);
  }

  async createOrGetChat(dto: GetChatDto): Promise<giveChatResult> {
    console.log("userMail", dto.userMail);
    const selectedUser = await this.userRepo.findUserByEmail(dto.userMail);
    if (!selectedUser) {
      throw new AppError("User not found", HttpStatus.BAD_REQUEST);
    }
    console.log("selectedUser", selectedUser);
    // Check if chat exists already
    const existingChat = await this.chatRepo.findOneByUsers([
      new Types.ObjectId(dto.currentUserId),
      selectedUser._id as Types.ObjectId,
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
        new Types.ObjectId(dto.currentUserId),
        selectedUser._id as Types.ObjectId,
      ],
      unreadCounts: new Map([
        [dto.currentUserId, 0],
        [selectedUser._id.toString(), 0],
      ]),
    } as Partial<IChat>);
    console.log("newChat", newChat);

    return { success: true, message: "Chat created", data: newChat };
  }

  async dataFetch(userId: string): Promise<giveChatResult> {
    console.log("chatId", userId);
    const chatObjectId = new Types.ObjectId(userId);
    console.log("chatObjectId", chatObjectId);
    const chat = await this.chatRepo.findByChatId(chatObjectId);
    console.log("chatservied", chat);

    if (!chat) {
      throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      message: "Messages fetched successfully",
      data: chat,
    };
  }

  async getAllChatsByUserId(userId: string): Promise<IChat[]> {
    console.log("getAllChatsByUserId", userId);
    const userObjectId = new Types.ObjectId(userId);
    if (!userObjectId) {
      throw new AppError("chat's is not found", HttpStatus.BAD_REQUEST);
    }
    return await this.chatRepo.findAllByUserId(userObjectId);
  }
  
   async sendRequest(senderId: string, receiverId: string): Promise<IChatRequest> {
    console.log('sendRequest in AuthService sender',senderId)
    console.log('sendRequest in AuthService receiverId',receiverId)
    const existing = await this.chatRequestRepo.findRequest(
      senderId,
      receiverId
    );

    if (existing) {
      throw new Error("Request already exists.");
    }

    return await this.chatRequestRepo.sendRequest(
      senderId,
      receiverId
    );
  }
  async getFindSentRequests(senderId: string): Promise<IChatRequest[]> {
    return this.chatRequestRepo.FindSentRequests(senderId);
}

  // async getPendingRequests(userId: string) {
  //   return await this.chatRepo.getPendingRequests(userId);
  // }

  // async acceptRequest(requestId: string) {
  //   const request = await this.chatRepo.updateStatus(
  //     requestId,
  //     "accepted"
  //   );

  //   if (!request) {
  //     throw new Error("Request not found.");
  //   }

  //   await this.chatRepository.createChat([
  //     request.sender,
  //     request.receiver,
  //   ]);
  // }

  // async rejectRequest(requestId: string) {
  //   await this.chatRepo.updateStatus(
  //     requestId,
  //     "rejected"
  //   );
  // }
}

export const chatService = Container.get(ChatService);
