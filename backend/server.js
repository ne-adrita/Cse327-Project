import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import connectDB from "./src/config/db.js";

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Emotion Calendar API running" });
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on port ${port}`));
