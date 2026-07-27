import Container, { Inject, Service } from "typedi";
import {
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
import { UserRepository, userRepository } from "../../../repositories/implementations/user.repository";
import { BaseRepository } from "../../../repositories/base.repository";
import { IRepository } from "../../../repositories/interface/base.Irepository";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";
import bcrypt, { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { id } from "zod/v4/locales";
import { ChatModel, IChat } from "../../../models/chat.modal";
import { ChatRepository, chatRepository } from "../../../repositories/implementations/chat.repository";
// import  IBaseRepository  from "../../../repositories/interface/base.Irepository";
import { IChatRepository } from "../../../repositories/interface/chat.Irepository";
import { Types } from "mongoose";
import { uploadToCloudinary } from "../../../utils/CloudinaryUploads";
// import BaseRepository  from "../../../repositories/base.repository";
const fs=require('fs')
@Service()
export class AuthService implements IAuthService {
    constructor(
    @Inject(() => UserRepository)
    private readonly userRepo: IUserRepository,
    // @Inject(() => ChatRepository)
    // private readonly chatRepository: IChatRepository
  ) {}
  async signUp(userData: SignUpDto, file?: Express.Multer.File): Promise<AuthResponse> {
    try {
      const { name, email, password, confirmPassword } = userData;
      let Image;
      console.log("service layer", name, email, password, confirmPassword);
      console.log("file", file);
//      try {
//   if (file?.path) {
//     Image = await uploadToCloudinary(file.path);
//     fs.unlinkSync(file.path);
//   }
// } catch (error) {
//   if (file?.path && fs.existsSync(file.path)) {
//     fs.unlinkSync(file.path);
//   }

//   throw new AppError(
//     "Image upload failed",
//     HttpStatus.INTERNAL_SERVER_ERROR
//   );
// }

 if (file?.path) {
    Image = await uploadToCloudinary(file.path);
    fs.unlinkSync(file.path);
  }

      const existUser = await this.userRepo.findUserByEmail(email);
      console.log("existUser", existUser);

      if (existUser) {
        console.log("existUser is already exist");
        throw new AppError(
          "User already registered with this email , Please login...",
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log("hashedPassword", hashedPassword);

      await this.userRepo.create({
        image:Image,
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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async signIn(userData: SignInDto): Promise<SignInResult> {
    try {
      const { email, password } = userData;
      console.log("signIn in authService", email);
      const exist = await this.userRepo.findUserByEmail(email);
    
      if (!exist) {
        throw new AppError("invalid credential", HttpStatus.BAD_REQUEST);
      }
      let comparePassword = await bcrypt.compare(password, exist.password);
      if (!comparePassword) {
        throw new AppError("invalide password", HttpStatus.BAD_REQUEST);
      }
      const accessToken = generateAccessToken({ id: exist._id });
      const refreshToken = generateRefreshToken({ id: exist._id });
      console.log("exist",exist);
      return {
        success: true,
        message: "signIn is succesfully complated",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: exist._id.toString(),
          image:exist.image.url,
          name: exist.name,
          email: exist.email,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while signing in. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

//   async AllUsersfind(currentUserId: string): Promise<IUser[]> {
//   return this.userRepo.findAllUsers(currentUserId);
// }
}

export const authService = Container.get(AuthService);
