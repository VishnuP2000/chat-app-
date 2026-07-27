import { SignInDto, SignUpDto } from "../../../dto/user/auth.dtos";
import { AuthResponse, SignInResult } from "../../../Interfaces/Interfaces";

export interface IAuthService {
  signUp(data: SignUpDto,file?:Express.Multer.File): Promise<AuthResponse>;
  signIn(data:SignInDto):Promise<SignInResult>

}
