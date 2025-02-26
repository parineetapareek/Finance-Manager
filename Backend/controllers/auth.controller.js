import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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

    const hashPassword = await bcryptjs.hashSync(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ success: true, message: "User Created Successfully!" });
  } catch (error) {
    console.err("Error Creating User: " + error);
    return res
      .status(500)
      .json({ success: false, message: "An Error Occured!" });
  }
};
