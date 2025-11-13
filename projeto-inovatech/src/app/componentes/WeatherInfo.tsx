// components/WeatherInfo.tsx
"use client";
import { useWeather } from "./WeatherContext";
import WeatherItem from "./WeatherItem";

export default function WeatherInfo() {
  const { weatherData, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando com os sensores...</p>
        </div>
      </div>
    );
  }

  const statusVariant =
    weatherData.status === "normal" ? "default" :
    weatherData.status === "alerta" ? "warning" : "danger";

  return (
    <div className="flex cursor-pointer text-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold text-slate-700 mb-3 text-center">{weatherData.bairro}</h2>
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${
          weatherData.status === 'normal' ? 'bg-emerald-50 text-emerald-800' :
          weatherData.status === 'alerta' ? 'bg-yellow-50 text-yellow-800' :
          'bg-red-50 text-red-800'
        }`}>
          <span className="text-center font-semibold">
            {weatherData.status === 'normal' ? '✅ Situação Normal' :
             weatherData.status === 'alerta' ? '⚠️ Alerta' : '🚨 Emergência'}
          </span>
        </div>

        <div className="mt-6 space-y-3 w-100">
          <WeatherItem icon="🌡️" label="Temperatura" value={`${weatherData.temperatura.toFixed(1)}°C`} />
          <WeatherItem icon="💧" label="Umidade" value={`${weatherData.umidade.toFixed(1)}%`} />
          <WeatherItem icon="🌊" label="Qualidade do Ar" value={`${weatherData.nivelAgua.toFixed(1)} cm`} />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          Atualizado em: <span className="font-medium">{new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}
