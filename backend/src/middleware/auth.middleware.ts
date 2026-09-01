import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/customError";
import { AuthRequset } from "../Interfaces/Interfaces";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// This middleware protects a route by verifying the access token
export const verifyAccessToken = (
  req: AuthRequset,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const authHeader = req.headers.authorization;
    // console.log("authMiddleware", authHeader);

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   console.log('Access token missing')
    //   throw new AppError("Access token missing", 401);
    // }

    // const token = authHeader.split(" ")[1];
    const token = req.cookies.accessToken;

    if (!token) {
  return res.status(401).json({
    success: false,
    message: "Access token missing",
  });
}

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!,) as jwt.JwtPayload;

    const userId = decoded.id;
    req.user = { id: String(userId) };
    // req.user = { id: decoded.user.id };
    console.log("complate the middlware");
    next();
  } catch (error) {
    console.log("get the middleware error,,,,,,,,,", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
