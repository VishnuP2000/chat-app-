// backend/src/controllers/implementations/chat.controllers.ts
import Container, { Inject, Service } from "typedi";
import { raw, Request, Response } from "express";
import { ChatService } from "../../services/implementations/chat/chat.service";
import { IChatService } from "../../services/interface/chat/chat.IService";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/customError";
import { HttpStatus } from "../../enum/httpStatus";
import { AuthRequset } from "../../Interfaces/Interfaces";
import { AuthRequest } from "../../middleware/auth.middleware";

@Service()
export class ChatControllers {
  constructor(
    @Inject(() => ChatService)
    private readonly chatservice: IChatService,
  ) {}

  async getUsers(req: AuthRequset, res: Response) {
    try {
      console.log("hello");
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const userId=req.user?.id
      console.log("userId", userId);
          if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
      console.log("page", page);
      console.log("limit", limit);
      const result = await this.chatservice.getAllUsers(page, limit ,userId);
      console.log("result.totalUsers", result.totalUsers);
      console.log("Math.ceil(result.totalUsers / limit)", Math.ceil(result.totalUsers / limit));
      return res.status(200).json({
        success: true,
        users: result.users,
        totalUsers: result.totalUsers,
        totalPages: Math.ceil(result.totalUsers / limit),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }

  async chatUsers(req: AuthRequset, res: Response) {
    try {
      console.log("chatUsers");
      const { userMail } = req.body;
      console.log("userMail", userMail);
      const currentUserId = req.user?.id; //
      console.log("currentUserId", currentUserId);

      if (!userMail) {
        return res
          .status(400)
          .json({ message: "userMail is required", success: false });
      }


      const chat = await this.chatservice.createOrGetChat({
        userMail,
        currentUserId,
      });
      console.log("chatcontroller", chat);

      return res.status(200).json({
        success: true,
        data: chat.data,
      });
    } catch (error) {
      console.log("err", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getChatUsers(req: AuthRequset, res: Response) {
    try {
      console.log("getMessage");
      const { chatId } = req.params;
      console.log("controller chatId", chatId);

      const chatData = await this.chatservice.dataFetch(chatId);

      console.log("chatData", chatData.data);

      return res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: chatData.data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch messages" });
    }
  }

  async getAllChats(req: AuthRequset, res: Response) {
    try {
      console.log("getAllChats");
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const chatsResult = await this.chatservice.getAllChatsByUserId(userId);
      console.log("chatsResult", chatsResult);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: chatsResult,
      });
    } catch (error) {
      console.error("Error fetching all chats:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch chats",
      });
    }
  }
  async sendRequest(req: AuthRequest, res: Response) {
    const senderId = req.user?.id
    const { receiverId } = req.body;
    console.log('senderId',senderId)
    console.log('receiverId',receiverId)
      if (!senderId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is required",
    });
  }
    const request = await this.chatservice.sendRequest(
        senderId,
        receiverId
    );
    console.log('request',request)

    return res.json({
        success: true,
        data:request,
    });
}
async getPendingRequests(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
      if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
    const requests =await this.chatservice.getFindSentRequests(userId);
    console.log('requests controller',requests)

    return res.json({
        success: true,
        data: requests,
    });
}
async getReceivedRequests(req:AuthRequest,res:Response) {
  try {
    console.log('enter the getReceivedRequest')
    const userId=req.user?.id
      if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
    const requests =await this.chatservice.getFindReceivedRequests(userId);
    console.log('requestsss',requests)
  return res.status(200).json({
    success: true,
    data: requests,
  });
  } catch (error) {
    
  }
}
// async acceptRequest(req: AuthRequest, res: Response) {
//     const { requestId } = req.params;

//     await this.chatRequestService.acceptRequest(requestId);

//     return res.json({
//         success: true,
//     });
// }
// async rejectRequest(req: AuthRequest, res: Response) {
//     const { requestId } = req.params;

//     await this.chatRequestService.rejectRequest(requestId);

//     return res.json({
//         success: true,
//     });
// }  
}

export const chatControllers = Container.get(ChatControllers);
