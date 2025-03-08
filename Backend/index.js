import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import authRoute from "./routes/auth.route.js";
import tranRouter from "./routes/transaction.route.js";
import accountRouter from "./routes/account.route.js";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Database Connection
connectDB();

// Routes
app.use("/", routes);
app.use("/auth", authRoute);
app.use("/transaction", tranRouter);
app.use("/account", accountRouter);

// Start Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
