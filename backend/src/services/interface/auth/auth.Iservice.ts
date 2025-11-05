import { SignInDto, SignUpDto } from "../../../dto/user/auth.dtos";
import { AuthResponse, SignInResult } from "../../../types/type";

export interface IAuthService {
  signUp(data: SignUpDto): Promise<AuthResponse>;
  signIn(data:SignInDto):Promise<SignInResult>
}
