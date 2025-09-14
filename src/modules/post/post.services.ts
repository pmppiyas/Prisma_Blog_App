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
  search?: string;
  isFeatured?: boolean;
  author?: number;
}

const getAllPost = async ({
  page,
  limit,
  search,
  isFeatured,
  author,
}: PaginationParams) => {
  console.log(author);
  const skip = (page - 1) * limit;

  const filters = [];

  if (search) {
    filters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (author) {
    filters.push({
      authoreId: author,
    });
  }

  if (typeof isFeatured === "boolean") {
    filters.push({ isFeatured });
  }

  const where: any = filters.length > 0 ? { AND: filters } : {};

  const posts = await prisma.posts.findMany({
    where,
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
