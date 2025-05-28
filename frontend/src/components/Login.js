import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import logo from '../assets/logo.png';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- use this for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();
      if (result.success) {
        onLogin();            // set loggedIn = true
        navigate('/');        // 👈 manually redirect to dashboard
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
