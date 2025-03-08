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
accountRouter.patch("/update/:userId", updateAccountBalance);
accountRouter.delete("/del/:userId", deleteAccount);

export default accountRouter;
