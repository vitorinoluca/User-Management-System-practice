import { HttpStatusCode } from '../constants/http';
import { ERRORS_MSGS, SUCCESS_MSGS } from '../constants/responses';
import { User } from '../models/user.model';
import type { UserInterface, ResponseInterface } from '../types/types';
import { comparePassword, encryptPassword } from '../utils/bcrypt';
import { encryptId } from '../utils/jwt';
import { sentVerificationEmail } from '../utils/nodemailer';
import {
  validateAddInfo,
  validateLogin,
  validateRegister,
  verificationCodeValidator,
} from '../utils/validators';
import { generateSixDigitCode } from '../utils/verificationCode';

export const registerService = async (
  email: string,
  password: string,
  birthday: Date,
): Promise<ResponseInterface> => {
  const validationResult = validateRegister(email, password, birthday);
  if (!validationResult.isValid) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: validationResult.errors,
    };
  }

  const userFound = await User.findOne({ email });
  if (userFound?.verified === true) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: ERRORS_MSGS.EMAIL_ALREADY_EXISTS,
    };
  }

  if (userFound !== null && !userFound.verified) {
    const hashedPassword = await encryptPassword(password);
    userFound.password = hashedPassword;
    userFound.birthday = birthday;

    await userFound.save();
    return {
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.USER_CREATED,
    };
  }
  const hashedPassword = await encryptPassword(password);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    birthday,
  });

  await newUser.save();

  return {
    statusCode: HttpStatusCode.OK,
    msg: SUCCESS_MSGS.USER_CREATED,
  };
};

export const loginService = async (
  email: string,
  password: string,
): Promise<ResponseInterface> => {
  const validationResult = validateLogin(email, password);
  if (!validationResult.isValid) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: validationResult.errors,
    };
  }
  const userFound = await User.findOne({ email });

  if (userFound === null) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: { email: ERRORS_MSGS.USER_NOT_FOUND },
    };
  }
  const passwordValid = await comparePassword(password, userFound.password);
  if (!passwordValid) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: { password: ERRORS_MSGS.INCORRECT_PASSWORD },
    };
  }

  const token = encryptId(userFound.id);
  return {
    statusCode: HttpStatusCode.OK,
    msg: SUCCESS_MSGS.USER_CREATED,
    token,
  };
};

export const verificationService = async (
  user: UserInterface,
  verificationCode: number,
): Promise<ResponseInterface> => {
  const { error } = verificationCodeValidator.validate(verificationCode);

  if (error !== undefined) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: error.message,
    };
  }

  try {
    if (user.verificationCode === undefined && !user.verified) {
      return {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        msg: ERRORS_MSGS.VERIFICATION_CODE_NOT_SENT,
      };
    }

    if (user.verificationCode === verificationCode) {
      user.verified = true;
      user.set({ verificationCode: undefined });
      await user.save();
      return {
        statusCode: HttpStatusCode.OK,
        msg: SUCCESS_MSGS.USER_VERIFIED,
      };
    }
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: ERRORS_MSGS.INVALID_VERIFICATION_CODE,
    };
  } catch {
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const sentVerificationCodeService = async (
  user: UserInterface,
): Promise<ResponseInterface> => {
  if (user.verified) {
    return {
      statusCode: HttpStatusCode.CONFLICT,
      msg: ERRORS_MSGS.USER_ALREADY_VALIDATED,
    };
  }
  try {
    const verificationCode = generateSixDigitCode();
    await sentVerificationEmail(user.email, verificationCode);

    user.verificationCode = verificationCode;

    await user.save();
    return {
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.VERIFICATION_CODE_SENT,
    };
  } catch {
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const addUserInfoService = async (
  user: UserInterface,
  name: string,
  lastname: string,
  phone?: string,
): Promise<ResponseInterface> => {
  if (user.name != null || user.lastname != null || user.phone != null) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: ERRORS_MSGS.USER_ALREADY_ADDED_INFO,
    };
  }
  const validation = validateAddInfo({ name, lastname, phone });

  if (!validation.isValid) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: validation.errors,
    };
  }

  try {
    user.name = name;
    user.lastname = lastname;
    user.phone = phone;
    await user.save();
    return {
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.USER_INFO_UPDATED,
    };
  } catch {
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};
