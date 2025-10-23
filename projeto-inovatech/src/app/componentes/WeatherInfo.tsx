'use client';
import { useWeather } from '../componentes/WeatherContext';
import WeatherItem from "./WeatherItem";

export default function WeatherInfo() {
  const { weatherData, isLoading } = useWeather();

  const getStatusVariant = (): 'default' | 'warning' | 'danger' => {
    switch(weatherData.status) {
      case 'alerta': return 'warning';
      case 'emergencia': return 'danger';
      default: return 'default';
    }
  };

  const getStatusMessage = (): string => {
    switch(weatherData.status) {
      case 'alerta': return '⚠️ Alerta Preventivo';
      case 'emergencia': return '🚨 EVACUAR ÁREA!';
      default: return '✅ Situação Normal';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando com sensores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
      {/* Header com bairro e status */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600 mb-2">
          {weatherData.bairro}
        </h1>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          weatherData.status === 'normal' ? 'bg-green-100 text-green-800' :
          weatherData.status === 'alerta' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          <span className="text-sm font-semibold">
            {getStatusMessage()}
          </span>
        </div>
      </div>

      {/* Grid de informações meteorológicas */}
      <div className="cursor-pointer space-y-3">
        <WeatherItem 
          icon="🌡️" 
          label="Temperatura" 
          value={`${weatherData.temperatura}°C`}
          size="md"
        />
        
        <WeatherItem 
          icon="🌤️" 
          label="Condição" 
          value={weatherData.condicao}
          size="md"
        />
        
        <WeatherItem 
          icon="🌧️" 
          label="Precipitação" 
          value={weatherData.chuva}
          size="md"
        />
        
        <WeatherItem 
          icon="🌊" 
          label="Nível do rio" 
          value={weatherData.nivelAgua}
          variant={getStatusVariant()}
          size="md"
        />
      </div>

      {/* Footer com timestamp */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Atualizado em: {new Date().toLocaleString('pt-BR')}
        </p>
        <p className="text-xs text-blue-500 text-center mt-1">
          ⚡ Dados em tempo real do Arduino
        </p>
      </div>
    </div>
  );
}