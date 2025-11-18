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
  // Filtra apenas logs que têm dados de payload (temperatura, umidade, nivelAgua)
  const logsComDados = logs.filter(log => 
    log.payload && 
    (log.payload.temperatura !== undefined || 
     log.payload.umidade !== undefined || 
     log.payload.nivelAgua !== undefined)
  );

  // Converte logs para o formato que o gráfico entende
  const chartData = logsComDados.map(log => ({
    time: log.time,
    temperatura: log.payload?.temperatura || 0,
    umidade: log.payload?.umidade || 0,
    nivelAgua: log.payload?.nivelAgua || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GRÁFICO DE TEMPERATURA - LARANJA */}
      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Temperatura (°C)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#444" />
            <XAxis 
              dataKey="time" 
              stroke="#aaa" 
              fontSize={12}
              tickFormatter={(value) => {
                // Formata a data para mostrar apenas hora:minuto
                if (value.includes(',')) {
                  return value.split(',')[1].trim(); // Pega apenas a hora
                }
                return value;
              }}
            />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="temperatura"
              stroke="#ff7b25" // LARANJA 🔥
              strokeWidth={3}
              dot={{ fill: "#ff7b25", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#ff7b25" }}
              name="Temperatura"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GRÁFICO DE NÍVEL DA ÁGUA - AZUL */}
      <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400">Nível da Água (cm)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#444" />
            <XAxis 
              dataKey="time" 
              stroke="#aaa" 
              fontSize={12}
              tickFormatter={(value) => {
                if (value.includes(',')) {
                  return value.split(',')[1].trim();
                }
                return value;
              }}
            />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="nivelAgua"
              stroke="#3b82f6" // AZUL 💧
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
              name="Nível Água"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}