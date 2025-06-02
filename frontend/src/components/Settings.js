import React, { useState } from 'react';
import '../styles/dashboard.css';
import TopBar from './Topbar';

const Settings = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customNotifications, setCustomNotifications] = useState([]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      localStorage.removeItem("loggedIn");
      window.location.href = '/login';
    } catch (error) {
      alert("Logout failed.");
      console.error(error);
    }
  };

  return (
    <div>
      <TopBar
        title="Settings"
        customNotifications={customNotifications}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />

      <div className="spacer"></div>

      <div className="settings-container">
        <div className="card logout-card" style={{
          maxWidth: '400px',
          margin: '50px auto',
          padding: '30px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Log Out</h2>
          <p style={{ color: '#666', fontSize: '15px' }}>
            Are you sure you want to end your session?
          </p>
          <form onSubmit={handleLogout}>
            <button type="submit" style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '6px',
              marginTop: '20px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
