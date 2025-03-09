import Account from "../models/account.model.js";

// Create a new account
export const createAccount = async (req, res) => {
  try {
    const { userId, bankName, accountType, bankBalance } = req.body;
    console.log(req.body);

    if (!userId || !bankName || !accountType) {
      return res.status(400).json({
        success: false,
        message: "User ID, bank name, and account type are required!",
      });
    }

    if (bankBalance < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bank balance cannot be negative!" });
    }

    const newAccount = new Account({
      userId,
      bankName,
      accountType,
      bankBalance: bankBalance || 0,
    });

    const savedAccount = await newAccount.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      account: savedAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating account",
      error,
    });
  }
};

// Get account details by user ID
export const getAccountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.params);
    console.log(userId);

    const account = await Account.find({ userId });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account retrieved successfully",
      account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching account",
      error,
    });
  }
};

// Update account balance
export const updateAccountBalance = async (req, res) => {
  console.log(req.body);
  console.log(req.params);

  try {
    const { accId } = req.params;
    const { amount, operation } = req.body; // operation: "add" or "subtract"

    console.log("accId: ", accId);
    console.log("req.params: ", req.params);
    console.log("amount: ", amount);
    console.log("operation: ", operation);

    // Validate input
    if (!accId || !amount || !operation) {
      return res.status(400).json({
        success: false,
        message: "Account ID, amount, and operation are required!",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number!",
      });
    }

    if (!["add", "sub"].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Operation must be either "add" or "subtract"!',
      });
    }

    // Find the account
    const account = await Account.findById(accId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found!",
      });
    }

    // Update balance based on operation
    if (operation === "add") {
      account.bankBalance += amount;
    } else if (operation === "sub") {
      if (account.bankBalance < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance!",
        });
      }
      account.bankBalance -= amount;
    }

    const updatedAccount = await account.save();

    return res.status(200).json({
      success: true,
      message: "Account balance updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating account balance",
      error,
    });
  }
};

// Delete account by account ID
export const deleteAccount = async (req, res) => {
  try {
    const { accId } = req.params;
    console.log("accId: ", accId);

    const account = await Account.findByIdAndDelete(accId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting account",
      error,
    });
  }
};

// Get Total Balance
export const getTotalBankBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.params);
    console.log(userId);

    const account = await Account.find({ userId });
    if (!account || account.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Accounts not found!",
        totalBalance: 0,
      });
    }

    const totalBalance = account.reduce((sum, acc) => sum + acc.bankBalance, 0);

    return res.status(200).json({
      success: true,
      message: "Total bank balance retrieved successfully",
      totalBalance,
    });
  } catch (error) {
    console.error("An Error Occurred: ", error);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Total Bank Balance",
      error,
    });
  }
};
