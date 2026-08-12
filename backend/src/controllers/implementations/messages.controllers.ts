import Container, { Inject, Service } from "typedi";
import { IMessageService } from "../../services/interface/messages/message.IService";
import { messageService } from "../../services/implementations/messages/messages.service";
import { ChatService } from "../../services/implementations/chat/chat.service";
import { IChatService } from "../../services/interface/chat/chat.IService";
import { Request, Response } from "express";
import { AuthRequset } from "../../Interfaces/Interfaces";

@Service()
export class messageControllers {
  constructor(
    @Inject(()=>messageService)
    private readonly messageservice:IMessageService,
  ){}
  async sendMessage(req: AuthRequset, res: Response) {
    try {
      console.log("ControllersendMessage");
      const { chatId, content } = req.body.payload;
      const senderId = req.user!.id;
      console.log("senderId", senderId);
      console.log("chatId", chatId);
      console.log("content", content);
      const users = await this.messageservice.foundMessages(
        chatId,
        content,
        senderId,
      );
      console.log("get users", users.data);
      return res.status(200).json({
        success: true,
        data:users.data,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    } 
  }

  async findUser(req: Request, res: Response) {
    try {
      console.log("findUsers");
      const { chatId } = req.params;
      console.log("userChatId", chatId);
      const result = await this.messageservice.findUserId(chatId);
      console.log("messageControllerUserChatId", result.data);

      return res.status(200).json({
        success: true,
        data: result.data,
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
export const messagecontrollers = Container.get(messageControllers);
