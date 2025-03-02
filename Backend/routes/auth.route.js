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
// import {
//   loginValidation,
//   signupValidation,
// } from "../middlewares/auth.validation.js";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/verifyEmail", verifyEmail);
authRoute.post("/resendCode", resendVerificationEmail);
authRoute.post("/resetPass",resetPassword);
authRoute.post("/sendResetPassCode",sendResetPassCode);

export default authRoute;
