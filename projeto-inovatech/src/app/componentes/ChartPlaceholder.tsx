"use client";
import React from "react";

export default function ChartPlaceholder() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text text-slate-700">Histórico (placeholder)</h3>
        <span className="text-xs text-slate-700">Gráfico em implementação</span>
      </div>

      <div className="h-48 flex items-center justify-center rounded-md border border-dashed border-slate-100 bg-slate-50 text-slate-300">
        <span>📈 Gráfico aqui (Recharts / Chart.js)</span>
      </div>
    </div>
  );
}
