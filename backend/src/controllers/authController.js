import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { name, email, password, babyBirthDate } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      babyBirthDate: babyBirthDate ? new Date(babyBirthDate) : undefined
    });

    const payload = { id: user._id.toString(), email: user.email, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, babyBirthDate: user.babyBirthDate },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const payload = { id: user._id.toString(), email: user.email, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, babyBirthDate: user.babyBirthDate },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: "Missing refreshToken" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, email: decoded.email, name: decoded.name };
    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
}
