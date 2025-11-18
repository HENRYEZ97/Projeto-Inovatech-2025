"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface Props {
  data: {
    timestamp: number;
    temperatura: number;
    umidade: number;
    nivelAgua: number;
  }[];
}

export default function Chart({ data }: Props) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-slate-700">Histórico em Tempo Real</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} />
            <YAxis />

            <Tooltip labelFormatter={formatTime} />

            <Line type="monotone" dataKey="temperatura" stroke="#ff4d4f" name="Temperatura" />
            <Line type="monotone" dataKey="umidade" stroke="#3b82f6" name="Umidade" />
            <Line type="monotone" dataKey="nivelAgua" stroke="#059669" name="Nível da Água" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
