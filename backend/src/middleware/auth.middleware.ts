import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequset } from "../Interfaces/Interfaces";

export const verifyAccessToken = (
  req: AuthRequset,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    console.log("Access token cookie:", token);

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