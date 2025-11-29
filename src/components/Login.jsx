import React, { useState } from "react";
import { loginUser } from "../auth/authService";
import "../index.css"; // ensures theme styles are applied

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginUser(email, password);
    if (!result.success) {
      setError(result.message);
    } else {
      onLogin(result.user);
    }
  };

  return (
    <div className="auth" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div
        className="auth-container card"
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "32px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.6s ease"
        }}
      >
        {/* Logo / Branding */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "grid",
              placeItems: "center",
              fontSize: "28px",
              fontWeight: "700",
              margin: "0 auto 12px"
            }}
          >
            🌸
          </div>
          <h2 style={{ fontWeight: "700", fontSize: "22px", color: "var(--text)" }}>
            Emotion Calendar
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            Track your journey with care
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          <label style={{ fontSize: "13px", color: "var(--muted)" }}>Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // placeholder="Enter your email"
            placeholder="test@test.com"
          />

          <label style={{ fontSize: "13px", color: "var(--muted)" }}>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // placeholder="Enter your password"
            placeholder="1234"
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "16px", width: "100%" }}
          >
            Login
          </button>
        </form>

        {/* Error */}
        {error && (
          <p style={{ color: "var(--danger)", marginTop: "12px", fontSize: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* Footer */}
        <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--muted)", textAlign: "center" }}>
          Don’t have an account?{" "}
          <a href="#" style={{ color: "var(--accent)", fontWeight: "500" }}>
            Register (Dummy Link)
          </a>
        </p>
      </div>
    </div>
  );
}
