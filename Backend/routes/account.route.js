import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountByUserId,
  getTotalBankBalance,
  updateAccountBalance,
} from "../controllers/account.controller.js";

const accountRouter = express.Router();

accountRouter.post("/create", createAccount);
accountRouter.get("/:userId", getAccountByUserId);
accountRouter.put("/update/:accId", updateAccountBalance);
accountRouter.delete("/del/:accId", deleteAccount);
accountRouter.get("/totalBal/:userId", getTotalBankBalance);

export default accountRouter;
