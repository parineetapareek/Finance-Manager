import { verifyJWTToken } from "../utils/jwt.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies.token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized! No token provided." });
  }

  try {
    const decoded = verifyJWTToken(token);
    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
