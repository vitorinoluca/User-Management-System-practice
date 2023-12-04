import { Router } from 'express';
import {
  addUserInfoController,
  loginController,
  registerController,
  sentVerificationCodeController,
  verificationController,
} from '../controllers/auth.controller';
import { authenticateMiddleware } from '../middlewares/auth.middleware';

const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);

authRoutes.post('/validate', authenticateMiddleware, verificationController);
authRoutes.get(
  '/sent-code',
  authenticateMiddleware,
  sentVerificationCodeController,
);

authRoutes.post('/add-info', authenticateMiddleware, addUserInfoController);
export default authRoutes;
