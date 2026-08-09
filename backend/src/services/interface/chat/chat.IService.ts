import { GetChatDto, GetUsersResult } from "../../../dto/user/auth.dtos";
import { IUser } from "../../../models/user.model";
import { IChat } from "../../../models/chat.modal";
import { giveChatResult, SignInResult } from "../../../Interfaces/Interfaces";
import { IChatRequest } from "../../../models/chatRequest.modal";
export interface IChatService {
  getAllUsers(page:number,limit:number,userId:string): Promise<GetUsersResult>;
  createOrGetChat(dto: GetChatDto): Promise<giveChatResult>;
  dataFetch(userId: string): Promise<giveChatResult>;
  getAllChatsByUserId(userId: string): Promise<IChat[]>;
  sendRequest(senderId: string, receiverId: string): Promise<IChatRequest>;
  getFindSentRequests(senderId: string): Promise<IChatRequest[]>;
  getFindReceivedRequests(receiverId: string): Promise<IChatRequest[]>;
}
