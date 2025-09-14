import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeUserSelect } from "../../constant";
import { AppError } from "../../error/appError";

const createUser = async (payload: Prisma.UserCreateInput) => {
  const create = await prisma.user.create({
    data: payload,
    select: safeUserSelect,
  });
  return create;
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: safeUserSelect,
  });
};

const getAuser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  if (!user) {
    throw new AppError(404, "User Not Found!!!!!");
  }

  return user;
};

const UserServices = {
  createUser,
  getAllUsers,
  getAuser,
};
export default UserServices;
