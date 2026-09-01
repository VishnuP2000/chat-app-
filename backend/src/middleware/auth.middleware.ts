import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const verifyAccessToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    console.log("authMiddleware token:", token ? "present" : "missing");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN!
    ) as jwt.JwtPayload;

    console.log("Decoded token:", decoded);

    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    req.user = {
      id: String(userId),
    };

    console.log("Authenticated user:", req.user);

    next();

  } catch (error) {
    console.error("Access token error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};