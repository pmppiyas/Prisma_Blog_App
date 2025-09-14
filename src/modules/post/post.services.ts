import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeAuthorSelect, validSortFields } from "../../constant";

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
}: PaginationParams) => {
  const skip = (page - 1) * limit;

  const filters = [];

  if (search) {
    filters.push({
      OR: [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
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

  if (tags && Array.isArray(tags) && tags.length > 0) {
    filters.push({
      tag: {
        hasSome: tags,
      },
    });
  }

  const where: Prisma.PostsWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const sortField = validSortFields.includes(sortBy || "")
    ? sortBy!
    : "createdAt";
  const sortDirection: Prisma.SortOrder = sortOrder === "desc" ? "desc" : "asc";

  const orderBy: Prisma.PostsOrderByWithRelationInput = {
    [sortField]: sortDirection,
  };

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
    page: page,
    limit: limit,
    totalPage: Math.ceil(total / limit),
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
