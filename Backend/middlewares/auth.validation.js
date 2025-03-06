import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

const PasswordComplexityOptions = {
  min: 8,
  max: 30,
  upperCase: 1,
  lowerCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const validatePassword = () => {
  return PasswordComplexity(PasswordComplexityOptions).required().messages({
    "passwordComplexity.tooShort":
      "Password must be at least 8 characters long!",
    "passwordComplexity.tooLong": "Password cannot exceed 30 characters!",
    "passwordComplexity.upperCase":
      "Password must contain at least one uppercase letter!",
    "passwordComplexity.lowerCase":
      "Password must contain at least one lowercase letter!",
    "passwordComplexity.numeric": "Password must contain at least one number!",
    "passwordComplexity.symbol": "Password must contain at least one symbol!",
  });
};

const emailSchema = Joi.string().trim().email().required().messages({
  "string.empty": "Email is required!",
  "string.email": "Invalid email address!",
});

const codeSchema = Joi.string().length(6).required().messages({
  "string.empty": "Verification code is required!",
  "string.length": "Verification code must be exactly 6 characters long!",
});

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      // errors: error.details.map((err) => err.message),
      errors: errors,
    });
  }
  next();
};

export const signupValidation = validateRequest(
  Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Name is Required!",
      "string.min": "Name must be atleast 2 characters long!",
      "string.max": "Name cannot exceed 50 characters",
    }),
    email: emailSchema,
    password: validatePassword(),
  })
);

export const loginValidation = validateRequest(
  Joi.object({
    email: emailSchema,
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Password is Required" }),
  })
);

export const emailValidation = validateRequest(
  Joi.object({
    email: emailSchema,
  })
);

export const verifyEmailValidation = validateRequest(
  Joi.object({
    email: emailSchema,
    code: codeSchema,
  })
);

export const resendVerificationEmailValidation = validateRequest(
  Joi.object({
    email: emailSchema,
  })
);

export const sendResetPassCodeValidation = validateRequest(
  Joi.object({
    email: emailSchema,
  })
);

export const resetPasswordValidation = validateRequest(
  Joi.object({
    email: emailSchema,
    code: codeSchema,
    newPass: validatePassword(),
  })
);
