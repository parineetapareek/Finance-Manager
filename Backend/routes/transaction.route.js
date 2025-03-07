import express from "express";
import {
  addTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const tranRouter = express.Router();

tranRouter.post("/addTransaction", verifyToken, addTransaction);
tranRouter.get("/getTransactions", verifyToken, getTransactions);
tranRouter.get("/getTransaction/:id", verifyToken, getTransactionById);
tranRouter.put("/updateTransaction/:id", verifyToken, updateTransaction);
tranRouter.delete("/deleteTransaction/:id", verifyToken, deleteTransaction);
tranRouter.delete(
  "/deleteTransactions",
  verifyToken,
  deleteMultipleTransactions
);

export default tranRouter;
