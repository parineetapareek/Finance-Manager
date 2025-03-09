// import Budget from "../models/budget.model.js";
// // import Account from "../models/Account.js";
// // import Transaction from "../models/Transaction.js";

// // Create a new budget
// export const createBudget = async (req, res) => {
//   try {
//     const {
//       userId,
//       accountId,
//       planType,
//       income,
//       startDate,
//       endDate,
//       allocations,
//       customAllocations,
//     } = req.body;

//     if (
//       !userId ||
//       !accountId ||
//       !planType ||
//       !income ||
//       !startDate ||
//       !endDate ||
//       !allocations
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided." });
//     }

//     const remainingBudget =
//       income - Object.values(allocations).reduce((acc, val) => acc + val, 0);

//     const newBudget = new Budget({
//       userId,
//       accountId,
//       planType,
//       income,
//       startDate,
//       endDate,
//       allocations,
//       customAllocations,
//       remainingBudget,
//     });

//     await newBudget.save();
//     res.status(201).json(newBudget);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all budgets for a user
// export const getBudgets = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const budgets = await Budget.find({ userId }).populate(
//       "accountId transactions"
//     );
//     res.status(200).json(budgets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single budget by ID
// export const getBudgetById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const budget = await Budget.findById(id).populate("accountId transactions");
//     if (!budget) return res.status(404).json({ message: "Budget not found." });
//     res.status(200).json(budget);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a budget
// export const updateBudget = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedBudget = await Budget.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedBudget)
//       return res.status(404).json({ message: "Budget not found." });
//     res.status(200).json(updatedBudget);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a budget
// export const deleteBudget = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedBudget = await Budget.findByIdAndDelete(id);
//     if (!deletedBudget)
//       return res.status(404).json({ message: "Budget not found." });
//     res.status(200).json({ message: "Budget deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Lock/Unlock budget
// export const toggleLockBudget = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isLocked, lockEndDate } = req.body;
//     const updatedBudget = await Budget.findByIdAndUpdate(
//       id,
//       { isLocked, lockEndDate },
//       { new: true }
//     );
//     res.status(200).json(updatedBudget);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
