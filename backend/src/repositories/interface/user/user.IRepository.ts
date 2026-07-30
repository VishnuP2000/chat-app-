import { GetUsersResult } from "../../../dto/user/auth.dtos";
import { IChat } from "../../../models/chat.modal";
import { IUser } from "../../../models/user.model";
import { IRepository } from "../base.Irepository";

export interface IUserRepository extends IRepository<IUser> {
  findUserByEmail(email: string): Promise<IUser | null | never>;
  //  findAllUsers(page:Number,limit:Number): Promise<IUser[]>;
   findAllUsers(page:number,limit:number):Promise<GetUsersResult>;
  //  findOtherUsers(email:string): Promise<IUser[]>
} 
