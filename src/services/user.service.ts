import { HttpStatusCode } from '../constants/http';
import { ERRORS_MSGS, SUCCESS_MSGS } from '../constants/responses';
import type { ResponseInterface, UserInterface } from '../types/types';
import { validateUpdateInfo } from '../utils/validators';

interface UserInfoDataInterface {
  name?: string;
  lastname?: string;
  phone?: string;
}
export const getUserInfoService = async (
  user: UserInterface,
): Promise<ResponseInterface> => {
  try {
    return {
      statusCode: HttpStatusCode.OK,
      msg: user,
    };
  } catch {
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateUserInfoService = async (
  userData: UserInfoDataInterface,
  user: UserInterface,
): Promise<ResponseInterface> => {
  const errors = validateUpdateInfo(userData);
  if (!errors.isValid) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      msg: errors,
    };
  }
  try {
    if (userData.name !== undefined) {
      user.name = userData.name;
    }
    if (userData.lastname !== undefined) {
      user.lastname = userData.lastname;
    }
    if (userData.phone !== undefined) {
      user.phone = userData.phone;
    }

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

export const deleteUserService = async (
  user: UserInterface,
): Promise<ResponseInterface> => {
  try {
    await user.deleteOne();
    return {
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.USER_DELETED,
    };
  } catch {
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};
