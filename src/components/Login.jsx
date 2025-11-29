import React, { useState } from "react";
import { loginUser } from "../auth/authService";

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
      onLogin(result.user); // ✅ sets user in App.jsx
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back 👋</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
