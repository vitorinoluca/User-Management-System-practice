import type { Request, Response } from 'express';
import {
  addUserInfoService,
  loginService,
  registerService,
  sentVerificationCodeService,
  verificationService,
} from '../services/auth.service';
import { type UserInterface } from '../types/types';

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, birthday } = req.body;

  const { statusCode, msg } = await registerService(email, password, birthday);
  res.status(statusCode).json(msg);
};

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  const { statusCode, msg, token } = await loginService(email, password);

  if (token !== null) res.cookie('userId', token);
  res.status(statusCode).json(msg);
};

export const verificationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user: UserInterface | undefined = req.user;
  const { verificationCode } = req.body;

  const { statusCode, msg } = await verificationService(user, verificationCode);
  res.status(statusCode).json(msg);
};

export const sentVerificationCodeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user: UserInterface = req.user;

  const { statusCode, msg } = await sentVerificationCodeService(user);
  res.status(statusCode).json(msg);
};

export const addUserInfoController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, lastname, phone } = req.body;
  const user: UserInterface = req.user;

  const { statusCode, msg } = await addUserInfoService(
    user,
    name,
    lastname,
    phone,
  );
  res.status(statusCode).json(msg);
};
