import React, { useEffect, useRef, useState } from 'react';
import '../styles/dashboard.css';
import Chart from 'chart.js/auto';
import GaugeChart from 'react-gauge-chart';

const Dashboard = () => {
  const chartsRef = useRef({});
  const trendRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const barRef = useRef(null);
  const phTimeRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [phValue, setPhValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('main');

  useEffect(() => {
    const destroyChart = (id) => {
      if (chartsRef.current[id]) {
        chartsRef.current[id].destroy();
        delete chartsRef.current[id];
      }
    };

    const makeChart = (ref, id, type, labels, datasets, options = {}) => {
      if (ref.current) {
        destroyChart(id);
        chartsRef.current[id] = new Chart(ref.current.getContext('2d'), {
          type,
          data: { labels, datasets },
          options,
        });
      }
    };

    makeChart(trendRef, 'trendChart', 'line',
      Array.from({ length: 10 }, (_, i) => `X${i + 1}`),
      [
        {
          label: 'Random Y - Blue',
          data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Random Y - Green',
          data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
          backgroundColor: 'rgba(75, 192, 75, 0.2)',
          borderColor: 'rgba(75, 192, 75, 1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    );

    makeChart(leftRef, 'leftGraph', 'line',
      Array.from({ length: 10 }, (_, i) => i + 1),
      [{
        label: 'Left Graph',
        data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4
      }]
    );

    makeChart(rightRef, 'rightGraph', 'line',
      Array.from({ length: 10 }, (_, i) => i + 1),
      [
        {
          label: 'Sensor A',
          data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Sensor B',
          data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    );

    makeChart(barRef, 'barChart', 'bar',
      ['Sensor A'],
      [{
        label: 'Wastewater Level',
        data: [70],
        backgroundColor: 'rgba(102, 255, 153, 0.8)',
        borderRadius: 5,
        barThickness: 30
      }],
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { display: true },
            ticks: { font: { size: 12 } }
          }
        },
        plugins: { legend: { display: false } }
      }
    );

    return () => {
      Object.values(chartsRef.current).forEach(chart => chart.destroy());
      chartsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/ph')
        .then(res => res.json())
        .then(data => {
          setPhValue(data.ph);
          const t = new Date(data.timestamp * 1000);
          setLastUpdated(t.toLocaleTimeString());
          if (phTimeRef.current) {
            phTimeRef.current.innerText = "Updated: " + t.toLocaleTimeString();
          }
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSensorClick = (sensorName) => {
    setSelectedSensor(sensorName);
  };

  const sensors = [
    { id: 'ph', label: 'pH Sensor' },
    { id: 'temp', label: 'Temperature Sensor' },
    { id: 'flow', label: 'Water Flow Sensor' },
    { id: 'turbidity', label: 'Turbidity Sensor' },
    { id: 'ultrasonic', label: 'Ultrasonic Sensor' },
    { id: 'color', label: 'Color Recognition Sensor' }
  ];

  const renderSensorMap = () => {
    if (selectedSensor === 'main') {
      return (
        <div className="sensor-button-grid">
          {sensors.map(({ id, label }) => (
            <button key={id} onClick={() => handleSensorClick(id)} className="sensor-button">{label}</button>
          ))}
        </div>
      );
    } else if (selectedSensor === 'ph') {
      return (
        <div className="sensor-detail-box">
          <h3>pH Sensor (PH0-14)</h3>
          <p>Measures acidity or alkalinity (0–14).</p>
          <GaugeChart
            id="ph-gauge-detail"
            nrOfLevels={5}
            colors={["#EA4228", "#F5CD19", "#5BE12C", "#007F00", "#004400"]}
            arcWidth={0.3}
            percent={phValue / 14}
            textColor="#000"
            formatTextValue={() => phValue.toFixed(2)}
          />
          <p>Status: OK ✅</p>
          <p>Last updated: {lastUpdated}</p>
          <button className="back-button" onClick={() => handleSensorClick('main')}>Back</button>
        </div>
      );
    } else {
      const sensor = sensors.find(s => s.id === selectedSensor);
      return (
        <div className="sensor-detail-box">
          <h3>{sensor?.label}</h3>
          <p>Details for {sensor?.label} go here.</p>
          <button className="back-button" onClick={() => handleSensorClick('main')}>Back</button>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="top-left"><img src="/logo.png" alt="Logo" /></div>
        <div className="top-center">Centralized Dashboard</div>
        <div className="top-right">
          <a href="#">Home</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
          <div className="notification-wrapper">
            <img
              src="/bell.jpg"
              className="icon"
              alt="Notifications"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />
            <div className={`notification-dropdown ${dropdownVisible ? 'show' : ''}`}>
              <div className="notif-message"><strong>NOTIFICATIONS</strong><hr /></div>
              <div className="notification-item">
                <img src="/water.png" className="notif-icon" />
                <div className="notif-message"><strong>WARNING!!</strong><br />Water leak detected</div>
              </div>
              <div className="notification-item">
                <img src="/water.png" className="notif-icon" />
                <div className="notif-message"><strong>ALERT!!</strong><br />Pressure too high</div>
              </div>
            </div>
          </div>
          <img src="/settings.png" className="icon" alt="Settings" />
        </div>
      </div>

      <div className="spacer"></div>

      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="sensor-map">
          <h2>Sensor Map</h2>
          {renderSensorMap()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="wastewater-treatment">
            <h2>Wastewater Treatment</h2>
            <canvas ref={barRef} />
            <div className="live-ph-box">
              <h3>Live pH Level</h3>
              <GaugeChart
                id="ph-gauge"
                nrOfLevels={5}
                colors={["#EA4228", "#F5CD19", "#5BE12C", "#007F00", "#004400"]}
                arcWidth={0.3}
                percent={phValue / 14}
                textColor="#000"
                formatTextValue={() => phValue.toFixed(2)}
              />
              <div className="ph-time" ref={phTimeRef}>Waiting...</div>
            </div>
          </div>

          <div className="trend-analysis">
            <h2>Trend Analysis</h2>
            <canvas ref={trendRef} />
            <div className="dual-graphs">
              <div><h3>Realtime Signal</h3><canvas ref={leftRef} /></div>
              <div><h3>Status Overview</h3><canvas ref={rightRef} /></div>
            </div>
          </div>

          <a href="/management" className="sensor-management-link">
            <div className="sensor-management">Sensor Management →</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
