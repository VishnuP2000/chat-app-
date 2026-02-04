import Container, { Service } from "typedi";
import { IMessageService } from "../../interface/messages/message.IService";
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { chatRepository } from "../../../repositories/implementations/chat.repository";
import { IChat } from "../../../models/chat.modal";
import { giveChatResult } from "../../../Interfaces/Interfaces";
import { Types } from "mongoose";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";
import MessageModel from "../../../models/message.modal";

@Service()
export class messageService implements IMessageService {
  private chatRepo: IChatRepository<IChat>;
  constructor() {
    this.chatRepo = chatRepository;
  }
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
    const response = await this.chatRepo.findByChatId(messageObjectId);
    console.log("chatRepo response", response);

    if (!response) {
      throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
    }

    const receiverId = response.users.find(
      (u) => u._id.toString() !== senderId,
    )?._id;

    if (!receiverId) {
      throw new AppError("Receiver not foundd", HttpStatus.BAD_REQUEST);
    }

    console.log('create message')
    // 1️⃣ Create message
    const message = await MessageModel.create({
      chatId: messageObjectId,
      senderId: senderIdObjectId,
      content,
    });
console.log('message',message)
    // 2️⃣ Update chat
await this.chatRepo.updateById(messageObjectId, {
  $push: { messages: message._id },
  $set: { lastMessage: message._id },
  $inc: {
    [`unreadCounts.${receiverId.toString()}`]: 1,
  },
});
    console.log('return suceessss')
    return { success: true, message: "message send", data: response };
  }

  async findUserId(userChatId: string): Promise<giveChatResult> {
    console.log("findUser", userChatId);
    const usersUserChatId = new Types.ObjectId(userChatId);
    const response = await this.chatRepo.findByChatId(usersUserChatId);
    console.log('findUserId response',response)
    if (!response) {
      throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: "message send", data: response };
  }
}
export const messageservice = Container.get(messageService);
