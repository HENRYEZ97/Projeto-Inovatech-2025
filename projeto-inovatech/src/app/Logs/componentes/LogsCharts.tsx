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

interface LogsChartsProps {
  logs: any[];
}

export default function LogsCharts({ logs }: { logs: any[] }) {
  // Converte logs para o formato que o gráfico entende
  const chartData = logs.map(log => ({
    time: log.time,
    // ✅ CORREÇÃO: Usa os nomes corretos das propriedades
    temperatura: log.payload?.temperatura || 0,
    umidade: log.payload?.umidade || 0,
    nivelAgua: log.payload?.nivelAgua || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Temperatura (°C)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="temperatura"  // ✅ Nome correto
              stroke="#00e0ff" 
              strokeWidth={2} 
              name="Temperatura"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Nível da Água (cm)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="nivelAgua"  // ✅ Nome correto
              stroke="#00ffa6" 
              strokeWidth={2} 
              name="Nível Água"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}