import { type Document } from 'mongoose';

export interface ResponseInterface {
  statusCode: number;
  msg: string | object;
  token?: string;
}
export interface UserInterface extends Document {
  email: string;
  password: string;
  birthday?: Date;
  name?: string;
  lastname?: string;
  phone?: string;
  verified: boolean;
  verificationCode?: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}
