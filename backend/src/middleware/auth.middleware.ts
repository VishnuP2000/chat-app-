import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/customError";
import { AuthRequset } from "../Interfaces/Interfaces";

interface TokenPayload {
  user: {
    id: string;
  };
}

// This middleware protects a route by verifying the access token
export const verifyAccessToken = ( req: AuthRequset, res: Response,next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('authMiddleware',authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN!) as TokenPayload;

    // const userId = decoded.user.id;
    // req.user = { id: userId };
console.log('complate the middlware')
next();
} catch (error) {
    console.log('get the middleware error,,,,,,,,,',error)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
