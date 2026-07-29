import { Response } from "express";
export const setCookies=(res:Response,type:string,token:string)=>{
    
res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax', 
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});


}