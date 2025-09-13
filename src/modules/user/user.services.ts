import { Prisma } from "@prisma/client";
import prisma from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput) => {
  const create = await prisma.user.create({
    data: payload,
  });
  return create;
};

const getAllUsers = async () => {
  return await prisma.user.findMany({});
};

const UserServices = {
  createUser,
  getAllUsers,
};
export default UserServices;
