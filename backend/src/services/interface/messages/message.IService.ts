import { giveChatResult, giveMessageResult } from "../../../Interfaces/Interfaces";

export interface IMessageService {
  foundMessages(chatId: string, content:string,senderId:string): Promise<giveChatResult>;
  findUserId(userChatId: string): Promise<giveMessageResult>;
  markMessagesRead(chatId: string, userId: string): Promise<giveChatResult>;
  markMessagesDelivered(chatId: string, userId: string): Promise<giveChatResult>;
}
