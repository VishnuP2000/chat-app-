import { Response } from "express";

// Sets only the refreshToken as an HTTP-only cookie.
// accessToken is now returned in the API response body.
export const setCookies = (
  res: Response,
  refreshToken: string
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
  };

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};