import { IChatRequest } from "../../models/chatRequest.modal";
import { IRepository } from "./base.Irepository";


export interface IChatRequestRepository<T> extends IRepository<T>{
  sendRequest(senderId: string, receiverId: string): Promise<IChatRequest>;
  findRequest(senderId: string, receiverId: string): Promise<IChatRequest| null>;
 FindSentRequests(senderId: string): Promise<IChatRequest[]>;
 FindReceivedRequests(receiverId: string): Promise<IChatRequest[]>;
}