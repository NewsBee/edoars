import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const BarChart = () => {
  const lightModeColors = ['#7366FF', '#03C9D7', '#00A82D'];
  const darkModeColors = ['#FFC107', '#FF5722', '#4CAF50'];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
      labels: {
        style: {
          colors: '#6b7280', // gray-500
        },
      },
    },
    yaxis: {
      title: {
        text: 'Jumlah',
        style: {
          color: '#6b7280', // gray-500
        },
      },
      labels: {
        style: {
          colors: '#6b7280', // gray-500
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      offsetY: -5,
      offsetX: -5,
      labels: {
        colors: '#6b7280', // gray-500
      },
    },
  };

  const series = [
    {
      name: 'Proposal',
      data: [10, 20, 15, 25, 20, 15, 30, 25, 10, 15, 10, 20],
    },
    {
      name: 'Sidang Konsep',
      data: [20, 15, 10, 15, 20, 25, 20, 15, 20, 10, 15, 25],
    },
    {
      name: 'Sidang Akhir',
      data: [15, 25, 20, 10, 15, 20, 15, 20, 25, 20, 15, 30],
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <Chart
        options={{
          ...options,
          colors: lightModeColors,
          chart: {
            ...options.chart,
            background: 'transparent',
          },
        }}
        series={series}
        type="bar"
        height={350}
        className="dark:hidden"
      />
      <Chart
        options={{
          ...options,
          colors: darkModeColors,
          chart: {
            ...options.chart,
            background: 'transparent',
          },
        }}
        series={series}
        type="bar"
        height={350}
        className="hidden dark:block"
      />
    </div>
  );
};

export default BarChart;
