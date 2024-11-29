"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartCard = () => {
  const data = {
    labels: ["Proposal", "Sidang Kompre", "Sidang Proposal"],
    datasets: [
      {
        label: "Jumlah Pengajuan",
        data: [30, 25, 45], // Example data
        backgroundColor: ["#0ABEF9", "#47FE89", "#5750F1"], // Custom colors
        hoverBackgroundColor: ["#0ABEF9", "#47FE89", "#5750F1"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Allow flexible resizing
    responsive: true,
  };

  return (
    <div
      className="rounded-lg bg-white p-6 shadow-md"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "500px",
        margin: "0 auto",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartCard;
