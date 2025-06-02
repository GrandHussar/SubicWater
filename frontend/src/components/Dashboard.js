import React, { useEffect, useRef, useState } from 'react';
import '../styles/dashboard.css';
import Chart from 'chart.js/auto';
import GaugeChart from 'react-gauge-chart';
import Swal from 'sweetalert2';
import TopBar from './Topbar';
import WastewaterChart from './WasteWater';
import ColorSensor from './ColorSensor';
import Temperature from './Temperature';

const Dashboard = () => {
  const chartsRef = useRef({});
  const trendRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const phTimeRef = useRef(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [phValue, setPhValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('main');
  const [customNotifications, setCustomNotifications] = useState([]);
  const [phAlertShown, setPhAlertShown] = useState(false);
  const [distance, setDistance] = useState(0);
  const [colorHex, setColorHex] = useState('#FFFFFF');
  const [colorName, setColorName] = useState('Unknown');
  const [colorUpdated, setColorUpdated] = useState('');
  const [turbidity, setTurbidity] = useState(0);
  const [temperatureData, setTemperatureData] = useState([]);

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
          options: {
            animation: {
              duration: 500,
              easing: 'linear'
            },
            elements: {
              line: {
                tension: 0.4
              },
              point: {
                radius: 4,
                backgroundColor: '#fff',
                borderWidth: 2
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 0
                }
              },
              y: {
                beginAtZero: true
              }
            },
            ...options
          },
        });
      }
    };

    makeChart(trendRef, 'trendChart', 'line',
      Array.from({ length: 20 }, (_, i) => `T${i + 1}`),
      [
        {
          label: 'Trend A',
          data: Array.from({ length: 20 }, () => 20 + Math.random() * 4),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(255, 159, 64, 1)'
        }
      ]
    );

    makeChart(leftRef, 'leftGraph', 'line',
      Array.from({ length: 20 }, (_, i) => i + 1),
      [
        {
          label: 'Left Graph',
          data: Array.from({ length: 20 }, () => 20 + Math.random() * 4),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    );

    return () => {
      Object.values(chartsRef.current).forEach(chart => chart.destroy());
      chartsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/esp')
        .then(res => res.json())
        .then(data => {
          setPhValue(data.pH);
          setDistance(data.WaterLevel);
          setTurbidity(data.Turbidity);

          const [r, g, b] = data.Color || [255, 255, 255];
          const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();

          let condition = 'Unknown';
          if (r > 200 && g > 200 && b > 200) condition = 'Clean';
          else if (r > 150 && g > 150 && b > 150) condition = 'Slightly Dirty';
          else if (r > 100 && g > 100 && b > 100) condition = 'Muddy';
          else condition = 'Very Dirty';

          setColorHex(hex);
          setColorName(condition);

          const timeStr = new Date().toLocaleTimeString();
          setLastUpdated(timeStr);
          setColorUpdated(timeStr);

          const randomTemp = 20 + Math.random() * 4;
          setTemperatureData(prev => [...prev.slice(-29), randomTemp]);

          if (phTimeRef.current) phTimeRef.current.innerText = 'Updated: ' + timeStr;

          const isCritical = data.pH < 6 || data.pH > 8.5;

          if (isCritical && !phAlertShown) {
            Swal.fire({
              title: '⚠️ Abnormal pH Detected!',
              html: `<strong>pH Level:</strong> ${data.pH.toFixed(2)}<br><strong>Time:</strong> ${timeStr}`,
              icon: 'warning',
              confirmButtonText: 'Acknowledge',
              allowOutsideClick: false
            }).then(() => setPhAlertShown(true));

            setCustomNotifications(prev => {
              const hasPH = prev.some(notif => notif.type === 'ph');
              if (!hasPH) {
                return [{
                  id: Date.now(),
                  type: 'ph',
                  icon: '/water.png',
                  title: 'Abnormal pH!',
                  message: `pH is ${data.pH.toFixed(2)} at ${timeStr}`
                }, ...prev];
              }
              return prev;
            });
          }

          if (!isCritical && phAlertShown) setPhAlertShown(false);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [phAlertShown]);

  const handleSensorClick = (sensorName) => setSelectedSensor(sensorName);

  const sensors = [
   
  ];

  const renderSensorMap = () => {
    if (selectedSensor === 'main') {
      return (
        <>
          <div className="sensor-button-grid">
            {sensors.map(({ id, label }) => (
              <button key={id} onClick={() => handleSensorClick(id)} className="sensor-button">{label}</button>
            ))}
          </div>

          <Temperature data={temperatureData} animate />

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div className="ultrasonic-status-panel" style={{ flex: 1 }}>
              <h3>Ultrasonic Sensor (Water Level)</h3>
              <p className="water-level-label">Distance: <strong>{distance} cm</strong></p>
              <div className="distance-bar-wrapper">
                <div className="distance-bar-bg">
                  <div
                    className="distance-bar-fill"
                    style={{
                      width: `${Math.min(100, 100 - distance)}%`,
                      backgroundColor:
                        distance < 30 ? '#5BE12C' :
                        distance < 70 ? '#F5CD19' :
                        '#EA4228'
                    }}
                  ></div>
                </div>
              </div>
              <p>Status: {distance < 50 ? '🚧 Obstacle Detected' : '✅ Clear'}</p>
              <p>Last updated: {lastUpdated}</p>
            </div>

            <ColorSensor detectedHex={colorHex} colorName={colorName} lastUpdated={colorUpdated} />
          </div>
        </>
      );
    } else {
      return <p>Sensor view under construction...</p>;
    }
  };

  return (
    <div>
      <TopBar customNotifications={customNotifications} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />
      <div className="spacer"></div>
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="sensor-map">
          <h2>Sensor Map</h2>
          {renderSensorMap()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <WastewaterChart waterLevel={distance} turbidity={turbidity} />
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
            <div className="ph-time" ref={phTimeRef}>{lastUpdated ? `Updated: ${lastUpdated}` : 'Waiting...'}</div>
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
