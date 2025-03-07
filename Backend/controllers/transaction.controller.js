import Transaction from "../models/transaction.model.js";

export const addTransaction = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    const { tranType, category, amount, date, description } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    if (!tranType || !category || !amount || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required!" });
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number!" });
    }

    // Validate Date Format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // Check if the date is invalid
      return res
        .status(400)
        .json({ success: false, message: "Invalid Date Format!" });
    }

    // Prevent future dates
    const currentDate = new Date();
    if (parsedDate > currentDate) {
      return res
        .status(400)
        .json({ success: false, message: "Date cannot be in the future!" });
    }

    const newTransaction = new Transaction({
      userId: req.user.userId,
      tranType,
      category,
      amount,
      date: parsedDate,
      description,
    });

    const savedTransaction = await newTransaction.save();
    return res.status(201).json({
      success: true,
      message: "Transaction Saved Successfully",
      savedTransaction,
    });
  } catch (error) {
    console.error("An Error Occurred: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Saving Transaction: ", error });
  }
};

export const getTransactions = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({
      date: -1,
    });

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Transactions Found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully Retrieved Transactions: ",
      transactions,
    });
  } catch (error) {
    console.error("An Error Occurred: ", error);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Transactions: ",
      error,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);
    console.log("Transaction ID: ", req.params.id);

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to transaction",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction Retrieved Successfully: ",
      transaction,
    });
  } catch (error) {
    console.error("An Error Occured: ", error);
    return res.status(500).json({
      success: false,
      message: "Error Retriving Transaction: ",
      error,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);
    console.log("Transaction ID: ", req.params.id);
    console.log("Requested Body: ", req.body);

    const { tranType, category, amount, date, description } = req.body;

    let transaction = await Transaction.findById(req.params.id);
    // Check if the transaction exists
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    // Check if the transaction belongs to the authenticated user
    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to transaction",
      });
    }

    // Validate date format if provided
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Date Format!" });
      }

      // Prevent future dates
      const currentDate = new Date();
      if (parsedDate > currentDate) {
        return res
          .status(400)
          .json({ success: false, message: "Date cannot be in the future!" });
      }
    }

    // Atomic update using findOneAndUpdate
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, // Ensure the transaction belongs to the user
      {
        $set: {
          tranType: tranType || transaction.tranType,
          category: category || transaction.category,
          amount: amount || transaction.amount,
          date: date ? new Date(date) : transaction.date,
          description: description || transaction.description,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or unauthorized access!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    console.error("An Error Occurred: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Updating Transaction: ", error });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);
    console.log("Transaction ID: ", req.params.id);

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction Not Found Or Unauthorized Access!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction Deleted Successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error Deleting Transaction: ", error });
  }
};

export const deleteMultipleTransactions = async (req, res) => {
  try {
    console.log("Requested User:", req.user);
    console.log("User ID:", req.user.userId);
    console.log("Transaction IDs:", req.body.transactionIds);

    const { transactionIds } = req.body;

    // Check if transactionIds is provided and is an array
    if (!transactionIds || !Array.isArray(transactionIds)) {
      return res.status(400).json({
        success: false,
        message: "Transaction IDs must be provided as an array.",
      });
    }

    // Delete transactions that belong to the authenticated user
    const deleteResult = await Transaction.deleteMany({
      _id: { $in: transactionIds },
      userId: req.user.userId,
    });

    // Check if any transactions were deleted
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found or unauthorized access!",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} transactions deleted successfully`,
    });
  } catch (error) {
    console.error("An Error Occurred: ", error);
    return res.status(500).json({
      success: false,
      message: "Error Deleting Transactions",
      error,
    });
  }
};
