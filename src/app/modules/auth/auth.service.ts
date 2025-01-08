import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
import { verify } from "crypto";

const loginUser = async (payload: TLoginUser) => {
  // check if user exists
  const user = await User.isUserExistsByEmail(payload?.email);

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
  // check the password is correct

  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  // cretae token and send it to the client

  const jwtPayload = {
    userEmail: user?.email,
    userRole: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changedPassowrd = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string }
) => {
  // check if user exists
  const user = await User.isUserExistsByEmail(userData?.userEmail);

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
  // check the password is correct

  if (!(await User.isPasswordMatch(payLoad.oldPassword, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  // hash the new password
  const newHashedPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: userData.userEmail,
      role: userData.userRole,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token: string) => {
  // check if the token is valid

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

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
    User.ifJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Password changed, please login again"
    );
  }
  // cretae token and send it to the client

  const jwtPayload = {
    userEmail: user?.email,
    userRole: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return { accessToken };
};

const forgotPassword = async (email: string) => {
  // check if user exists
  const user = await User.isUserExistsByEmail(email);

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

  const jwtPayload = {
    userEmail: user?.email,
    userRole: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUiLink = `${config.reset_password_ui_link}?email=${user.email}&token=${resetToken}`;

  sendEmail(user.email, resetUiLink);

  console.log(resetUiLink);
};

const resetPassword = async (
  payLoad: {
    email: string;
    newPassword: string;
  },
  token: string
) => {
  // check if user exists
  const user = await User.isUserExistsByEmail(payLoad.email);

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

  // check if the token is valid

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (decoded.userEmail !== user.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
  // hash the new password
  const newHashedPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.userEmail,
      role: decoded.userRole,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};

export const AuthService = {
  loginUser,
  changedPassowrd,
  refreshToken,
  forgotPassword,
  resetPassword,
};
