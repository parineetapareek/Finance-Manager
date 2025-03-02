import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  sendVerificationCode,
  sendWelcomeEmail,
} from "../middlewares/email.js";
import User from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET: ", JWT_SECRET);

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashOTP = await bcrypt.hash(otp, 10);

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
    console.error("Error Creating User: " + error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occured!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "User Does Not Exist! Please Signup",
      });
    }

    const isPassEql = await bcrypt.compare(password, existingUser.password);
    if (!isPassEql) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Password!" });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please Verify your Email to Login!",
      });
    }

    // JWT Session Management
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully!",
    });
  } catch (error) {
    console.error("Error Creating User: " + error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occured!" });
  }
};

export const logout = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(403).json({ success: false, message: "User Not Found!" });
  }
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
    console.error("An Error Occurred while Logging Out: ", error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occurred!" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(403).json({
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

    // Generate JWT Token after successful verification
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Account Verified Successfully!" });
  } catch (error) {
    console.error("Error Verifying Email: ", error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occurres!" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required!" });
    }

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

    // Generate New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashOTP = await bcrypt.hash(otp, 10);

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
    console.error("Error Resending Verification Email!", error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occured!" });
  }
};
