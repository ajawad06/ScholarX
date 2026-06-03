import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    dob: { type: String },
    nationality: { type: String, trim: true },
    contact: { type: String, trim: true },
    universityId: { type: Number, required: true, index: true },
    gpa: { type: Number, min: 0, max: 4 },
    password: { type: String, required: true },
    profilePic: { type: String, default: null }
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);
