import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

interface DecodedId {
  id: string;
}

export const encryptId = (id: string): string => {
  return jwt.sign({ id }, SECRET_KEY);
};

export const decryptId = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedId;
    return decoded.id;
  } catch {
    return null;
  }
};
