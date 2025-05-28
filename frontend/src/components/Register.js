import React, { useState } from 'react';
import '../styles/login.css';
import logo from '../assets/logo.png';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();
      if (result.success) {
        alert("Registration successful! You can now log in.");
        window.location.href = "/login";
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (err) {
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
