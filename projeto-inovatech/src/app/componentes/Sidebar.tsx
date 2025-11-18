"use client";
import { useWeather } from "./WeatherContext";
import { X, MapPin, Navigation, Waves } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { selectedLocation, setSelectedLocation } = useWeather();
  const locais = ["Centro", "Cidade Nova", "Grande Vitória", "São José"];

  const handleLocationClick = (loc: string) => {
    setSelectedLocation(loc);
    onClose();
  };

  return (
    <>
      {/* Overlay quando sidebar está aberto */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-900
        shadow-2xl transform transition-all duration-300 z-50
        border-r border-cyan-500/30
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-blue-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-lg">
                <Waves className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Localidades</h2>
                <p className="text-xs text-cyan-300">Selecione o bairro</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
            >
              <X className="text-cyan-300 hover:text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Lista de Bairros */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <MapPin className="text-cyan-400" size={16} />
            <span className="text-sm font-semibold text-cyan-400">BAIRROS</span>
          </div>
          
          <ul className="space-y-2">
            {locais.map((local) => (
              <li key={local}>
                <button
                  onClick={() => handleLocationClick(local)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-300 
                    border-2 backdrop-blur-sm
                    ${selectedLocation === local 
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg border-cyan-400 scale-[1.02]" 
                      : "bg-white/5 text-cyan-100 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:scale-[1.01]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{local}</span>
                    {selectedLocation === local && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className={`text-xs mt-1 ${selectedLocation === local ? 'text-cyan-100' : 'text-cyan-400'}`}>
                    {selectedLocation === local ? 'Monitorando...' : 'Clique para selecionar'}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/20 bg-slate-900/80">
          <div className="text-center">
            <div className="text-sm font-bold text-cyan-400 mb-1">HYDROSENSE</div>
            <div className="text-xs text-cyan-300/70">Sistema de Monitoramento</div>
            <div className="text-xs text-cyan-300/50 mt-1">4 Bairros • Tempo Real</div>
          </div>
        </div>
      </aside>
    </>
  );
}