import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/auth";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${apiURL}/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Signup Error: ", error);
    throw {
      message:
        error.response?.data?.message || "Signup failed! Please try again.",
    };
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${apiURL}/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw {
      message:
        error.response?.data?.message ||
        "Login failed! Please check your credentials.",
    };
  }
};

export const logout = async () => {
  try {
    await axios.post(`${apiURL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw {
      message:
        error.response?.data?.message || "Logout failed! Please try again.",
    };
  }
};

export const VerifyAccount = async (email, code) => {
  try {
    const response = await axios.post(`${apiURL}/verifyEmail`, { email, code });
    return response.data;
  } catch (error) {
    console.error("Email Verification Error: ", error);
    throw {
      message: error.response?.data?.message || "Email Verification Error",
    };
  }
};
