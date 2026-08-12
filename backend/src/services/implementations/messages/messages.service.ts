import Container, { Inject, Service } from "typedi";
import { IMessageService } from "../../interface/messages/message.IService";
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { ChatRepository } from "../../../repositories/implementations/chat.repository";
import { IMessageRepository } from "../../../repositories/interface/message.IRepository";
import { MessageRepository } from "../../../repositories/implementations/message.repository";
import { IChat } from "../../../models/chat.modal";
import { giveChatResult, giveMessageResult } from "../../../Interfaces/Interfaces";
import { Types } from "mongoose";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";

@Service()
export class messageService implements IMessageService {
  constructor(
    @Inject(()=>ChatRepository)
    private readonly chatRepo:IChatRepository<IChat>, 
    @Inject(()=>MessageRepository)
    private readonly messageRepo:IMessageRepository,
  ){}

  async foundMessages(
    chatId: string,
    content: string,
    senderId: string,
  ): Promise<giveChatResult> {
    console.log("founderMessageService chatId", chatId);
    console.log("founderMessageService content", content);
    console.log("founderMessageService senderId", senderId);
    const messageObjectId = new Types.ObjectId(chatId);
    const senderIdObjectId = new Types.ObjectId(senderId);
    console.log("messageObjectId", messageObjectId);
    
    // 1️⃣ Fast lookup just to verify chat exists and get users
    const existingChat = await (this.chatRepo as any).findById(chatId);

    if (!existingChat) {
      throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
    }

    const receiverId = existingChat.users.find(
      (u: any) => u.toString() !== senderId,
    );

    if (!receiverId) {
      throw new AppError("Receiver not foundd", HttpStatus.BAD_REQUEST);
    }

    console.log("create message via messageRepo");
    // 1️⃣ Create message using repository
    const message = await this.messageRepo.create({
      chatId: messageObjectId,
      senderId: senderIdObjectId,
      content,
      status: "sent",
      readBy: [senderIdObjectId]
    } as any);
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
      throw new AppError("Chat not found after update", HttpStatus.BAD_REQUEST);
    }

    console.log("return success");
    return { success: true, message: "message send", data: updatedChat };
  }

  async findUserId(userChatId: string): Promise<giveMessageResult> {
    console.log("findUser", userChatId);
    const usersUserChatId = new Types.ObjectId(userChatId);
    const response = await this.chatRepo.findByChatId(usersUserChatId);
    console.log('findUserId response',response)
    if (!response) {
      throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: "message send", data: response };
  }

  async markMessagesRead(chatId: string, userId: string): Promise<giveChatResult> {
    console.log("markMessagesRead service", chatId, userId);
    const chatObjectId = new Types.ObjectId(chatId);
    const userObjectId = new Types.ObjectId(userId);

    await this.messageRepo.markAsRead(chatObjectId, userObjectId);

    await this.chatRepo.updateById(chatObjectId, {
      $set: { [`unreadCounts.${userId}`]: 0 }
    });

    const updatedChat = await this.chatRepo.findByChatId(chatObjectId);
    if (!updatedChat) {
      throw new AppError("Chat not found after read update", HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: "Messages marked as read", data: updatedChat };
  }

  async markMessagesDelivered(chatId: string, userId: string): Promise<giveChatResult> {
    console.log("markMessagesDelivered service", chatId, userId);
    const chatObjectId = new Types.ObjectId(chatId);
    const userObjectId = new Types.ObjectId(userId);

    await this.messageRepo.markAsDelivered(chatObjectId, userObjectId);

    const updatedChat = await this.chatRepo.findByChatId(chatObjectId);
    if (!updatedChat) {
      throw new AppError("Chat not found after delivery update", HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: "Messages marked as delivered", data: updatedChat };
  }
}
export const messageservice = Container.get(messageService);
