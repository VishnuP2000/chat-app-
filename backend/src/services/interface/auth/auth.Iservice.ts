import { SignInDto, SignUpDto,GetChatDto } from "../../../dto/user/auth.dtos";
import { IUser } from "../../../models/user.model";
import { AuthResponse, SignInResult, giveChatResult } from "../../../Interfaces/Interfaces";
import { IChat } from "../../../models/chat.modal";

export interface IAuthService {
  signUp(data: SignUpDto): Promise<AuthResponse>;
  signIn(data:SignInDto):Promise<SignInResult>
  // getAllUsers(): Promise<IUser[]>;
  // createOrGetChat(data: GetChatDto): Promise<giveChatResult>;
}
