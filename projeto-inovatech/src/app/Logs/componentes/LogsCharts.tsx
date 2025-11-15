"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LogsCharts({ logs }: { logs: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Temperatura (°C)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#00e0ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Umidade (%)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="umid" stroke="#00ffa6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
