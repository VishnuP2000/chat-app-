import { Router } from "express";
import { chatControllers } from "../controllers/implementations/chat.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";




const chatRouter = Router();

chatRouter.get("/users", verifyAccessToken, chatControllers.getUsers.bind(chatControllers));
chatRouter.post("/create", verifyAccessToken, chatControllers.chatUsers.bind(chatControllers));  
chatRouter.get("/chatData/:chatId", verifyAccessToken, chatControllers.getChatUsers.bind(chatControllers));
chatRouter.get("/all", verifyAccessToken, chatControllers.getAllChats.bind(chatControllers));
chatRouter.post("/request", verifyAccessToken, chatControllers.sendRequest.bind(chatControllers));
chatRouter.get("/request", verifyAccessToken, chatControllers.getPendingRequests.bind(chatControllers));
chatRouter.get("/request/received", verifyAccessToken, chatControllers.getReceivedRequests.bind(chatControllers));
chatRouter.patch("/request/:requestId/accept", verifyAccessToken, chatControllers.acceptRequest.bind(chatControllers));
// chatRouter.patch("/request/:requestId/reject", verifyAccessToken, chatControllers.rejectRequest.bind(chatControllers));



export default chatRouter;
