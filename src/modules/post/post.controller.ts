import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import PostServices from "./post.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data) || req.body;
    const payload = {
      ...parsedData,
      thumbnail: req?.file?.path,
    };
    const post = await PostServices.createPost(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post create successfully",
      data: post,
    });
  }
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const isFeatured =
      typeof req.query.isFeatured === "string"
        ? req.query.isFeatured === "true"
        : undefined;
    const author = Number(req.query.author) || undefined;

    const posts = await PostServices.getAllPost({
      page,
      limit,
      search,
      isFeatured,
      author,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retreived successfully",
      data: posts,
    });
  }
);

const getAPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await PostServices.getAPost(Number(req.params.id));

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "This post retreived successfully",
      data: posts,
    });
  }
);

const updateAPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.updatePost(
      Number(req.params.id),
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post update successfully",
      data: result,
    });
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.deletePost(Number(req.params.id));

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post update successfully",
      data: result,
    });
  }
);

export const PostController = {
  createPost,
  getAllPost,
  getAPost,
  updateAPost,
  deletePost,
};
