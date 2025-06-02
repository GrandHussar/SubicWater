import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';

const WastewaterChart = ({ waterLevel = 0, turbidity = 0 }) => {
  const barRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(barRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Water Level', 'Turbidity'],
        datasets: [
          {
            label: 'Value (%)',
            data: [waterLevel, turbidity],
            backgroundColor: [
              'rgba(0, 150, 255, 0.7)',  // Blue for water level
              'rgba(255, 193, 7, 0.7)'   // Yellow for turbidity
            ],
            borderRadius: {
              topLeft: 8,
              topRight: 8
            },
            barThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#444',
              font: { size: 14, weight: 'bold' }
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#444',
              font: { size: 12 }
            },
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.raw}`
            }
          },
          title: {
            display: true,
            text: 'Wastewater Treatment Overview',
            color: '#007bff',
            font: { size: 20, weight: 'bold' },
            padding: { bottom: 20 }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [waterLevel, turbidity]);

  return (
    <div className="wastewater-treatment" style={{ height: 300 }}>
      <canvas ref={barRef} style={{ height: '100%' }} />
    </div>
  );
};

export default WastewaterChart;
