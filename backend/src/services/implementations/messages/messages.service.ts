import Container ,{Service} from "typedi";
import { IMessageService } from "../../interface/messages/message.IService";
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { chatRepository } from "../../../repositories/implementations/chat.repository";
import { IChat } from "../../../models/chat.modal";
import { giveChatResult } from "../../../Interfaces/Interfaces";
import { Types } from "mongoose";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";



@Service()
export class messageService implements IMessageService {
private chatRepo:IChatRepository<IChat>
constructor(){
    this.chatRepo=chatRepository
}
async foundMessages(chatId: string): Promise<giveChatResult>{
console.log('founderMessageService',chatId)
    const messageObjectId = new Types.ObjectId(chatId);
    console.log('messageObjectId',messageObjectId)
const response= await this.chatRepo.findByChatId(messageObjectId)
console.log('chatRepo response',response)
          if (!response) {
    throw new AppError("Chat not found", HttpStatus.BAD_REQUEST);
  }
    return {success: true, message: "Chat created", data: response};
}
}
export const messageservice=Container.get(messageService)