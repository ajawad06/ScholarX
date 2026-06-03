import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    requirements: { type: String, trim: true },
    startDate: { type: String, required: true },
    universityId: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

export const Program = mongoose.model('Program', programSchema);
