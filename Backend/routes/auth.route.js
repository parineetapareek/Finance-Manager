import express from "express";
import {
  login,
  logout,
  resendVerificationEmail,
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

export default authRoute;
