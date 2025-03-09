import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/account";

const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.response?.data?.message || defaultMessage,
    errors: error,
  };
};

export const getAccountsByUser = async (userId) => {
  try {
    const response = await axios.get(`${apiURL}/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch accounts!");
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await axios.post(`${apiURL}/create`, accountData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to create account!");
  }
};

export const updateAccountBalance = async (accId, amount, operation) => {
  try {
    const response = await axios.put(`${apiURL}/update/${accId}`, {
      amount,
      operation,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to update account balance!");
  }
};

export const deleteAccount = async (accId) => {
  try {
    const response = await axios.delete(`${apiURL}/del/${accId}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to delete account!");
  }
};
