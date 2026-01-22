import { giveChatResult } from "../../../Interfaces/Interfaces";

export interface IMessageService {
  foundMessages(chatId: string): Promise<giveChatResult>;
}
