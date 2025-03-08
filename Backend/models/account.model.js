import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bankBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
