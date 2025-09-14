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
  });
  return posts;
};

const PostServices = {
  createPost,
  getAllPost,
};
export default PostServices;
