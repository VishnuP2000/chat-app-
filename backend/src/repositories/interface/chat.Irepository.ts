import { Types } from "mongoose";
import { IChat } from "../../../src/models/chat.modal";
import { IRepository } from "./base.Irepository";

export interface IChatRepository<T> extends IRepository<T>{
  createChat(data: Partial<T>): Promise<T | never>;
  findOneByUsers(userIds: Types.ObjectId[]): Promise<T | null>;
  findByChatId(id: Types.ObjectId): Promise<T | null>;
  findAllByUserId(userId: Types.ObjectId): Promise<T[]>;
}