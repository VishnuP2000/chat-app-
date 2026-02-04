import Container, { Service } from "typedi";
import { ChatModel, IChat } from "../../models/chat.modal";
import { BaseRepository } from "../base.repository";
import { IChatRepository } from "../interface/chat.Irepository";
import { Types } from "mongoose";

@Service()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository<IChat> {
  constructor() {
    super(ChatModel);
  }

  async createChat(data: Partial<IChat>): Promise<IChat> {
    try {
      return await this.model.create(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database Error (create): ${error.message}`);
      }
      throw new Error("Unknown error occurred in create");
    }
  }

  async findOneByUsers(userIds: Types.ObjectId[]): Promise<IChat | null> {
    try {
      return await this.model.findOne({
        users: { $all: userIds }
      }).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database Error (findOneByUsers): ${error.message}`);
      }
      throw new Error("Unknown error occurred in findOneByUsers");
    }
  }
async findByChatId(id: Types.ObjectId): Promise<IChat | null> {
  try {
    console.log('findByChatId',id)
    return await this.model.findById(id)
    .populate({
      path: "users",
      select: "name email"
    })
    .populate({
      path: "messages",
      populate: {
        path: "senderId",
        select: "name email"
      }
    })
    .populate({
      path: "lastMessage",
      select: "content senderId createdAt"
    })
    .exec();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Database Error (findById): ${error.message}`);
    }
    throw new Error("Unknown error occurred in findById");
  }
}

// async findupdateById( id: Types.ObjectId,update: Record<string, any>,): Promise<IChat | null> {
//   try {
//     console.log('updateById')
//     return await this.model.updateById(id,update,{ new: true }).exec();
//   } catch (error) {
//           if (error instanceof Error) {
//         throw new Error(`Database Error (findOneByUsers): ${error.message}`);
//       }
//       throw new Error("Unknown error occurred in findOneByUsers");
//   }
// }

async findAllByUserId(userId: Types.ObjectId): Promise<IChat[]> {
  try {
    return await this.model.find({
      users: userId
    })
    .populate({
      path: "users",
      select: "name email"
    })
    .populate({
      path: "lastMessage",
      select: "content createdAt"
    })
    .sort({ updatedAt: -1 })
    .exec();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Database Error (findAllByUserId): ${error.message}`);
    }
    throw new Error("Unknown error occurred in findAllByUserId");
  }
}

}

export const chatRepository = Container.get(ChatRepository);