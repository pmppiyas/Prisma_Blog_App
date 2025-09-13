import { Prisma } from "@prisma/client";
import prisma from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput) => {
  const create = await prisma.user.create({
    data: payload,
  });
  return create;
};

const UserServices = {
  createUser,
};
export default UserServices;
