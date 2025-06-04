import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import TopBar from './Topbar';

const Reports = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customNotifications, setCustomNotifications] = useState([]);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/groups')
      .then(res => res.json())
      .then(data => setGroupData(data))
      .catch(err => console.error('Failed to fetch group data:', err));
  }, []);

  return (
    <div>
      <TopBar
        customNotifications={customNotifications}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        title="Reports"
      />

      <div className="spacer"></div>

      <div style={{ padding: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
          <thead>
            <tr style={{ backgroundColor: '#c0d8c0' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Timestamp</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
  {groupData
    .filter(group => new Date(group.end_time) <= new Date()) // ✅ Show only completed groups
    .map(group => (
      <tr key={group.id}>
        <td style={cellStyle}>{group.id}</td>
        <td style={cellStyle}>{new Date(group.start_time).toLocaleString()}</td>
        <td style={cellStyle}>
          <a
            href={`http://localhost:5000/api/export/xml/${group.id}`}
            download={`group_${group.id}.xml`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: '#007BFF' }}
          >
            XML
          </a>
       
        </td>
      </tr>
  ))}
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
