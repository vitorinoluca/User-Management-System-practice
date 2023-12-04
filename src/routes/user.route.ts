import { Router } from 'express';
import { authenticateMiddleware } from '../middlewares/auth.middleware';
import {
  deleteUserController,
  getUserInfoController,
  updateUserInfoController,
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', authenticateMiddleware, getUserInfoController);
userRoutes.patch('/', authenticateMiddleware, updateUserInfoController);
userRoutes.delete('/', authenticateMiddleware, deleteUserController);

export default userRoutes;
