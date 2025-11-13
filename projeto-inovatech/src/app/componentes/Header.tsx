// components/Header.tsx
"use client";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-gradient-to-br from-sky-100 to-cyan-300 px-6 py-4 shadow-sm border-b border-gray-200">
      <button onClick={onMenuClick} className="text-slate-600 hover:text-cyan-600 p-2 rounded-lg cursor-pointer">
        <Menu size={28} />
      </button>
      <h1 className="text-2xl font-bold text-slate-600">HYDROSENSE</h1>
      <div className="w-8" />
    </header>
  );
}
