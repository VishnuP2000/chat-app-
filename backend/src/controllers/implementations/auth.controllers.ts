import Container, { Service } from "typedi";
import { Request, response, Response } from "express";
import { IAuthService } from "../../services/interface/auth/auth.Iservice";
import { authService } from "../../services/implementations/auth/auth.service";
import { registerSchema, signInSchema } from "../../validations/user.Zvalidations";
import { HttpStatus } from "../../enum/httpStatus";
import { success } from "zod";
import { setCookies } from "../../utils/cookies.utils";
import { AppError } from "../../utils/customError";
@Service()
export class AuthControllers {
  private authservice: IAuthService;
  constructor() {
    this.authservice = authService;
  }
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      console.log('res',req.body)
      const validationCheck = registerSchema.safeParse(req.body);
      if (!validationCheck.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: validationCheck.error,
        });
      }

      const response = await this.authservice.signUp(req.body);
      console.log('res',response)

      return res.status(201).json(response); // <- IMPORTANT
    } catch (error) {
      return res.status(500).json({error, message: "something wrong" });
    }
  }
  async signIn(req:Request,res:Response):Promise<Response>{
    try {
      console.log('third')
      const signInValidation = signInSchema.safeParse(req.body)
      console.log('fourth',signInValidation)
      if(!signInValidation.success){
        return res.status(HttpStatus.BAD_REQUEST).json({
          success:false,
          message:signInValidation.error
        })

      }

      const response=await this.authservice.signIn(req.body)
     
 console.log('eigth')
      setCookies(res, "refreshToken", String(response.refreshToken));

      console.log('suceeeeeeeeee')

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Sign in successfully completed",
      accessToken: response.accessToken,
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
    });
   
  }catch(error){
    if(error instanceof AppError){
      return res.status(error.statusCode).json({message:error.message,success:false})
    }
    console.log('signin error',error)
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
  }
}
}


export const authControllers = Container.get(AuthControllers);
