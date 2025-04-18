import Budget from "../models/budget.model.js";
import Savings from "../models/saving.model.js";

// Set Savings
export const setSavings = async (req, res) => {
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
    const additionalSaving = Math.max(Number(req.body.additionalSaving) || 0);

    const budget = await Budget.findOne({ userId });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "No Budget Found!" });
    }
    console.log("budget: ", budget);
    console.log("budget.allocations: ", budget.allocations);

    const allocatedSavings = Number(budget.allocations?.get("Savings")) || 0;
    console.log("allocatedSavings: ", allocatedSavings);

    if (allocatedSavings === 0 && additionalSaving === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No savings allocation in budget, and no additional savings provided.",
      });
    }

    let savings = await Savings.findOne({
      userId: req.user.userId,
      budgetId: budget._id,
    });

    if (savings) {
      if (savings.budgetSaving !== allocatedSavings) {
        savings.budgetSaving = allocatedSavings;
      }
      savings.additionalSaving += additionalSaving;
      savings.totalSaved = savings.budgetSaving + savings.additionalSaving;
      await savings.save();
      console.log("Updated Savings: ", savings);
    } else {
      savings = new Savings({
        userId: req.user.userId,
        budgetId: budget._id,
        budgetSaving: allocatedSavings,
        additionalSaving: additionalSaving,
        totalSaved: additionalSaving + allocatedSavings,
      });
      await savings.save();
      console.log("New Savings Created: ", savings);
    }

    return res.status(201).json({
      success: true,
      message: "Savings Updated Successfully!",
      savings,
    });
  } catch (error) {
    console.error("Error While Setting Savings! ", error);
    return res.status(500).json({
      success: false,
      message: "An Error Occured while Setting Savings!",
      error,
    });
  }
};

export const setCategories = async (req, res) => {
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
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category must be provided.",
      });
    }

    const savings = await Savings.findOne({ userId });
    if (!savings) {
      return res.status(404).json({
        success: false,
        message: "Savings not found for the user",
      });
    }

    const totalAllocated = categories.reduce(
      (sum, cat) => sum + (cat.allocatedAmount || 0),
      0
    );
    console.log("totalAllocated: ",totalAllocated);

    if (totalAllocated > savings.totalSaved) {
      return res.status(400).json({
        success: false,
        message: "Total allocated amount cannot exceed total savings.",
      });
    }

    let hasUpdated = false;
    let hasNewCategory = false;

    for (const category of categories) {
      const { categoryName, allocatedAmount, savedAmount, goal } = category;

      if (
        !categoryName ||
        allocatedAmount == null ||
        savedAmount == null ||
        goal == null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each category must have categoryName, allocatedAmount, savedAmount, and goal!",
        });
      }

      // Ensure non-negative values
      const validAllocatedAmount = Math.max(0, allocatedAmount);
      const validSavedAmount = Math.max(0, savedAmount);
      const validGoal = Math.max(0, goal);

      const existingCategoryIndex = savings.categories.findIndex(
        (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
      );

      if (existingCategoryIndex !== -1) {
        const existingCategory = savings.categories[existingCategoryIndex];
        existingCategory.allocatedAmount = validAllocatedAmount;
        existingCategory.savedAmount = validSavedAmount;
        existingCategory.goal = validGoal;
        hasUpdated = true;
      } else {
        savings.categories.push({
          categoryName,
          allocatedAmount: validAllocatedAmount,
          savedAmount: validSavedAmount,
          goal: validGoal,
        });
      }
    }

    const remaining =
      savings.totalSaved -
      savings.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);

    const extraCategory = savings.categories.find(
      (cat) => cat.categoryName.toLowerCase() === "extra"
    );

    if (extraCategory) {
      extraCategory.allocatedAmount = remaining;
      extraCategory.savedAmount = remaining;
    } else if (remaining > 0) {
      savings.categories.push({
        categoryName: "Extra",
        allocatedAmount: remaining,
        savedAmount: remaining,
        goal: 0,
      });
    }

    await savings.save();

    return res.status(200).json({
      success: true,
      message: hasUpdated
        ? "Categories Updated Successfully!"
        : hasNewCategory
        ? "Categories Added Successfully!"
        : "Categories Set Successfully!",
      savings,
    });
  } catch (error) {
    console.log("An Error Occured while Setting Categories! ", error);
    return res.status(500).json({
      success: false,
      message: "An Error Occured while Setting Categories! ",
      error,
    });
  }
};
