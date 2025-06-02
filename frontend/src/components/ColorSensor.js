import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

const ColorSensor = ({ detectedHex, colorName, lastUpdated }) => {
  const [hex, setHex] = useState('#FFFFFF');

  useEffect(() => {
    if (Array.isArray(detectedHex)) {
      const [r, g, b] = detectedHex;
      setHex(`#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`);
    } else if (typeof detectedHex === 'string') {
      setHex(detectedHex.toUpperCase());
    }
  }, [detectedHex]);

  const isNormal = ['#00FFFF', '#87CEEB', '#ADD8E6'].includes(hex);
  const status = isNormal ? '✅ Normal Water Color' : '⚠️ Unusual Color Detected';

  return (
    <div className="color-sensor-panel">
      <h3>Color Recognition</h3>
      <div className="color-box" style={{ backgroundColor: hex }}></div>
      <p><strong>Detected:</strong> {colorName || 'Unknown'}</p>
      <p><strong>Status:</strong> {status}</p>
      <p className="timestamp">Last Updated: {lastUpdated}</p>
    </div>
  );
};

export default ColorSensor;
