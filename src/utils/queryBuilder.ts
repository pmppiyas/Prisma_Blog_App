import { Prisma } from "@prisma/client";
import { validSortFields } from "../constant";

export const buildPostQuery = ({
  search,
  isFeatured,
  author,
  tags,
  sortBy,
  sortOrder,
}: {
  search?: string;
  isFeatured?: boolean;
  author?: number;
  tags?: string[];
  sortBy?: string;
  sortOrder?: string;
}) => {
  const filters: Prisma.PostsWhereInput[] = [];

  if (search) {
    filters.push({
      OR: [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    });
  }

  if (author) {
    filters.push({ authoreId: author });
  }

  if (typeof isFeatured === "boolean") {
    filters.push({ isFeatured });
  }

  if (tags && tags.length > 0) {
    filters.push({ tag: { hasSome: tags } });
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

  return { where, orderBy };
};
