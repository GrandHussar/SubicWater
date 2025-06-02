import React, { useEffect, useState } from 'react';
import '../styles/management.css';
import TopBar from './Topbar';

const Management = () => {
  const [sensors, setSensors] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customNotifications, setCustomNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/management', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setSensors(data))
      .catch(err => console.error('Failed to load sensors', err));
  }, []);

  return (
    <div>
      <TopBar
        title="Sensor Management"
        customNotifications={customNotifications}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />

      <div className="spacer"></div>

      <div className="management-card">
        <h2>Connected Sensors</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor, index) => (
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

export default Management;
