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

const getAllPost = async () => {
  const posts = prisma.posts.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: safeAuthorSelect,
      },
    },
  });
  return posts;
};

const getAPost = async (id: number) => {
  const post = prisma.posts.findUnique({
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

const updatePost = async (id: number, payload: any) => {
  const result = prisma.posts.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const PostServices = {
  createPost,
  getAllPost,
  getAPost,
  updatePost,
};
export default PostServices;
