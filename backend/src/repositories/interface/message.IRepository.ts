import { Types } from "mongoose";
import { IRepository } from "./base.Irepository";
import { IMessage } from "../../models/message.modal";

export interface IMessageRepository extends IRepository<IMessage> {
  markAsRead(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
  markAsDelivered(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
}
