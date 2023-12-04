import mongoose from 'mongoose';
import { type UserInterface } from '../types/types';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
  },
});

export const User = mongoose.model<UserInterface>('User', userSchema);
