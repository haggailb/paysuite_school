import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // Ensures points can be rendered
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Revenue',
        data: [1724950.92, 1900220, 750240],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(55, 105, 39, 0.2)',
        fill: false,
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: 'Expenditure',
        data: [2724950.92, 2300220, 2450240],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 0, 0)',
        fill: false,
        tension: 0.1,
        pointRadius: 7,
      }
    ]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Monthly Revenue and Expenditure'
      }
    }
  };

  return (
    <div className="trends hoverable">
      <Line data={data} options={options} ref={chartRef} />
    </div>
  );
};

export default RevenueChart;
