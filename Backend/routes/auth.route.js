import express from "express";
import {
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  sendResetPassCode,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  emailValidation,
  loginValidation,
  resendVerificationEmailValidation,
  resetPasswordValidation,
  sendResetPassCodeValidation,
  signupValidation,
  verifyEmailValidation,
} from "../middlewares/auth.validation.js";

const authRoute = express.Router();

authRoute.post("/signup", signupValidation, signup);
authRoute.post("/login", loginValidation, login);
authRoute.post("/logout", emailValidation, logout);
authRoute.post("/verifyEmail", verifyEmailValidation, verifyEmail);
authRoute.post(
  "/resendCode",
  resendVerificationEmailValidation,
  resendVerificationEmail
);
authRoute.post(
  "/sendResetPassCode",
  sendResetPassCodeValidation,
  sendResetPassCode
);
authRoute.post("/resetPass", resetPasswordValidation, resetPassword);

export default authRoute;
