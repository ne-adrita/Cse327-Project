// src/components/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../auth/authService";
import "../index.css";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await registerUser({ name, email, password, babyBirthDate });
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      onRegister(result.user);
    }
  };

  return (
    <div className="auth">
      <div className="auth-container card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>Baby Birth Date (optional)</label>
          <input type="date" value={babyBirthDate} onChange={(e) => setBabyBirthDate(e.target.value)} />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p style={{ color: "var(--danger)", marginTop: "12px" }}>{error}</p>}
      </div>
      <p style={{ marginTop: "20px", fontSize: "13px", textAlign: "center" }}>
        Already have an account?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("switchAuth", { detail: "login" })); }}>
          Login
        </a>
      </p>
    </div>
  );
}
