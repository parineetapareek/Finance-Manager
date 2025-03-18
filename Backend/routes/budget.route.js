import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudget,
  updateBudget,
} from "../controllers/budget.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const budgetRouter = express.Router();

budgetRouter.post("/create", verifyToken, createBudget);
budgetRouter.get("/get", verifyToken, getBudget);
budgetRouter.put("/update", verifyToken, updateBudget);
budgetRouter.delete("/del", verifyToken, deleteBudget);

export default budgetRouter;
