import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeAuthorSelect } from "../../constant";

const createPost = async (payload: Prisma.PostsCreateInput) => {
  const create = await prisma.posts.create({
    data: payload,
    include: {
      author: {
        select: safeAuthorSelect,
      },
    },
  });

  return create;
};

interface PaginationParams {
  page: number;
  limit: number;
}

const getAllPost = async ({ page, limit }: PaginationParams) => {
  const skip = (page - 1) * limit;
  const posts = await prisma.posts.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: safeAuthorSelect,
      },
    },
    skip,
    take: limit,
  });

  const meta = {
    total: posts.length,
  };

  return {
    posts,
    meta,
  };
};

const getAPost = async (id: number) => {
  const post = await prisma.posts.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: safeAuthorSelect,
      },
    },
  });

  return post;
};

const updatePost = async (id: number, payload: Prisma.PostsUpdateInput) => {
  const result = await prisma.posts.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deletePost = async (id: number) => {
  await prisma.posts.delete({
    where: {
      id,
    },
  });

  return null;
};

const PostServices = {
  createPost,
  getAllPost,
  getAPost,
  updatePost,
  deletePost,
};
export default PostServices;
