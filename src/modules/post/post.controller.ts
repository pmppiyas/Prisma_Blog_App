import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import PostServices from "./post.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const User = await PostServices.createPost(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post create successfully",
      data: User,
    });
  }
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await PostServices.getAllPost();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retreived successfully",
      data: posts,
    });
  }
);
export const PostController = {
  createPost,
  getAllPost,
};
