import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";

const calculateAllocations = (income, planType, customAllocations) => {
  let allocations = {};

  if (planType === "50/30/20") {
    allocations = {
      Needs: 0.5 * income,
      Wants: 0.3 * income,
      Savings: 0.2 * income,
    };
  } else if (planType === "60/30/10") {
    allocations = {
      Needs: 0.6 * income,
      Wants: 0.1 * income,
      Savings: 0.3 * income,
    };
  } else if (planType === "40/30/20/10") {
    allocations = {
      Needs: 0.4 * income,
      Wants: 0.3 * income,
      Savings: 0.2 * income,
      Investments: 0.1 * income,
    };
  } else if (planType === "Custom") {
    if (!customAllocations || typeof customAllocations !== "object") {
      throw new Error("Custom allocations required for Custom plan!");
    }

    const totalFraction = Object.values(customAllocations).reduce(
      (sum, fraction) => sum + fraction,
      0
    );

    const EPSILON = 0.0001; // Small tolerance to handle floating-point errors
    if (Math.abs(totalFraction - 1.0) > EPSILON) {
      throw new Error("Custom allocation fractions must sum up to 1!");
    }

    allocations = Object.fromEntries(
      Object.entries(customAllocations).map(([category, fraction]) => [
        category,
        fraction * income,
      ])
    );
  } else {
    throw new Error("Invalid plan type!");
  }

  return allocations;
};

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    const userId = req.user.userId;
    const { income, planType, isLocked, startDate, customAllocations } =
      req.body;
    console.log("req.body: ", req.body);

    const existingBudget = await Budget.findOne({ userId });
    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "A budget already exists for this user.",
      });
    }

    if (!income || !planType || !startDate) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required!!" });
    }

    if (typeof income !== "number" || income <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Income!!" });
    }

    if (planType !== "Custom" && customAllocations) {
      return res
        .status(403)
        .json({ success: false, message: "Custom Allocations not Allowed!" });
    }

    const allocations = calculateAllocations(
      income,
      planType,
      customAllocations
    );
    console.log("Allocations: ", allocations);

    // Validate Date Format
    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Date Format!" });
    }

    const lockEndDate = isLocked
      ? new Date(parsedDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      : undefined;
    const endDate = new Date(parsedDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const newBudget = new Budget({
      userId,
      income,
      planType,
      isLocked: isLocked || false,
      lockEndDate,
      startDate: parsedDate,
      endDate,
      allocations,
      remainingBudget: { ...allocations },
    });

    await newBudget.save();
    return res.status(201).json({
      success: true,
      message: "Budget Created Successfully!",
      budget: newBudget,
    });
  } catch (error) {
    console.error("Error Creating Budget: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Creating Budget!", error });
  }
};

//Get Budgets
export const getBudget = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    const budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "No Budget Found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Budget Fetched Successfully!", budget });
  } catch (error) {
    console.error("Error Fetching Budgets: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Fetching Budget!", error });
  }
};

export const updateBudget = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    const { income, planType, customAllocations } = req.body;
    console.log("req.body: ", req.body);

    const budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "No Budget Found!" });
    }

    if (budget.isLocked) {
      return res
        .status(400)
        .json({ success: false, message: "Cant Update Locked Budget!" });
    }

    if (income && (typeof income !== "number" || income < 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Income!" });
    }

    if (planType && planType !== "Custom" && customAllocations) {
      return res
        .status(403)
        .json({ success: false, message: "Custom Allocations not Allowed!" });
    }

    // Fetch all transactions linked to this budget
    const transactions = await Transaction.find({ budgetId: budget._id });
    console.log("transactions: ", transactions);

    // Calculate total spent per category
    const spentPerCategory = transactions.reduce((acc, transaction) => {
      acc[transaction.budgetAllocation] =
        (acc[transaction.budgetAllocation] || 0) + transaction.amount;
      return acc;
    }, {});
    console.log(spentPerCategory);

    // Determine updated allocations
    const updatedIncome = income !== undefined ? income : budget.income;
    const updatedPlanType = planType || budget.planType;
    const updatedCustomAllocations =
      planType === "Custom" ? customAllocations : budget.customAllocations;

    let updatedAllocations = budget.allocations;
    let updatedRemainingBudget = budget.remainingBudget;

    if (income || planType) {
      updatedAllocations = calculateAllocations(
        updatedIncome,
        updatedPlanType,
        updatedCustomAllocations
      );

      // Adjust remaining budget based on spent amounts
      updatedRemainingBudget = Object.fromEntries(
        Object.entries(updatedAllocations).map(([category, amount]) => [
          category,
          Math.max(amount - (spentPerCategory[category] || 0), 0),
        ])
      );
    }

    // Update budget document
    budget.set({
      income: updatedIncome,
      planType: updatedPlanType,
      allocations: updatedAllocations,
      remainingBudget: updatedRemainingBudget,
      customAllocations: updatedCustomAllocations,
    });

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully!",
      budget,
    });
  } catch (error) {
    console.error("Error Updating Budget! ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Updating Budget!", error });
  }
};

// Deleting Budget
export const deleteBudget = async (req, res) => {
  try {
    console.log("Requested User: ", req.user);
    console.log("userId: ", req.user.userId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    const budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "No budget found!" });
    }

    const transactions = await Transaction.find({ budgetId: budget._id });
    if (transactions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete budget with linked transactions!",
      });
    }

    await budget.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully!",
    });
  } catch (error) {
    console.error("Error Deleting Budget! ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Deleting Budget!", error });
  }
};
