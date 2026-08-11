import { Types } from "mongoose";
import { IChat } from "../../../src/models/chat.modal";
import { IRepository } from "./base.Irepository";
import { IChatRequest } from "../../models/chatRequest.modal";

export interface IChatRepository<T> extends IRepository<T> {
  createChat(data: Partial<T>): Promise<T>;
  findOneByUsers(userIds: Types.ObjectId[]): Promise<T | null>;
  findByChatId(id: Types.ObjectId): Promise<T | null>;
  findAllByUserId(userId: Types.ObjectId): Promise<T[]>;
  updateAndPopulate(id: Types.ObjectId, update: Record<string, any>): Promise<T | null>;
  

}
