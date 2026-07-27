import { Request } from "express";
import { IChat } from "../models/chat.modal";

export interface AuthResponse {
  message: string;
  success: boolean;
  token?: string;
  email?: string;
  otp?: string;
}
export interface SignInResult extends AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  fullName?: string;
  role?: string;
  userId?: string;
  pic?: string;
  user:{
    image:string
    id:string,
    name:string,
    email:string
  }
}
export interface giveChatResult{
  message:string,
  success: boolean;
  data:IChat
}

export interface AuthRequset extends Request {
  user?: {
    id: string;
  };
}