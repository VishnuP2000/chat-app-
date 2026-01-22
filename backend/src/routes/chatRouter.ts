import { Router } from "express";
import { chatControllers } from "../controllers/implementations/chat.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";




const chatRouter = Router();

chatRouter.get("/users", verifyAccessToken, chatControllers.getUsers.bind(chatControllers));
chatRouter.post("/create", verifyAccessToken, chatControllers.chatUsers.bind(chatControllers));  
chatRouter.get("/chatData/:chatId", verifyAccessToken, chatControllers.getChatUsers.bind(chatControllers));
chatRouter.get("/all", verifyAccessToken, chatControllers.getAllChats.bind(chatControllers));



export default chatRouter;
