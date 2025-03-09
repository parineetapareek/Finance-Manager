import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountByUserId,
  updateAccountBalance,
} from "../controllers/account.controller.js";

const accountRouter = express.Router();

accountRouter.post("/create", createAccount);
accountRouter.get("/:userId", getAccountByUserId);
accountRouter.put("/update/:accId", updateAccountBalance);
accountRouter.delete("/del/:accId", deleteAccount);

export default accountRouter;
