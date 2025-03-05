import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Generate JWT Token
export const generateJWTToken = (userId, email) => {
  try {
    return jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  } catch (error) {
    console.error("JWT Token Generation Failed:", error.message);
    throw new Error("Failed to generate JWT token.");
  }
};

// Verify JWT Token
export const verifyJWTToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    return decoded;
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired! Please log in again.");
    }

    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token!");
    }

    // Handle other errors
    throw new Error("Failed to verify JWT token.");
  }
};
