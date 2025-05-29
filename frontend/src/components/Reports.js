import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Reports = () => {
  return (
    <div>
      <div className="top-bar">
        <div className="top-left">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="top-center">Reports</div>
        <div className="top-right">
          <Link to="/#">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="#">Settings</Link>
        </div>
      </div>

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
