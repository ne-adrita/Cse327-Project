import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    babyBirthDate: { type: Date },
    // optional profile fields
    avatar: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
