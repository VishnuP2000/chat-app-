import { giveChatResult } from "../../../Interfaces/Interfaces";

export interface IMessageService {
  foundMessages(chatId: string, content:string,senderId:string): Promise<giveChatResult>;
  findUserId(chatId: string): Promise<giveChatResult>;
  markMessagesRead(chatId: string, userId: string): Promise<giveChatResult>;
  markMessagesDelivered(chatId: string, userId: string): Promise<giveChatResult>;
}
