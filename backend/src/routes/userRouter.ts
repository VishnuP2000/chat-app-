import { Router } from "express";
import {authControllers} from '../controllers/implementations/auth.controllers'
import upload  from "../config/Multer";



const userRouter = Router();
console.log('second')
userRouter.post("/signUp",  upload.single("image"),authControllers.signUp.bind(authControllers));
userRouter.post("/signIn",authControllers.signIn.bind(authControllers));
userRouter.post("/refresh-token", authControllers.refreshToken.bind(authControllers));  
userRouter.post("/me", authControllers.getCurrentUser.bind(authControllers));  

export default userRouter;
