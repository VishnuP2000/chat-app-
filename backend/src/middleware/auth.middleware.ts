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
    // accessToken is now sent via Authorization: Bearer header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN!
    ) as jwt.JwtPayload;

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

    next();

  } catch (error) {
    console.error("Access token error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};