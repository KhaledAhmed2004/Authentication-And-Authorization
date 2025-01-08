import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import AppError from "../../errors/AppError";

const createUser = catchAsync(async (req, res) => {
  const userData = await req?.body;

  const user = await UserServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

const getAllUsersFromDB = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "List of users",
    data: users,
  });
});

const getSingleUserFromDB = catchAsync(async (req, res) => {
  console.log(req.cookies);
  const { id } = req.params;

  const user = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details",
    data: user,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userEmail, userRole } = req?.user;
  const user = await UserServices.getMe(userEmail, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved",
    data: user,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated",
    data: user,
  });
});

export const UserControllers = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMe,
  changeStatus,
};
