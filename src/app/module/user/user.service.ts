import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// get post crate ak kaj control a na kore service a korbo
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user already Exist");
  }

  const hasPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hasPassword,
    auths: [authProvider],
    ...rest,
  });
  return { user };
};

// update User
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    if (
      payload.role === Role.SUPER_ADMIN &&
      decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser
};
