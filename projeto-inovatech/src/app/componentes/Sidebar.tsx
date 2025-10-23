'use client';
import { useWeather } from '../componentes/WeatherContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { selectedLocation, setSelectedLocation, weatherData } = useWeather();
  
  const locais: string[] = ["São José Operário 2", "Jorge Teixeira", "Cidade Nova", "Japiim"];
  const handleLocationClick = (local: string) => {
    setSelectedLocation(local);
    onClose();
  };
  const getStatusText = (): string => {
    switch(weatherData.status) {
        case 'alerta': return 'Alerta';
        case 'emergencia': return 'Emergência';
    default: return 'Normal';
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
        open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50 border-r border-gray-200`}>
      
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-br from-blue-200 to-blue-400 px-6">
            <h2 className="text-lg font-semibold text-white">Localidades</h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-blue-200 text-xl font-bold p-1 cursor-pointer rounded-full hover:bg-blue-700 w-8 h-8 flex items-center justify-center">
              ×
              </button>
            </div>
        <ul className="p-4 space-y-3">
        {locais.map((local: string) => (
      <li
      key={local}
      onClick={() => handleLocationClick(local)}
      className={`cursor-pointer p-3 rounded-lg transition-all duration-200 border font-bold ${
        selectedLocation === local 
          ? 'bg-blue-500 text-white border-blue-600 shadow-md' 
          : 'bg-gray-100 text-slate-500 border-gray-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300'
            }`}
            >
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              {local}
            </div>
          </li>
        ))}
      </ul>
      {/* Painel do status */}
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border cursor-pointer border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 text-center cursor-pointer">
             Status em Tempo Real
              </h3>
              <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
          <span className="text-blue-700">Local:</span>
        <span className="font-semibold text-blue-800">{selectedLocation}</span>
          </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                weatherData.status === 'normal' ? 'bg-green-100 text-green-800' :
                weatherData.status === 'alerta' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
                }`}>
                {getStatusText()}
              </span>
            </div>
          <div className="flex justify-between items-center">
        <span className="text-blue-700">Nível:</span>
          <span className="font-semibold text-blue-800">{weatherData.nivelAgua}</span>
            </div>
            <div className="text-center mt-3">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                🔄 Atualizando...
              </span>
            </div>
          </div>
        </div>
        </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
           <p className="text-xs text-slate-500 text-center">
            CLIMATECH - Monitoramento em Tempo Real
            </p>
          </div>
    </aside>
  );
}