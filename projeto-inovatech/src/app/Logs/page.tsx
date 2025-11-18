"use client";

import LogsHeader from "./componentes/LogsHeader";
import LogsCharts from "./componentes/LogsCharts";
import LogsTable from "./componentes/LogsTable";
import NoDataMessage from "./componentes/NoDataMessage";
import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logsCompletos, setLogsCompletos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      // Carrega TODOS os logs do localStorage
      const logsSalvos = localStorage.getItem('hydrosense_logs_completos');
      
      if (logsSalvos) {
        setLogsCompletos(JSON.parse(logsSalvos));
      } else {
        setLogsCompletos([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar logs:", error);
      setLogsCompletos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen w-full bg-slate-800 to-[#0c1a22] text-white p-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-cyan-300">Carregando registros...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-800 to-[#0c1a22] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <LogsHeader count={logsCompletos.length} />

        {logsCompletos.length === 0 ? (
          <NoDataMessage />
        ) : (
          <>
            <LogsCharts logs={logsCompletos} />
            <LogsTable logs={logsCompletos} />
          </>
        )}

      </div>
      <br />

      <footer className="mt-30 text-center text-xs text-slate-100">
        © {new Date().getFullYear()} HYDROSENSE — Monitoramento de bairros - Todos os Direitos Reservados. 
      </footer>
    </div>
  );
}