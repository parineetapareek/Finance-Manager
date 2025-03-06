import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/auth";

export const signup = async (userData) => {
  console.log(userData);
  try {
    const response = await axios.post(`${apiURL}/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Signup Error: ", error);
    throw {
      success:false,
      message:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Signup failed! Please try again.",
        errors: error.response && error.response.data && error.response.data.errors ? error.response.data.errors:null,
    };
  }
};

export const login = async (userData) => {
  console.log(userData);
  try {
    const response = await axios.post(`${apiURL}/login`, {
      email: userData.email,
      password: userData.password,
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw {
      message:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Login failed! Please check your credentials.",
    };
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
    throw {
      message:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Logout failed! Please try again.",
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
      message:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Email Verification Error",
    };
  }
};
