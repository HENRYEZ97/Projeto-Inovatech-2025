"use client";

interface LogsHeaderProps {
  count: number;
}

export default function LogsHeader({ count }: { count: number }) {
  return (
    <header className="bg-[#111b22] border border-cyan-600/20 shadow-lg rounded-xl p-6">
      <h1 className="text-3xl font-bold text-cyan-400">
        Histórico do Sistema
      </h1>
      <p className="text-gray-300 mt-2">
        Monitoramento em tempo real • <span className="text-cyan-300">{count}</span> registros coletados
      </p>
    </header>
  );
}