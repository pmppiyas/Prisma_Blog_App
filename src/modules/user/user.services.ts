import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeUserSelect } from "../../constant";
import { AppError } from "../../error/appError";
import httpStatus from "http-status-codes";

const createUser = async (payload: Prisma.UserCreateInput) => {
  const create = await prisma.user.create({
    data: payload,
    select: safeUserSelect,
  });
  return create;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: safeUserSelect,
  });

  const meta = {
    total: users.length,
  };

  return {
    users,
    meta,
  };
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

const updateUser = async (id: number, payload: Prisma.UserUpdateInput) => {
  if ("isVerified" in payload && payload.isVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Sorry you can't change this!");
  }

  if (payload.isVerified) {
  }
  const update = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: safeUserSelect,
  });
  return update;
};

const deleteUser = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
  return null;
};

const UserServices = {
  createUser,
  getAllUsers,
  getAuser,
  updateUser,
  deleteUser,
};
export default UserServices;
