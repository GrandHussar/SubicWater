import React, { useState } from 'react';
import '../styles/dashboard.css';
import TopBar from './Topbar'; // ✅ import reusable TopBar component

const Reports = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customNotifications, setCustomNotifications] = useState([]);

  return (
    <div>
      <TopBar
        customNotifications={customNotifications}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        title="Reports" // ✅ sets "Reports" as top-center title
      />

      <div className="spacer"></div>

      <div style={{ padding: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Timestamp</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>1</td>
              <td style={cellStyle}>2024-05-02 14:03</td>
              <td style={cellStyle}>XML | PDF</td>
            </tr>
            <tr>
              <td style={cellStyle}>2</td>
              <td style={cellStyle}>2024-05-02 14:04</td>
              <td style={cellStyle}>XML | PDF</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle = {
  padding: '12px',
  border: '1px solid #ccc',
};

export default Reports;
