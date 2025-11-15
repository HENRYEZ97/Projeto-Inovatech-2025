// components/Sidebar.tsx
"use client";
import { useWeather } from "./WeatherContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { selectedLocation, setSelectedLocation } = useWeather();
  const locais = ["São José Operário 2"];

  const handleLocationClick = (loc: string) => {
    setSelectedLocation(loc);
    onClose();
  };

  return (
    <aside className={`bg-gradient-to-b from-sky-100 to-cyan-200 fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50`}>
      <div className="p-6 border-b bg-gradient-to-br from-sky-200 to-cyan-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-600">Localidades</h2>
        <button onClick={onClose} className="text-black font-bold cursor-pointer hover:bg-blue-500 rounded-br-lg">×</button>
      </div>
      <ul className="p-4">
        {locais.map((local) => (
          <li key={local} onClick={() => handleLocationClick(local)}
            className={`cursor-pointer p-3 rounded-lg font-semibold ${selectedLocation === local ? "bg-cyan-500 text-white" : "bg-gray-100 text-slate-600" }`}>
            {local}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t text-center text-xs text-slate-500 bg-slate-50">HYDROSENSE - Monitoramento</div>
    </aside>
  );
}
