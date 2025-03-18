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
      enum: ["50/30/20", "60/30/10", "40/30/20/10", "Custom"],
      required: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    lockEndDate: { type: Date },

    income: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    allocations: {
      type: Map,
      of: Number,
      required: true,
    },

    customAllocations: {
      type: Map,
      of: Number,
    },

    remainingBudget: {
      type: Map,
      of: Number,
      required: true,
    },

    // alerts: [
    //   {
    //     message: { type: String },
    //     date: { type: Date, default: Date.now },
    //     seen: { type: Boolean, default: false },
    //   },
    // ],
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
