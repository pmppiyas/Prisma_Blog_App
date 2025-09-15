import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.services";

const loginByCredential = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await AuthServices.loginByCredential(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Login successfully",
      data: login,
    });
  }
);

export const AuthController = {
  loginByCredential,
};
