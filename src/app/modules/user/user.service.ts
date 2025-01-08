import { decode } from "punycode";
import { TCreateUser } from "./user.interface";
import { User } from "./user.model";
import { verifyToken } from "../auth/auth.utils";
import config from "../../config";

const createUserIntoDB = async (userData: TCreateUser) => {
  const create = await User.create(userData);
  return create;
};

const getAllUsersFromDB = async () => {
  const users = await User.find();
  return users;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

const getMe = async (userEmail: string, userRole: string) => {
  let result = null;
  if (userRole === "user") {
    result = await User.findOne({ userEmail });
  }
  if (userRole === "admin") {
    result = await User.findOne({ userEmail });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMe,
  changeStatus,
};
