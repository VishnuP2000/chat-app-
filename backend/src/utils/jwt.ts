import jwt from "jsonwebtoken";
import dotenv from 'dotenv'


dotenv.config()
/**
 * Generate Access Token
 * @param user - user object (must include id)
 * @returns Signed JWT access token
 */
export const generateAccessToken = (user: object): string => {
  const secret_key = process.env.ACCESS_TOKEN;

  if (!secret_key) {
    throw new Error("ACCESS_TOKEN secret key is missing in environment variables");
  }

  return jwt.sign({ user:user }, secret_key, { expiresIn: "1h" });
};

/**
 * Generate Refresh Token
 * @param user - user object (must include id)
 * @returns Signed JWT refresh token
 */
export const generateRefreshToken = (user: object): string => {
  const refresh_key = process.env.REFRESH_TOKEN;

  if (!refresh_key) {
    throw new Error("REFRESH_TOKEN secret key is missing in environment variables");
  }

  return jwt.sign({ user:user }, refresh_key, { expiresIn: "7d" });
};
/**
 * Verify Access Token
 * @param token - JWT access token string
 * @returns Decoded payload if valid, otherwise null
 */
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN as string);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN as string);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};


