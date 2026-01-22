import Container, { Service } from "typedi";
import {
  getAllDto,
  GetChatDto,
  SignInDto,
  SignUpDto,
} from "../../../dto/user/auth.dtos";
import {
  AuthResponse,
  giveChatResult,
  SignInResult,
} from "../../../Interfaces/Interfaces";
import { IAuthService } from "../../interface/auth/auth.Iservice";
import { IUser } from "../../../models/user.model";
import { IUserRepository } from "../../../repositories/interface/user/user.IRepository";
import { userRepository } from "../../../repositories/implementations/user.repository";
import { BaseRepository } from "../../../repositories/base.repository";
import { IRepository } from "../../../repositories/interface/base.Irepository";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";
import bcrypt, { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { id } from "zod/v4/locales";
import { ChatModel, IChat } from "../../../models/chat.modal";
import { chatRepository } from "../../../repositories/implementations/chat.repository";
// import  IBaseRepository  from "../../../repositories/interface/base.Irepository"; 
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { Types } from "mongoose";
// import BaseRepository  from "../../../repositories/base.repository";
@Service()
export class AuthService implements IAuthService {
  private userRepo: IUserRepository;
private chatRepo: IChatRepository<IChat>;
  // private chatRepo: IRepository<IChat>;
  constructor() {
    this.userRepo = userRepository;
    this.chatRepo = chatRepository;
  }

  async signUp(userData: SignUpDto): Promise<AuthResponse> {
    try {
      const { name, email, password, confirmPassword } = userData;
      console.log("service layer", name, email, password, confirmPassword);

      const existUser = await this.userRepo.findUserByEmail(email);

      if (existUser) {
        console.log("existUser is already exist");
        throw new AppError(
          "User already registered with this email , Please login...",
          HttpStatus.BAD_REQUEST
        );
      }
      console.log("exist", existUser);
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log("hashedPassword", hashedPassword);

      await this.userRepo.create({
        name,
        email,
        password: hashedPassword,
      } as IUser);

      return { message: "good", success: true };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async signIn(userData: SignInDto): Promise<SignInResult> {
    try {
      const { email, password } = userData;
      console.log("fifth",email);
      const exist = await this.userRepo.findUserByEmail(email);
      console.log(
        "existtttttttttttttttttttttttttttttttttttttttttttttttttt",
        exist
      );
      if (!exist) {
        throw new AppError("invalid credential", HttpStatus.BAD_REQUEST);
      }
      console.log("sixth");
      let comparePassword = await bcrypt.compare(password, exist.password);
      if (!comparePassword) {
        throw new AppError("invalide password", HttpStatus.BAD_REQUEST);
      }
      const accessToken = generateAccessToken({id: exist._id});
      const refreshToken = generateRefreshToken({id: exist._id});
      console.log("seventh");
      return {
        success: true,
        message: "signIn is succesfully complated",
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while signing in. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // async getAllUsers(): Promise<IUser[]> {
  //   console.log("service");
  //   return this.userRepo.findAllUsers();
  // }

  // async createOrGetChat(dto: GetChatDto): Promise<giveChatResult> {
  //   console.log("createOrGetChat", dto);
  //   const { userMail } = dto;
  //   console.log("email", userMail);
  //   const exist = await this.userRepo.findUserByEmail(userMail);
  //   console.log("exist", userMail);
  //   if (!exist) {
  //     throw new AppError("invalid credential", HttpStatus.BAD_REQUEST);
  //   }
  //   const Schat=await this.chatRepo.createChat({
  //     name:exist.name,
  //     email:exist.email,
  //     password:exist.password,
  //   }as IChat);

  //   return { success: true, message: "Chat created", data: Schat };
  // }

}

export const authService = Container.get(AuthService);
