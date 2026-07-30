import { Types } from "mongoose";
import { IUser } from "../../models/user.model";

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  file:string;
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
  currentUserId: string | undefined;
}
export interface GetUsersResult {
  users: IUser[];
  totalUsers: number;
}
