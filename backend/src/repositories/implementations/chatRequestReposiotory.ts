import { Service } from "typedi";
import { ChatRequestModel, IChatRequest } from "../../models/chatRequest.modal";
import { BaseRepository } from "../base.repository";
import { IChatRepository } from "../interface/chat.Irepository";
import { IChatRequestRepository } from "../interface/ChatRequest.IRepository";

@Service()
export class chatRequestRepository extends BaseRepository<IChatRequest> implements IChatRequestRepository<IChatRequest>{
    constructor(){
        super(ChatRequestModel) 
    }
          async sendRequest(senderId:string,receiverId:string):Promise<IChatRequest> {
      try {
        console.log('enter the findRequst 2',senderId)
        console.log('enter the findRequst 2',receiverId)
        return await this.model.create({
          sender:senderId,
          receiver:receiverId
        })
      } catch (error) {
         if (error instanceof Error) {
          throw new Error(`Database Error (updateAndPopulate): ${error.message}`);
        }
        throw new Error("Unknown error occurred in updateAndPopulate");
      }
    }
    async findRequest(senderId:string,receiverId:string):Promise<IChatRequest| null> {
      try {
        console.log('enter the findRequst',senderId)
        console.log('enter the findRequst',receiverId)
        return await this.model.findOne({
                $or: [
            {
              sender: senderId,
              receiver: receiverId,
            },
            {
              sender: receiverId,
              receiver: senderId,
            },
          ],
        })
      } catch (error) {
         if (error instanceof Error) {
          throw new Error(`Database Error (updateAndPopulate): ${error.message}`);
        }
        throw new Error("Unknown error occurred in updateAndPopulate");
      }
    }

}