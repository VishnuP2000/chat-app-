import Container , {Service} from "typedi"
import { IMessageService } from "../../services/interface/messages/message.IService"
import { messageservice } from "../../services/implementations/messages/messages.service"
import { Request, Response } from "express"

@Service()
export class messageControllers{
    private messageservice:IMessageService
    constructor(){
        this.messageservice=messageservice
    }
      async getMessages(req: Request, res: Response) {
        try {
          console.log("ControllergetMessages");
          const {chatId}=req.body
          console.log("chatId",chatId);
          const users = await this.messageservice.foundMessages(chatId);
          console.log("get users");
          return res.status(200).json({
            success: true,
            users,
          });
        } catch (error) {
          console.error("Error fetching users:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
          });
        }
      }

}
export const messagecontrollers=Container.get(messageControllers)