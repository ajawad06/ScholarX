import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    criteria: { type: String, trim: true },
    fundingOrganization: { type: String, trim: true },
    coverage: { type: String, trim: true },
    amount: { type: Number, default: 0 },
    deadline: { type: String, required: true }
  },
  { timestamps: true }
);

export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
