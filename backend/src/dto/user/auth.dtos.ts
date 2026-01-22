import { Types } from "mongoose";

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface SignInDto {
  email: string;
  password: string;
}
export interface getAllDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface GetChatDto {
  userMail: string;
  currentUserId: string
}

