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

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export const signupValidation = validateRequest(
  Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: PasswordComplexity(PasswordComplexityOptions).required(),
  })
);

export const loginValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required(),
  })
);

export const emailValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
  })
);

export const verifyEmailValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
    code: Joi.string().length(6).required(),
  })
);

export const resendVerificationEmailValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
  })
);

export const sendResetPassCodeValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
  })
);

export const resetPasswordValidation = validateRequest(
  Joi.object({
    email: Joi.string().trim().email().required(),
    code: Joi.string().length(6).required(),
    newPass: PasswordComplexity(PasswordComplexityOptions).required(),
  })
);
