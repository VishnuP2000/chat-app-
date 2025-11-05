import Container, { Service } from "typedi";
import { SignInDto, SignUpDto } from "../../../dto/user/auth.dtos";
import { AuthResponse, SignInResult } from "../../../types/type";
import { IAuthService } from "../../interface/auth/auth.Iservice";
import { IUser } from "../../../models/user.model";
import { IUserRepository } from "../../../repositories/interface/user/user.IRepository";
import { userRepository } from "../../../repositories/implementations/user.repository";
import { AppError } from "../../../utils/customError";
import { HttpStatus } from "../../../enum/httpStatus";
import bcrypt, { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { id } from "zod/v4/locales";
@Service()
export class AuthService implements IAuthService {
  private userRepo: IUserRepository;
  constructor() {
    this.userRepo = userRepository;
  }

  async signUp(userData: SignUpDto): Promise<AuthResponse> {
    try {
      const { name, email, password, confirmPassword } = userData;
      console.log('service layer',name, email, password, confirmPassword )

      const existUser = await this.userRepo.findUserByEmail(email);

      if (existUser) {
        throw new AppError(
          "User already registered with this email , Please login...",
          HttpStatus.BAD_REQUEST
        );
      }
      console.log('exist',existUser)
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log("hashedPassword",hashedPassword)

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
  async signIn(userData:SignInDto):Promise<SignInResult>{
    try {
      
      const {email,password}=userData
       console.log('fifth')
    const exist=await this.userRepo.findUserByEmail(email)
    console.log("existtttttttttttttttttttttttttttttttttttttttttttttttttt",exist)
    if(!exist){
      throw new AppError('invalid credential',HttpStatus.BAD_REQUEST)
    }
 console.log('sixth')
    let comparePassword=await bcrypt.compare(password,exist.password)
    if(!comparePassword){
      throw new AppError('invalide password',HttpStatus.BAD_REQUEST)
    }
    const accessToken=generateAccessToken({
      id:exist._id,
    })
    const refreshToken=generateRefreshToken({
      id:exist._id,
    })
     console.log('seventh')
    return {
      success:true,
      message:'signIn is succesfully complated',
      accessToken:accessToken,
      refreshToken:refreshToken,
      
    }
    } catch (error){
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while signing in. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
  }
}

export const authService = Container.get(AuthService);
