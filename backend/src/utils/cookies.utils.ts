import { Response } from "express";
export const setCookies=(res:Response,type:string,token:string)=>{
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,                       // true in prod (requires HTTPS)
    sameSite: isProduction ? "none" : "lax",     // "none" needed for cross-site in prod
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });


}