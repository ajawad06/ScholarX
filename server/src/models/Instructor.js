import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    universityId: { type: Number, required: true, index: true },
    fname: { type: String, required: true, trim: true },
    mname: { type: String, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contact: { type: String, required: true, trim: true },
    departments: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'An instructor must oversee at least one department.'
      }
    },
    password: { type: String, required: true },
    profilePic: { type: String, default: null }
  },
  { timestamps: true }
);

export const Instructor = mongoose.model('Instructor', instructorSchema);
