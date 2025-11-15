"use client";
import React from "react";

interface Props {
  localidade: string;
  statusLabel: string;
  statusClass: string;
}

export default function StatusHeader({ localidade, statusLabel, statusClass }: Props) {
  return (
    <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="text-sm text-slate-100">Localidade</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary text-slate-100">{localidade}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className={`px-3 py-2 rounded-full text-sm font-semibold ${statusClass} shadow-sm`}>
          {statusLabel}
        </div>
        <div className="text-xs text-slate-600">Atualização automática • 4s</div>
      </div>
    </header>
  );
}
