import React from 'react';
import logo from '../assets/logo.png';
import bell from '../assets/bell.jpg';
import settings from '../assets/settings.png';
import './TopBar.css';

function TopBar({ title = "Centralized Dashboard" }) {
  return (
    <div className="top-bar">
      <div className="top-left">
        <img src={logo} alt="Logo" />
      </div>

      <div className="top-center">{title}</div>

      <div className="top-right">
        <a href="/">Home</a>
        <a href="/reports">Reports</a>
        <a href="/settings">Settings</a>

        <div className="notification-wrapper">
          <img src={bell} className="icon" id="notificationBell" alt="Notifications" />
          <div className="notification-dropdown show">
            <div className="notif-message">
              <strong>NOTIFICATIONS</strong><hr />
            </div>

            <div className="notification-item">
              <img src={require('../assets/water.png')} className="notif-icon" />
              <div className="notif-message">
                <strong>WARNING!!</strong><br />
                Water leak detected
                <strong style={{ textAlign: 'right' }}>02/05/2025</strong>
              </div>
            </div>
            {/* More notifications... */}
          </div>
        </div>

        <img src={settings} className="icon" alt="Settings" />
      </div>
    </div>
  );
}

export default TopBar;
