import { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import { safeUserSelect } from "../../constant";

const createUser = async (payload: Prisma.UserCreateInput) => {
  const create = await prisma.user.create({
    data: payload,
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

  return user;
};

const UserServices = {
  createUser,
  getAllUsers,
  getAuser,
};
export default UserServices;
