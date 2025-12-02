import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  console.log("Connecting to MongoDB:", uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
