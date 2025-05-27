import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [phData, setPhData] = useState({ ph: null, timestamp: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ph");
        setPhData(res.data);
      } catch (err) {
        console.error("Error fetching pH data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>PH Monitoring</h1>
      {phData.ph !== null ? (
        <>
          <p><strong>pH:</strong> {phData.ph}</p>
          <p><strong>Time:</strong> {new Date(phData.timestamp * 1000).toLocaleString()}</p>
        </>
      ) : (
        <p>Loading pH data...</p>
      )}
    </div>
  );
}

export default App;
