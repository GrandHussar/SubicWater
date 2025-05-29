import React from 'react';
import '../styles/dashboard.css';

const Settings = () => {
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        window.location.href = '/'; // redirect to homepage or login
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-left">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="top-center">Settings</div>
        <div className="top-right">
          <a href="/dashboard">Dashboard</a>
          <a href="/reports">Reports</a>
        </div>
      </div>

      <div className="spacer"></div>

      <div className="settings-container">
        <div className="card logout-card">
          <h2>Logout</h2>
          <p>Are you sure you want to end your session?</p>
          <form onSubmit={handleLogout}>
            <button type="submit" className="logout-button">Logout</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
