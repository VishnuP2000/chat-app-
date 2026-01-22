import { Router } from "express";
import { messagecontrollers} from "../controllers/implementations/messages.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";
import chatRouter from "./chatRouter";

const messageRouter=Router()

console.log('messageRouter')
messageRouter.get("/getMessages", verifyAccessToken, messagecontrollers.getMessages.bind(messagecontrollers));

export default messageRouter