import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/transaction";

const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.response?.data?.message || defaultMessage,
    errors: error,
  };
};

// Fetch all transactions for the authenticated user
export const getTransactions = async () => {
  console.log("in get transaction");
  try {
    console.log("In try of get transactions");
    const response = await axios.get(
      `${apiURL}/getTransactions`,
      { withCredentials: true } 
    );
    console.log("Response.data: ",response.data);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch transactions!");
  }
};

// Fetch a single transaction by ID
export const getTransactionById = async (transactionId) => {
    console.log("Transaction Id: ",transactionId);
  try {
    const response = await axios.get(
      `${apiURL}/getTransaction/${transactionId}`,
      { withCredentials: true }
    );
    console.log("Response in getTransaction by ID: ",response);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch transaction details!");
  }
};

// Add a new transaction
export const addTransaction = async (transactionData) => {
    console.log("Transaction Data: ", transactionData);
  try {
    const response = await axios.post(
      `${apiURL}/addTransaction`,
      transactionData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to add transaction!");
  }
};

// Update an existing transaction
export const updateTransaction = async (transactionId, updatedData) => {
  try {
    const response = await axios.put(
      `${apiURL}/updateTransaction/${transactionId}`,
      updatedData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to update transaction!");
  }
};

// Delete a single transaction
export const deleteTransaction = async (transactionId) => {
  try {
    const response = await axios.delete(
      `${apiURL}/deleteTransaction/${transactionId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to delete transaction!");
  }
};

// Delete multiple transactions at once
export const deleteMultipleTransactions = async (transactionIds) => {
  try {
    const response = await axios.delete(`${apiURL}/deleteTransactions`, {
      withCredentials: true,
      data: { transactionIds },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to delete multiple transactions!");
  }
};
