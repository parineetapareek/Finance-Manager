import express from "express";
import {
  getAuthUser,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  sendResetPassCode,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  resendVerificationEmailValidation,
  resetPasswordValidation,
  sendResetPassCodeValidation,
  signupValidation,
  verifyEmailValidation,
} from "../middlewares/auth.validation.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.get("/me", verifyToken, getAuthUser);
authRoute.post("/signup", signupValidation, signup);
authRoute.post("/login", loginValidation, login);
authRoute.post("/logout", verifyToken, logout);
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
