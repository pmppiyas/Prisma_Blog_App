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

//Stats

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.posts.aggregate({
      _count: true,
      _sum: { views: true },
      _min: { views: true },
      _avg: { views: true },
      _max: { views: true },
    });

    const totalPosts = aggregates._count;
    const totalViews = aggregates._sum?.views ?? 0;
    const minViews = aggregates._min?.views ?? 0;
    const maxViews = aggregates._max?.views ?? 0;
    const avgViews = Number(aggregates._avg?.views?.toFixed(2)) || 0;

    const featuredCount = await tx.posts.count({
      where: {
        isFeatured: true,
      },
    });

    const topFeatured = await tx.posts.findFirst({
      where: {
        isFeatured: true,
      },
      orderBy: {
        views: "desc",
      },
    });

    const lastweek = new Date();
    lastweek.setDate(lastweek.getDate() - 7);
    const lastweekPostCount = await tx.posts.count({
      where: {
        createdAt: {
          gte: lastweek,
        },
      },
    });

    const lastmonth = new Date();
    lastmonth.setDate(lastmonth.getDate() - 30);

    const lastmonthPostCount = await tx.posts.count({
      where: {
        createdAt: {
          gte: lastmonth,
        },
      },
    });
    return {
      stats: { totalPosts, totalViews, minViews, maxViews, avgViews },

      featured: {
        count: featuredCount,
        topFeaturedPostId: topFeatured?.id,
      },
      lastweek: {
        count: lastweekPostCount,
      },
      lastmonth: {
        count: lastmonthPostCount,
      },
    };
  });
};

const PostServices = {
  createPost,
  getAllPost,
  getAPost,
  updatePost,
  deletePost,
  getStats,
};
export default PostServices;
