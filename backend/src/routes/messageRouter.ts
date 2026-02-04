import { Router } from "express";
import { messagecontrollers} from "../controllers/implementations/messages.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";
import chatRouter from "./chatRouter";

const messageRouter=Router()

console.log('messageRouter')
messageRouter.post("/send", verifyAccessToken, messagecontrollers.sendMessage.bind(messagecontrollers));
messageRouter.get("/findUser/:chatId", verifyAccessToken, messagecontrollers.findUser.bind(messagecontrollers));

export default messageRouter