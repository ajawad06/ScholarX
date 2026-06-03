import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  { timestamps: true }
);

export const University = mongoose.model('University', universitySchema);
