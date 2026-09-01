import Container, { Inject, Service } from "typedi";
import { Request, response, Response } from "express";
import { IAuthService } from "../../services/interface/auth/auth.Iservice";
import { AuthService } from "../../services/implementations/auth/auth.service";
import {
  registerSchema,
  signInSchema,
} from "../../validations/user.Zvalidations";
import { HttpStatus } from "../../enum/httpStatus";
import { setCookies } from "../../utils/cookies.utils";
import { AppError } from "../../utils/customError";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/jwt";

@Service()
export class AuthControllers {
  constructor(
    @Inject(() => AuthService)
    private readonly authService: IAuthService,
  ) {}
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      console.log("requu", req.body);
      console.log("requu", req.file);
      let image;
      const validationCheck = registerSchema.safeParse(req.body);

      if (!validationCheck.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: validationCheck.error,
        });
      }
      console.log("after complate validations");
      const response = await this.authService.signUp(req.body, req.file);
      console.log("res", response);

      return res.status(201).json({ data: response }); // <- IMPORTANT
    } catch (error) {
      // return res.status(500).json({error, message: "something wrong" });
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in signup:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async signIn(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      console.log(" email, password", email, password);
      const signInValidation = signInSchema.safeParse(req.body);
      console.log("signInValidation", signInValidation);
      if (!signInValidation.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: signInValidation.error,
        });
      }

      const response = await this.authService.signIn({ email, password });

      console.log("response auth.controller", response);
// Only set refreshToken in HTTP-only cookie; return accessToken in response body
setCookies(res, String(response.refreshToken));

      console.log("suceeeeeeeeee");

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Sign in successfully completed",
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.log("signin error", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      console.log("Refresh cookie:", req.cookies);
      console.log("Refresh token:", req.cookies.refreshToken);
      console.log("controller refreshtoken", token);
      if (!token) {
        throw new AppError("Refresh token missing", 401);
      }

const decoded = jwt.verify(
  token,
  process.env.REFRESH_TOKEN!
) as { user: string };

const newAccessToken = generateAccessToken(decoded.user);

// Keep refreshToken cookie alive; return new accessToken in body
setCookies(res, token);

return res.status(200).json({
  success: true,
  message: "Access token refreshed",
  accessToken: newAccessToken,
});
    } catch (error) {
      console.error("Refresh token error:", error);

      return res.status(401).json({
        message: "Invalid refresh token",
        error,
      });
    }
  }
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
  try {
    // accessToken is now in Authorization: Bearer header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN!
    ) as { id: string };
    console.log('decoded in getCurrentUser', decoded);

    return res.status(200).json({
      success: true,
      userId: decoded.id,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}
}

export const authControllers = Container.get(AuthControllers);
