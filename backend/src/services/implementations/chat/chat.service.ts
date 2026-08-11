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
    const currentUserId = new Types.ObjectId(dto.currentUserId);
const selectedUserId = selectedUser._id as Types.ObjectId;
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
       throw new AppError(
    "Request already exists between these users",
    HttpStatus.BAD_REQUEST
  );
    }

    return await this.chatRequestRepo.sendRequest(
      senderId,
      receiverId
    );
  }
  async getFindSentRequests(senderId: string): Promise<IChatRequest[]> {
    return this.chatRequestRepo.FindSentRequests(senderId);
}
  async getFindReceivedRequests(receiverId: string): Promise<IChatRequest[]> {
    return this.chatRequestRepo.FindReceivedRequests(receiverId);
}

  // async getPendingRequests(userId: string) {
  //   return await this.chatRepo.getPendingRequests(userId);
  // }

async acceptRequest(requestId: string,userId: string): Promise<IChat> {

  console.log("acceptRequest in service");

  const request = await this.chatRequestRepo.findById(requestId);

  if (!request) {
    throw new AppError(
      "Chat request not found",
      HttpStatus.NOT_FOUND
    );
  }

  // Only receiver can accept
  if (request.receiver.toString() !== userId) {
    throw new AppError(
      "You are not allowed to accept this request",
      HttpStatus.FORBIDDEN
    );
  }

  // Already accepted
  if (request.status === "accepted") {
    throw new AppError(
      "Request already accepted",
      HttpStatus.BAD_REQUEST
    );
  }

  const senderId = new Types.ObjectId(
    request.sender.toString()
  );

  const receiverId = new Types.ObjectId(
    request.receiver.toString()
  );

  // Find existing chat
  const existingChat = await this.chatRepo.findOneByUsers([
    senderId,
    receiverId,
  ]);

  console.log("existingChat", existingChat);

  // If chat already exists, just accept request
  if (existingChat) {

    await this.chatRequestRepo.updateStatus(
      requestId,
      "accepted"
    );

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
  await this.chatRequestRepo.updateStatus(
    requestId,
    "accepted"
  );

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

  // async rejectRequest(requestId: string) {
  //   await this.chatRepo.updateStatus(
  //     requestId,
  //     "rejected"
  //   );
  // }
}

export const chatService = Container.get(ChatService);
