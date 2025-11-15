export default function LogsTable({ logs }: { logs: any[] }) {
  return (
    <div className="bg-[#111b22] p-6 border border-cyan-600/20 rounded-xl shadow-lg rounded-xl">

      <h2 className="text-xl font-semibold mb-3 text-cyan-400">
        Registro Completo
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-cyan-600/10">
            <tr>
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Temp (°C)</th>
              <th className="p-3">Umidade (%)</th>
              <th className="p-3">Nível (cm)</th>
              <th className="p-3">Alerta</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-cyan-600/10 transition">
                <td className="p-3">{log.time}</td>
                <td className="p-3">{log.temp}</td>
                <td className="p-3">{log.umid}</td>
                <td className="p-3">{log.dist}</td>
                <td className="p-3 text-red-400 font-semibold">
                  {log.alert ? "⚠️ Enchente" : "—"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
