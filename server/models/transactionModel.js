import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,

      enum: ["deposit", "withdraw", "transfer"],

      required: true,
    },

    amount: {
      type: Number,

      required: true,
    },

    status: {
      type: String,

      enum: ["pending", "completed", "failed"],

      default: "pending",
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    paymentMethod: {
      type: String,

      default: "mock",
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
