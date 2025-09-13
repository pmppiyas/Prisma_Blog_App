import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import UserServices from "./user.services";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const User = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User create successfully",
      data: User,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully",
      data: users,
    });
  }
);

const UserController = {
  createUser,
  getAllUsers,
};
export default UserController;
