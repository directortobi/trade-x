import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTradingStore } from '../../store/tradingStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveChart: React.FC = () => {
  const { ticks, currentPrice } = useTradingStore();
  const chartRef = useRef<ChartJS<'line'>>(null);

  const data = {
    labels: ticks.map(tick => 
      new Date(tick.time).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Price',
        data: ticks.map(tick => tick.price),
        borderColor: '#00C9B3',
        backgroundColor: 'rgba(0, 201, 179, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Time: ${context[0].label}`,
          label: (context) => `Price: ${context.parsed.y.toFixed(4)}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: false
        },
        ticks: {
          color: '#a1a1aa',
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: false
        },
        ticks: {
          color: '#a1a1aa',
          callback: function(value) {
            return parseFloat(value.toString()).toFixed(4);
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#00C9B3',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2
      }
    }
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update('none');
    }
  }, [ticks]);

  return (
    <div className="chart-container">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default LiveChart;
