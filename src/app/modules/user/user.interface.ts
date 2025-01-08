import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TCreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: "user" | "admin";
  status: "active" | "block";
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;


export interface UserModel extends Model<TCreateUser> {
  isUserExistsByEmail(email: string): Promise<TCreateUser>;
  isPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  ifJWTIssuedBeforePasswordChanged:(passwordChangedTimestamp:Date, jwtIccsuTimestamp:number)=>boolean;
}
