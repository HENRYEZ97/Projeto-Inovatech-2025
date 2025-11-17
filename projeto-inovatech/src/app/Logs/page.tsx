"use client";

import LogsHeader from "./componentes/LogsHeader";
import LogsCharts from "./componentes/LogsCharts";
import LogsTable from "./componentes/LogsTable";
import NoDataMessage from "./componentes/NoDataMessage";
import { useWeather } from "@/app/componentes/WeatherContext";

export default function LogsPage() {
  const { logs } = useWeather();

  return (
      <div className="min-h-screen w-full bg-slate-800 to-[#0c1a22] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <LogsHeader count={logs.length} />

        {logs.length === 0 ? (
          <NoDataMessage />
        ) : (
          <>
            <LogsCharts logs={logs} />
            <LogsTable logs={logs} />
          </>
        )}

      </div>
    </div>
  );
}
