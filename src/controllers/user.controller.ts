import type { Request, Response } from 'express';
import {
  deleteUserService,
  getUserInfoService,
  updateUserInfoService,
} from '../services/user.service';
import type { UserInterface } from '../types/types';

export const getUserInfoController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user: UserInterface = req.user;

  const { statusCode, msg } = await getUserInfoService(user);
  res.status(statusCode).json(msg);
};

export const updateUserInfoController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, lastname, phone } = req.body;
  const user: UserInterface = req.user;

  const userData = {
    name,
    lastname,
    phone,
  };
  const { statusCode, msg } = await updateUserInfoService(userData, user);
  res.status(statusCode).json(msg);
};

export const deleteUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user: UserInterface = req.user;

  const { statusCode, msg } = await deleteUserService(user);
  res.status(statusCode).json(msg);
};
