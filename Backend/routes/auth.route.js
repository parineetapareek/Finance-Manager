import express from "express";
import { signup } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post('/signup',signup);

export default authRoute;