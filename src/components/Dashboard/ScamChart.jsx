import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ChartPlaceholder from './ChartPlaceholder';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ScamChart = ({ data, type = 'line', title, height = 300 }) => {
  const chartContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set mounted state when component mounts
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Give DOM more time to initialize
    
    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: false, // We'll handle the title outside the chart
        text: title,
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11
        },
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  if (!isMounted || isLoading) {
    return <ChartPlaceholder title={title} height={height} isLoading={true} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dashboard-card chart-animate" ref={chartContainerRef}>
      <div className="p-6">
        {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
        <div style={{ height: `${height}px` }}>
          {type === 'line' ? (
            <Line data={data} options={options} />
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamChart; 