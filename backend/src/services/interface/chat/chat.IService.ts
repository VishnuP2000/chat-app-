import { GetChatDto } from "../../../dto/user/auth.dtos";
import { IUser } from "../../../models/user.model";
import { IChat } from "../../../models/chat.modal";
import { giveChatResult, SignInResult } from "../../../Interfaces/Interfaces";
export interface IChatService {
  getAllUsers(): Promise<IUser[]>;
  createOrGetChat(dto: GetChatDto): Promise<giveChatResult>;
  dataFetch(userId: string): Promise<giveChatResult>;
  getAllChatsByUserId(userId: string): Promise<IChat[]>;
}
