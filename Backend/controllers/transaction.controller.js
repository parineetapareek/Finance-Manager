import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";

export const addTransaction = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    const { tranType, category, amount, date, description, accountId, source } =
      req.body;

    console.log("req.body: ", req.body);
    console.log("accountId: ", accountId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    if (!tranType || !category || !amount || !date || !accountId) {
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

    // Validate source for income transactions
    if (tranType === "Income" && !source) {
      return res.status(400).json({
        success: false,
        message: "Source is required for income transactions!",
      });
    }

    const account = await Account.findById(accountId);
    console.log("Account: ", account);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found!" });
    }

    // Ensure account.balance is a valid number
    console.log("Account Balance: ", account.bankBalance);

    // Adjust balance based on transaction type
    if (tranType === "Income") {
      account.bankBalance += amount;
    } else if (tranType === "Expense") {
      if (account.bankBalance < amount) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient balance!" });
      }
      account.bankBalance -= amount;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction type!" });
    }

    const newTransaction = new Transaction({
      userId: req.user.userId,
      tranType,
      category,
      amount,
      date: parsedDate,
      description,
      accountId,
      source: tranType === "Income" ? source : undefined,
      balanceAfterTransaction: account.bankBalance,
    });

    const savedTransaction = await newTransaction.save();
    await account.save();

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
    console.log("req.params: ", req.params);
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

    const { tranType, category, amount, date, description, accountId, source } =
      req.body;

    let transaction = await Transaction.findById(req.params.id);

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

    if (amount && (typeof amount !== "number" || amount <= 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number!" });
    }

    // Validate date format if provided
    let parsedDate;
    if (date) {
      parsedDate = new Date(date);
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

    const account = await Account.findById(transaction.accountId);
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Associated account not found!" });
    }

    // Revert the old transaction's impact on the balance
    if (transaction.tranType === "Income") {
      account.bankBalance -= transaction.amount;
    } else if (transaction.tranType === "Expense") {
      account.bankBalance += transaction.amount;
    }

    // Apply the new transaction's impact on the balance
    if (tranType === "Income") {
      account.bankBalance += amount || transaction.amount;
    } else if (tranType === "Expense") {
      if (account.bankBalance < (amount || transaction.amount)) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient balance!" });
      }
      account.bankBalance -= amount || transaction.amount;
    }

    // Update the transaction
    Object.assign(transaction, {
      tranType: tranType || transaction.tranType,
      category: category || transaction.category,
      amount: amount || transaction.amount,
      date: parsedDate || transaction.date,
      description: description || transaction.description,
      accountId: accountId || transaction.accountId,
      source: tranType === "Income" ? source : undefined,
      balanceAfterTransaction: account.bankBalance,
    });

    await transaction.save();
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
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

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.userId.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or unauthorized!",
      });
    }

    const account = await Account.findById(transaction.accountId);
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Associated account not found!" });
    }

    // Revert balance
    if (transaction.tranType === "Income") {
      account.bankBalance -= transaction.amount;
    } else {
      account.bankBalance += transaction.amount;
    }

    await account.save();
    await transaction.deleteOne();

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

    // Fetch transactions to adjust account balances
    const transactions = await Transaction.find({
      _id: { $in: transactionIds },
      userId: req.user.userId,
    });

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found or unauthorized access!",
      });
    }

    // Adjust account balances
    for (const transaction of transactions) {
      const account = await Account.findById(transaction.accountId);
      if (!account) continue;

      if (transaction.tranType === "Income") {
        account.bankBalance -= transaction.amount;
      } else {
        account.bankBalance += transaction.amount;
      }
      await account.save();
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
