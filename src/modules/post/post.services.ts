import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeAuthorSelect, validSortFields } from "../../constant";
import { buildPostQuery } from "../../utils/queryBuilder";

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

interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  isFeatured?: boolean;
  author?: number;
  tags?: any;
  sortBy?: string;
  sortOrder?: string;
}

const getAllPost = async ({
  page,
  limit,
  search,
  isFeatured,
  author,
  tags,
  sortBy,
  sortOrder,
}: QueryParams) => {
  const skip = (page - 1) * limit;

  const { where, orderBy } = buildPostQuery({
    search,
    isFeatured,
    author,
    tags,
    sortBy,
    sortOrder,
  });

  const posts = await prisma.posts.findMany({
    where,
    orderBy,
    include: {
      author: {
        select: safeAuthorSelect,
      },
    },
    skip,
    take: limit,
  });

  const total = await prisma.posts.count();
  const inPageTotal = await prisma.posts.count({ where, skip, take: limit });

  const meta = {
    total,
    inPageTotal,
    page,
    totalPage: Math.ceil(total / limit),
    limit,
  };

  return { posts, meta };
};

const getAPost = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const post = await tx.posts.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: safeAuthorSelect,
        },
      },
    });

    await tx.posts.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return post;
  });

  return result;
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
