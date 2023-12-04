import 'dotenv/config';

export const DB_URL = process.env.DB_URL as string;
export const PORT = process.env.PORT as string;
export const SECRET_KEY = process.env.SECRET_KEY as string;
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL as string;
export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD as string;
