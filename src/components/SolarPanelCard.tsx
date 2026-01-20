"use client";

import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface SolarPanelCardGraphProps {
  id: number;                     // ID impianto
  nomeParco: string;              // Nome impianto
  totaleKwh: number;              // Totale produzione
  produzioneGiornaliera: number[]; // Array kWh giornalieri
  date: string[];                 // Date corrispondenti
}

export default function SolarPanelCardGraph({
  id,
  nomeParco,
  totaleKwh,
  produzioneGiornaliera,
  date,
}: SolarPanelCardGraphProps) {
  const router = useRouter();

  const chartData = {
    labels: date,
    datasets: [
      {
        label: "kWh",
        data: produzioneGiornaliera,
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blu Tailwind
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/produzione/${id}`)}
      className="cursor-pointer bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
    >
      {/* Nome impianto */}
      <h2 className="text-xl font-bold mb-2">{nomeParco}</h2>

      {/* Totale produzione */}
      <p className="text-sm text-gray-500">Totale produzione</p>
      <p className="text-2xl font-bold text-blue-600 mb-4">
        {totaleKwh.toFixed(2)} kWh
      </p>

      {/* Mini grafico */}
      <div className="h-24">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}