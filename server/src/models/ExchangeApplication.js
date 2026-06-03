import mongoose from "mongoose";

const exchangeApplicationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    studentId: { type: Number, required: true, index: true },
    programId: { type: Number, required: true, index: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    applicationDate: { type: String, required: true },
    approvalDate: { type: String, default: null },
    studentIdCard: { type: String, required: true },
    personalStatement: { type: String, required: true },
    transcript: { type: String, required: true },
    recommendationLetter: { type: String, required: true },
  },
  { timestamps: true },
);

export const ExchangeApplication = mongoose.model(
  "ExchangeApplication",
  exchangeApplicationSchema,
);
