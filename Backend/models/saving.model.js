import mongoose from "mongoose";

const savingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
    },
    budgetSaving: {
      type: Number,
      min: 0,
      default: 0,
    },
    additionalSaving: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalSaved: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    categories: [
      {
        categoryName: {
          type: String,
          required: true,
          trim: true,
        },
        allocatedAmount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        savedAmount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        goal: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Savings = mongoose.model("Savings", savingSchema);

export default Savings;
