import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import PostServices from "./post.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AppError } from "../../error/appError";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let parsedData;

    if (typeof req.body.data === "string") {
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (err) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Invalid JSON in 'data' field"
        );
      }
    } else {
      parsedData = req.body;
    }

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
    const tags =
      typeof req.query.tags === "string"
        ? req.query.tags.split(",").map((tag) => tag.trim())
        : [];
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) || "asc";

    const posts = await PostServices.getAllPost({
      page,
      limit,
      search,
      isFeatured,
      author,
      tags,
      sortBy,
      sortOrder,
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

//Stats

const getStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.getStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post's stats retreived successfully",
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
  getStats,
};
