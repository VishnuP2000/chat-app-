import Container, { Service } from "typedi";
import MessageModel, { IMessage } from "../../models/message.modal";
import { BaseRepository } from "../base.repository";
import { IMessageRepository } from "../interface/message.IRepository";
import { Types } from "mongoose";

@Service()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async markAsRead(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.model.updateMany(
      { chatId, senderId: { $ne: userId }, readBy: { $ne: userId } },
      { 
        $addToSet: { readBy: userId },
        $set: { status: "read" }
      }
    ).exec();
  }

  async markAsDelivered(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.model.updateMany(
      { chatId, senderId: { $ne: userId }, status: "sent" },
      { $set: { status: "delivered" } }
    ).exec();
  }
}

export const messageRepository = Container.get(MessageRepository);
