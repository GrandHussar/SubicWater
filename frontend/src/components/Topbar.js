import React from 'react';

const TopBar = ({
  customNotifications,
  dropdownVisible,
  setDropdownVisible,
  title = "Centralized Dashboard" // 🔥 default fallback
}) => {
  return (
    <div className="top-bar">
      <div className="top-left">
        <img src="/logo.png" alt="Logo" />
      </div>

      <div className="top-center">
        {title}
      </div>

      <div className="top-right">
        <a href="/">Home</a>
        <a href="/reports">Reports</a>
        <a href="/settings">Settings</a>

        <div className={`notification-wrapper ${customNotifications.length > 0 ? 'has-alert' : ''}`}>
          <img
            src="/bell.jpg"
            className="icon"
            alt="Notifications"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          />

          <div className={`notification-dropdown ${dropdownVisible ? 'show' : ''}`}>
            <div className="notif-message">
              <strong>NOTIFICATIONS</strong>
              <hr />
            </div>

            {customNotifications.length === 0 ? (
              <>
                <div className="notification-item">
                  <img src="/water.png" className="notif-icon" />
                  <div className="notif-message">
                    <strong>WARNING!!</strong><br />Water leak detected
                  </div>
                </div>
                <div className="notification-item">
                  <img src="/water.png" className="notif-icon" />
                  <div className="notif-message">
                    <strong>ALERT!!</strong><br />Pressure too high
                  </div>
                </div>
              </>
            ) : (
              customNotifications.map(notif => (
                <div key={notif.id} className="notification-item">
                  <img src={notif.icon} className="notif-icon" />
                  <div className="notif-message">
                    <strong>{notif.title}</strong><br />
                    {notif.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <img src="/settings.png" className="icon" alt="Settings" />
      </div>
    </div>
  );
};

export default TopBar;
