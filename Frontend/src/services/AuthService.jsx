import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/auth";

const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);

  return {
    success: false,
    message: error.response?.data?.message || defaultMessage,
    errors: Array.isArray(error.response?.data?.errors)
      ? error.response.data.errors
      : [],
  };
};

export const getAuthUser = async () => {
  try {
    const response = await axios.get(`${apiURL}/me`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data"
    );
  }
};

export const signup = async (userData) => {
  console.log(userData);
  try {
    const response = await axios.post(`${apiURL}/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Signup Error: ", error);
    throw handleError(error, "Signup failed! Please try again.");
  }
};

export const login = async (userData) => {
  console.log(userData);
  try {
    const response = await axios.post(
      `${apiURL}/login`,
      {
        email: userData.email,
        password: userData.password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw handleError(error, "Login failed! Please check your credentials.");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${apiURL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw handleError(error, "Logout failed! Please try again.");
  }
};

export const verifyAccount = async (email, code) => {
  try {
    const response = await axios.post(`${apiURL}/verifyEmail`, { email, code });
    return response.data;
  } catch (error) {
    console.error("Email Verification Error: ", error);
    throw handleError(error, "Email Verification Error");
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/resendCode`, { email });
    return response.data;
  } catch (error) {
    console.error("Error Resending Verification Email: ", error);
    throw new Error("Failed to Resend Verification Email. Please try again.");
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/sendResetPassCode`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending reset password code: ", error);
    throw handleError(error, "Failed to send reset password code!");
  }
};

export const resetPassword = async (email, code, newPass) => {
  try {
    const response = await axios.post(`${apiURL}/resetPass`, {
      email,
      code,
      newPass,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw handleError(error, "Failed to reset password!");
  }
};

export const resendResetPasswordCode = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/resendResetPassCode`, { email });
    return response.data;
  } catch (error) {
    console.error("Error Resending Reset Password Code: ", error);
    throw new Error("Failed to Resend Reset Password Code. Please try again.");
  }
};
