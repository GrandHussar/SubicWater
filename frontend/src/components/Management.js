import React from 'react';
import '../styles/dashboard.css';
import '../styles/management.css';
import logo from '../assets/logo.png';

const SensorManagement = ({ sensors }) => {
  return (
    <div>
      <div className="top-bar">
        <div className="top-left">
          <img src={logo} alt="Logo" />
        </div>
        <div className="top-center">Sensor Management</div>
        <div className="top-right">
          <a href="/dashboard">Dashboard</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
        </div>
      </div>

      <div className="spacer"></div>

      <div className="management-card">
        <h2>Connected Sensors</h2>
        <table>
          <thead>
            <tr>
              <th>Sensor Name</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors && sensors.map((sensor, index) => (
              <tr key={index}>
                <td>{sensor.name}</td>
                <td>{sensor.type}</td>
                <td className={sensor.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {sensor.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorManagement;
