import Joi from 'joi';

interface ValidationResult {
  email?: string;
  password?: string;
  birthday?: string;
  name?: string;
  lastname?: string;
  phone?: string;
}

interface UpdateInfoData {
  name?: string;
  lastname?: string;
  phone?: string;
}

interface ValidationResponse {
  isValid: boolean;
  errors: ValidationResult;
}

interface LoginValidationResponse {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}

// Email Validator
export const emailValidator = Joi.string().email().required().messages({
  'any.required': 'Email is required.',
  'string.email': 'Invalid email format.',
});

// Password Validator
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,30}$/;

export const passwordValidator = Joi.string()
  .pattern(passwordRegex)
  .required()
  .messages({
    'any.required': 'Password is required.',
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 3-30 characters.',
  });

// Name & Lastname Validator
export const nameValidator = Joi.string().min(1).max(50).required().messages({
  'any.required': 'Name is required.',
  'string.min': 'Name must be at least 1 character long.',
  'string.max': 'Name cannot exceed 50 characters.',
});
export const lastnameValidator = Joi.string()
  .min(1)
  .max(50)
  .required()
  .messages({
    'any.required': 'Lastname is required.',
    'string.min': 'Lastname must be at least 1 character long.',
    'string.max': 'Lastname cannot exceed 50 characters.',
  });

// Birthday Validator
const customMessages = {
  'date.max': 'Invalid birthday.',
  'any.required': 'Birthday is required.',
  'custom.invalidAge': 'You must be at least 18 years old.',
};

export const birthdayValidator = Joi.date()
  .max('now')
  .required()
  .messages(customMessages)
  .custom((value, helpers) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    if (value > eighteenYearsAgo) {
      return helpers.error('custom.invalidAge');
    }

    return value;
  });

// Phone Validator
export const phoneValidator = Joi.string()
  .pattern(/^[0-9]{7,15}$/)
  .messages({
    'string.pattern.base': 'Invalid phone number format',
  });

// Verification code Validator
export const verificationCodeValidator = Joi.number()
  .integer()
  .required()
  .min(100000)
  .max(999999)
  .messages({
    'any.required': 'Verification code is required.',
    'number.base': 'Verification code must be a number.',
    'number.integer': 'Verification code must be an integer.',
    'number.min': 'Verification code must have exactly 6 digits.',
    'number.max': 'Verification code must have exactly 6 digits.',
  });

export const validateRegister = (
  email: string,
  password: string,
  birthday: Date,
): ValidationResponse => {
  const emailValidationResult = emailValidator.validate(email);
  const passwordValidationResult = passwordValidator.validate(password);
  const birthdayValidationResult = birthdayValidator.validate(birthday);

  const errors: { email?: string; password?: string; birthday?: string } = {};

  if (emailValidationResult.error != null) {
    errors.email = emailValidationResult.error.message;
  }

  if (passwordValidationResult.error != null) {
    errors.password = passwordValidationResult.error.message;
  }

  if (birthdayValidationResult.error != null) {
    errors.birthday = birthdayValidationResult.error.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (
  email: string | undefined,
  password: string | undefined,
): LoginValidationResponse => {
  const errors: { email?: string; password?: string } = {};

  if (email !== undefined) {
    const emailValidationResult = emailValidator.validate(email);
    if (emailValidationResult.error !== undefined) {
      errors.email = emailValidationResult.error.message;
    }
  } else {
    errors.email = 'Email is required';
  }

  if (password == null || password.trim() === '') {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAddInfo = (data: UpdateInfoData): ValidationResponse => {
  const { name, lastname, phone } = data;
  const nameValidationResult = nameValidator.validate(name);
  const lastnameValidationResult = lastnameValidator.validate(lastname);
  let phoneValidationResult;

  const errors: ValidationResult = {};

  if (nameValidationResult.error !== undefined) {
    errors.name = nameValidationResult.error.message;
  }

  if (lastnameValidationResult.error !== undefined) {
    errors.lastname = lastnameValidationResult.error.message;
  }

  if (phone !== undefined && phone.trim() !== '') {
    phoneValidationResult = phoneValidator.validate(phone);

    if (phoneValidationResult.error !== undefined) {
      errors.phone = phoneValidationResult.error.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateInfo = (
  data: UpdateInfoData,
): ValidationResponse => {
  const { name = undefined, lastname = undefined, phone = undefined } = data;
  const errors: ValidationResult = {};

  if (name !== undefined) {
    const nameValidationResult = nameValidator.validate(name);

    if (nameValidationResult.error !== undefined) {
      errors.name = nameValidationResult.error.message;
    }
  }

  if (lastname !== undefined) {
    const lastnameValidationResult = lastnameValidator.validate(lastname);

    if (lastnameValidationResult.error !== undefined) {
      errors.lastname = lastnameValidationResult.error.message;
    }
  }

  if (phone !== undefined && phone.trim() !== '') {
    const phoneValidationResult = phoneValidator.validate(phone);

    if (phoneValidationResult.error !== undefined) {
      errors.phone = phoneValidationResult.error.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
