import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Temperature = ({ data }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map((_, i) => `T-${data.length - i}`),
        datasets: [{
          label: 'Room Temperature (°C)',
          data: data,
          borderColor: '#00E0FF',
          backgroundColor: 'rgba(0, 224, 255, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false
          },
          y: {
            beginAtZero: false,
            min: 10,
            max: 40,
            ticks: {
              stepSize: 2,
              color: '#ccc'
            },
            grid: {
              color: 'rgba(255,255,255,0.05)'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Temp: ${ctx.raw.toFixed(1)} °C`
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="temperature-chart-panel" style={{ height: 120, padding: 10, background: '#101010', borderRadius: 8 }}>
      <h3 style={{ color: '#00E0FF', marginBottom: 8 }}>Temperature (Last Readings)</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Temperature;
