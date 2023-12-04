import nodemailer, { type Transporter } from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from '../config';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});

export const sentVerificationEmail = async (
  email: string,
  verificationCode: number,
): Promise<any> => {
  const mailOptions: MailOptions = {
    from: NODEMAILER_EMAIL,
    to: email,
    subject: `Tu código de verificación es: ${verificationCode}`,
    text: `Tu código de verificación es: ${verificationCode}`,
  };

  return await transporter.sendMail(mailOptions);
};
