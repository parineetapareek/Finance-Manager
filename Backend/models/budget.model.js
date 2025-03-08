import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["50/30/20", "60/30/20", "40/30/20/10", "Custom"],
      required: true,
    },
    isLocked: { type: Boolean, default: false },
    lockEndDate: { type: Date },

    income: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    bankBalanceSnapshot: { type: Number, required: true },

    allocations: {
      needs: { type: Number, required: true },
      wants: { type: Number, required: true },
      savings: { type: Number, required: true },
      investments: { type: Number },
    },

    customAllocations: {
      type: Map,
      of: Number,
    },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],

    remainingBudget: {
      type: Number,
    },

    alerts: [
      {
        message: { type: String },
        date: { type: Date, default: Date.now },
        seen: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
