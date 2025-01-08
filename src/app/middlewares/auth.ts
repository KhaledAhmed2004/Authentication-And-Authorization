import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

// Middleware to authenticate the user
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token is not provided
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token is required");
    }

    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { userEmail, userRole, iat } = decoded;

    // check if user exists
    const user = await User.isUserExistsByEmail(userEmail);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // check if the user alredy deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    }

    // check the user is blocked
    const userStatus = user?.status;
    if (userStatus === "block") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
    }

    if (
      user.passwordChangedAt &&
      User.ifJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Password changed, please login again"
      );
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to access this resource"
      );
    }

    req.user = decoded as JwtPayload;
    // Proceed to the next middleware
    next();
  });
};

export default auth;
