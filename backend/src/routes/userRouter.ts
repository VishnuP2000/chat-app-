import { Router } from "express";
import {authControllers} from '../controllers/implementations/auth.controllers'



const userRouter = Router();
console.log('second')
userRouter.post("/signUp",authControllers.signUp.bind(authControllers));
userRouter.get("/signIn",authControllers.signIn.bind(authControllers));

export default userRouter;
