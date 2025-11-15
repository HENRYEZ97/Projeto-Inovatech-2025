"use client";
import React, { useEffect, useState } from "react";
import { useWeather } from "../WeatherContext";
import StatusHeader from "./StatusHeader";
import Metrics from "./Metrics";
import Chart from "../Chart";
import { CloudRain } from "lucide-react";
import { useRouter } from "next/navigation";


export default function WeatherPanel() {
  const { historico, weatherData, isLoading, selectedLocation } = useWeather();
  const router = useRouter();
  const abrirLogs = () => {
  router.push("/Logs");
};

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<string>("agora");

  useEffect(() => {
    if (!isLoading) {
      setLastUpdate(new Date());
    }
  }, [weatherData, isLoading]);

  // update elapsed label every second
  useEffect(() => {
    const t = setInterval(() => {
      if (!lastUpdate) {
        setElapsed("sem dados");
        return;
      }
      const diff = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
      if (diff < 5) setElapsed("agora");
      else if (diff < 60) setElapsed(`${diff}s atrás`);
      else setElapsed(`${Math.floor(diff / 60)}m atrás`);
    }, 1000);
    return () => clearInterval(t);
  }, [lastUpdate]);

  // map nivelAgua to UI status/colors (UI-only mapping)
  const nivel = weatherData?.nivelAgua ?? 0;
  let statusLabel = "Situação Normal";
  let statusClass = "bg-emerald-100 text-emerald-700";

  if (nivel >= 60) {
    statusLabel = "🚨 Emergência";
    statusClass = "bg-red-100 text-red-700";
  } else if (nivel >= 40) {
    statusLabel = "⚠️ Alerta";
    statusClass = "bg-orange-100 text-orange-700";
  } else if (nivel >= 20) {
    statusLabel = "🟡 Atenção";
    statusClass = "bg-yellow-100 text-yellow-800";
  } else {
    statusLabel = "✅ Situação Normal";
    statusClass = "bg-emerald-100 text-emerald-700";
  }

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">
      <div className="mb-6">
        <StatusHeader localidade={selectedLocation} statusLabel={statusLabel} statusClass={statusClass} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className=" cursor-pointer bg-gradient-to-br from-slate-900 to-cyan-50 p-6 rounded-2xl shadow-inner border border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <CloudRain className="text-secondary bg-slate-500" size={32} />
                </div>
                <div>
                  <div className="text-sm text-white">Visão Geral</div>
                  <div className="text-lg font-semibold text-text text-white">Monitoramento em tempo real</div>
                </div>
              </div>

              <div className="text-sm text-white text-right">
                Última atualização: <div className="font-medium text-text">{elapsed}</div>
                <div className="text-xs text-white">Intervalo do ESP32: 4s</div>
              </div>
            </div>
          </div>

          <Metrics
            temperatura={weatherData?.temperatura ?? 0}
            umidade={weatherData?.umidade ?? 0}
            nivelAgua={weatherData?.nivelAgua ?? 0}
            status={(weatherData?.status as any) ?? "normal"}
          />

          <div>
            <Chart data={historico} />

          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="bg-slate-700 p-4 rounded-2xl shadow-md border border-slate-100 cursor-pointer">
            <h4 className="text-sm text-white mb-2">Ações Rápidas</h4>
            <div className="flex flex-col gap-3 bg-slate-700">
              <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-95 transition">Histórico da leitura (simulado)</button>
              <button onClick={abrirLogs} className="cursor-pointer w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-cyan-300 transition bg-slate-50 font-semibold">Ver Logs</button>

              
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <h4 className="text-sm text-slate-700 mb-2">Informações</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>Localidade: <span className="font-medium text-text text-slate-700">São José Operário II</span></li>
              <li>Intervalo do ESP32: <span className="font-medium text-text text-slate-700">4s</span></li>
              <li>Status do backend: <span className="font-medium text-text text-slate-700">Conectado (socket)</span></li>
            </ul>
          </div>
        </aside>
      </div><br />

      <footer className="mt-25 text-center text-xs text-slate-100">
        © {new Date().getFullYear()} HYDROSENSE — Monitoramento de bairros - Todos os Direitos Reservados. 
      </footer>
    </div>
  );
}
