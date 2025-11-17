"use client";

interface LogsTableProps {
  logs: any[];
}

export default function LogsTable({ logs }: { logs: any[] }) {
  return (
    <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-3 text-cyan-400">
        Registro Completo
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-cyan-600/10">
            <tr>
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Mensagem</th>
              <th className="p-3">Temp (°C)</th>
              <th className="p-3">Umidade (%)</th>
              <th className="p-3">Nível (cm)</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-cyan-600/10 transition">
                <td className="p-3">{log.time}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.tipo === 'erro' ? 'bg-red-500/20 text-red-300' :
                    log.tipo === 'alerta' ? 'bg-orange-500/20 text-orange-300' :
                    log.tipo === 'dado' ? 'bg-green-500/20 text-green-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {log.tipo}
                  </span>
                </td>
                <td className="p-3">{log.mensagem}</td>
                <td className="p-3">{log.payload?.temperatura || '—'}</td>
                <td className="p-3">{log.payload?.umidade || '—'}</td>
                <td className="p-3">{log.payload?.nivelAgua || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}