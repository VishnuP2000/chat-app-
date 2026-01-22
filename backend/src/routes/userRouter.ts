import { Router } from "express";
import {authControllers} from '../controllers/implementations/auth.controllers'



const userRouter = Router();
console.log('second')
userRouter.post("/signUp",authControllers.signUp.bind(authControllers));
userRouter.post("/signIn",authControllers.signIn.bind(authControllers));
userRouter.post("/refresh-token", authControllers.refreshToken.bind(authControllers));  

export default userRouter;
