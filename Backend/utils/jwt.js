import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Generate JWT Token
export const generateJWTToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// Verify JWT Token
export const verifyJWTToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return null;
  }
};
