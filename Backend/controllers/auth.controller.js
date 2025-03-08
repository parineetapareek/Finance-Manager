import bcrypt from "bcryptjs";
import {
  sendForgetPassCode,
  sendPassChangeConfirmEmail,
  sendVerificationCode,
  sendWelcomeEmail,
} from "../middlewares/email.js";
import User from "../models/user.model.js";
import { generateJWTToken } from "../utils/jwt.js";

// Utility Function to Generate OTP
const generateOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashOTP = await bcrypt.hash(otp, 10);
  return { otp, hashOTP };
};

// Utility Function to Handle Errors
const handleError = (res, error, message = "An error occurred!") => {
  console.error(message, error);
  return res.status(500).json({ success: false, message });
};

export const getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User Found Successfuly: ", user });
  } catch (error) {
    return handleError(res, error, "Get Auth User Error: ");
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const { otp, hashOTP } = await generateOTP();

    await sendVerificationCode(email, otp);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      isVerified: false,
      verificationCode: hashOTP,
      verificationExpires: Date.now() + 10 * 60 * 1000, //Expiring after 10 min
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message:
        "User Registered Successfully! Please Check your account to verify email!",
    });
  } catch (error) {
    return handleError(res, error, "Error Creating User: ");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "User Does Not Exist! Please Signup",
      });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please Verify your Email to Login!",
      });
    }

    const isPassEql = await bcrypt.compare(password, existingUser.password);
    if (!isPassEql) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Password!" });
    }

    const token = generateJWTToken(existingUser._id, existingUser.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully!",
      token,
    });
  } catch (error) {
    return handleError(res, error, "Error during Login: ");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully Logged Out!" });
  } catch (error) {
    return handleError(res, error, "Error during Logout: ");
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found!",
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is Already Verified!" });
    }

    if (user.verificationExpires < Date.now()) {
      return res
        .status(403)
        .json({ success: false, message: "OTP Expired! Request a new one." });
    }

    const isOTPValid = await bcrypt.compare(code, user.verificationCode);
    if (!isOTPValid) {
      return res.status(403).json({ success: false, message: "Invalid OTP!" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res
      .status(200)
      .json({ success: true, message: "Account Verified Successfully!" });
  } catch (error) {
    return handleError(res, error, "Error Verifying Email: ");
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Verified!" });
    }

    const { otp, hashOTP } = await generateOTP();

    user.verificationCode = hashOTP;
    user.verificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationCode(email, otp);

    return res.status(200).json({
      success: true,
      message:
        "A new verification email has been sent! Please Check your Inbox!",
    });
  } catch (error) {
    return handleError(res, error, "Error resending Verification Email: ");
  }
};

export const sendResetPassCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User Not Found!" });
    } else if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Email Not Verified!" });
    }

    const { otp, hashOTP } = await generateOTP();

    await sendForgetPassCode(email, otp);

    user.resetCode = hashOTP;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; //10 min
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Reset Password Code Sent Successfully! Please Check your Inbox!",
    });
  } catch (error) {
    return handleError(res, error, "Error sending password reset code: ");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { code, email, newPass } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Does Not Exists!" });
    }

    if (user.resetCodeExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "OTP Expired, Please Request a New One!",
      });
    }

    const isMatch = await bcrypt.compare(code, user.resetCode);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid OTP!" });
    }

    const hashNewPass = await bcrypt.hash(newPass, 10);

    const isDiff = await bcrypt.compare(newPass, user.password);
    if (isDiff) {
      return res.status(400).json({
        success: false,
        message: "Old Password and New Password cant be same!",
      });
    }

    user.password = hashNewPass;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    await sendPassChangeConfirmEmail(user.email, user.name);

    return res
      .status(200)
      .json({ success: true, message: "Password Changed Successfully!" });
  } catch (error) {
    return handleError(res, error, "Error resetting password:");
  }
};

export const resendResetPassCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email Not Verified!" });
    }

    const { otp, hashOTP } = await generateOTP();

    user.resetCode = hashOTP;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendForgetPassCode(email, otp);

    return res.status(200).json({
      success: true,
      message:
        "A new Password Reset Code has been sent! Please Check your Inbox!",
    });
  } catch (error) {
    return handleError(res, error, "Error resending Password Reset Code: ");
  }
};
