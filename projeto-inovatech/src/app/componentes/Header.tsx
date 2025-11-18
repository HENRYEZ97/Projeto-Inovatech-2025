"use client";
import { Menu, Waves, Activity } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-slate-800 via-slate-900 to-cyan-900 px-6 py-4 shadow-2xl border-b border-cyan-500/30">
      {/* Botão Menu */}
      <button 
        onClick={onMenuClick} 
        className="text-cyan-300 hover:text-white hover:bg-cyan-500/20 p-3 rounded-xl transition-all duration-300 cursor-pointer group"
      >
        <Menu size={26} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Logo/Título Central */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-500 rounded-xl shadow-lg">
          <Waves className="text-white" size={28} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            HYDROSENSE
          </h1>
          <p className="text-xs text-cyan-300/80 flex items-center gap-1 justify-center">
            <Activity size={12} />
            Monitoramento em Tempo Real
          </p>
        </div>
      </div>

      {/* Espaço vazio para alinhamento */}
      <div className="w-12 opacity-0">
        <Menu size={26} />
      </div>
    </header>
  );
}