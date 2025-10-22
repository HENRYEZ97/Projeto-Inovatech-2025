import WeatherItem from "./WeatherItem";

interface WeatherData {
  bairro: string;
  temperatura: number;
  condicao: string;
  chuva: string;
  nivelAgua: string;
  status: 'normal' | 'alerta' | 'emergencia';
}

export default function WeatherInfo() {
  // Dados mockados - depois vem da API
  const weatherData: WeatherData = {
    bairro: "São José Operário 2",
    temperatura: 31,
    condicao: "Ensolarado",
    chuva: "0%",
    nivelAgua: "12.4m",
    status: "normal"
  };

  // Determina o variant baseado no status
  const getStatusVariant = (): 'default' | 'warning' | 'danger' => {
    switch(weatherData.status) {
      case 'alerta': return 'warning';
      case 'emergencia': return 'danger';
      default: return 'default';
    }
  };

  const getStatusMessage = (): string => {
    switch(weatherData.status) {
      case 'alerta': return 'Alerta Preventivo';
      case 'emergencia': return '🚨 EVACUAR ÁREA!';
      default: return 'Situação Normal';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
      {/* Header com cidade e status */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600 mb-2">
          {weatherData.bairro}
        </h1>
        <div className={`inline-flex bg-green-200 cursor-pointer items-center gap-2 px-4 py-2 rounded-full ${
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
      <div className="space-y-3 cursor-pointer">
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
      <div className="mt-6 pt-4 border-t border-gray-200 cursor-pointer">
        <p className="text-xs text-gray-500 text-center">
          Atualizado em: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}