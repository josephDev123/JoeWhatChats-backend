import { Request, Response, NextFunction } from "express";
import tokenIsVerify from "../utils/VerifyToken";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { GlobalError } from "../utils/globalError";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const tokenHeader = req.headers.cookie;
    // console.log("from cookie", tokenHeader);
    const tokenHeader = await req.cookies.token; // Access the token from cookies
    console.log("from cookie2", tokenHeader);

    // const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      throw new GlobalError("token not provided", "TokenError", 403, true);
    }

    // verify the token
    const verifyToken = await tokenIsVerify(tokenHeader ? tokenHeader : "");

    next();
  } catch (error: any) {
    // Handle any errors that occur within the try block here.
    console.log(error.message);
    if (error?.message === "jwt expired") {
      throw new GlobalError("jwt expired", "TokenError", 403, true);
    } else if (error?.message === "jwt malformed") {
      throw new GlobalError(
        "Json Web Token error/improper jwt structure",
        "TokenError",
        403,
        true
      );
    } else {
      throw new GlobalError("server internal error", "ServerError", 500, false);
    }
  }
}
