import axios from "axios";

const apiURL = import.meta.env.VITE_BACKEND_URL + "/budget";

const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);
  let message = defaultMessage;
  if (error.response) {
    message = error.response.data?.message || defaultMessage;
  } else if (error.request) {
    message = "Network error. Please check your internet connection.";
  } else {
    message = "An unexpected error occurred.";
  }

  return {
    success: false,
    message,
    errors: error,
  };
};

export const getBudget = async (userId) => {
  try {
    const response = await axios.get(`${apiURL}/get`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to Fetch Budget!");
  }
};

export const createBudget = async (budgetData) => {
  console.log("Budget Data: ", budgetData);
  try {
    const response = await axios.post(`${apiURL}/create`, budgetData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to Create Budget!");
  }
};

export const updateBudget = async (updatedData) => {
  try {
    const response = await axios.put(`${apiURL}/update`, updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to Update Budget!");
  }
};

export const deleteBudget = async (budgetId) => {
  try {
    const response = await axios.delete(`${apiURL}/del`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to Delete Budget!");
  }
};
