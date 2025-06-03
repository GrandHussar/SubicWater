import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';

const Temperature = ({ data }) => {
  const tempRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (tempRef.current) {
      if (chartInstance.current) {
        chartInstance.current.data.labels = data.map((_, i) => i + 1);
        chartInstance.current.data.datasets[0].data = data;
        chartInstance.current.update(); // smooth update
      } else {
        chartInstance.current = new Chart(tempRef.current, {
          type: 'line',
          data: {
            labels: data.map((_, i) => i + 1),
            datasets: [
              {
                label: 'Temperature °C',
                data,
                backgroundColor: 'rgb(15, 2, 5)',
                borderColor: 'rgb(99, 125, 255)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 500,
              easing: 'easeOutCubic'
            },
            plugins: {
              legend: { display: true }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Time' }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Temp (°C)' }
              }
            }
          }
        });
      }
    }
  }, [data]);

  return (
  <div className="temperature-chart-container">
    <canvas ref={tempRef}></canvas>
  </div>
);

};

export default Temperature;
