import express from "express";
import { setCategories, setSavings } from "../controllers/saving.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const savingsRouter = express.Router();

savingsRouter.post("/setSavings", verifyToken, setSavings);
savingsRouter.post("/setCategories", verifyToken, setCategories);

export default savingsRouter;
