import { Prisma } from "@prisma/client";
import { AppError } from "../../error/appError";
import httpStatus from "http-status-codes";
import prisma from "../../config/db";

const loginByCredential = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(
      httpStatus.EXPECTATION_FAILED,
      "Required fields missing!"
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No user by this email.");
  }

  const isPasswordValid = user.password === password;

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is wrong");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const AuthServices = {
  loginByCredential,
};
