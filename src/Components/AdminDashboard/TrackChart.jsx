import useFetch from 'point-fetch-react';
import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { MdKeyboardArrowDown } from "react-icons/md";

const RevenueChart = ({ heading, dropdown }) => {
  const [chartData, setChartData] = React.useState([]);
  const [titles, setTitles] = React.useState([]);
  const { get } = useFetch({ state: {} });

  const getChartData = () => {
    get({
      endPoint: `/get-most-created-paths`,
      onSuccess: (res) => {
        if (res.data.data) {
          const percentages = res.data.data.map((item) => item.percentage);
          const titles = res.data.data.map((item) => item.title);
          setChartData([
            {
              name: 'Percentages',
              data: percentages,
            },
          ]);
          setTitles(titles);
        }
      },
    });
  };

  useEffect(() => {
    getChartData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      width: '100%',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#1976d2'],
    series: chartData,
    xaxis: {
      categories: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    yaxis: { show: false },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    tooltip: {
      y: {
        formatter: (value, { dataPointIndex }) => {
          return `${titles[dataPointIndex]}: ${value}%`;
        },
      },
      style: { fontSize: '12px', backgroundColor: '#879aad' },
      theme: 'light',
    },
    fill: { type: 'solid', opacity: 1 },
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="data-grid__heading" style={{ padding: '20px' }}>
        <h3>{heading}</h3>
        <button>
          {dropdown}
          <MdKeyboardArrowDown />
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <Chart
          options={chartOptions}
          series={chartData}
          type="line"
          height={250}
          width="100%"
        />
      </div>
    </div>
  );
};

export default RevenueChart;
