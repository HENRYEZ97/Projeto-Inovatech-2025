"use client";
import React from "react";

interface CardProps {
  title: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  borderClass?: string;
}

export default function Card({ title, value, sub, icon, borderClass }: CardProps) {
  return (
    <div className={`bg-slate-700 cursor-pointer rounded-2xl p-4 shadow-md border-t-4 ${borderClass || "border-primary"} transition hover:scale-[1.03]`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white">{title}</div>
          <div className="mt-2 text-2xl font-bold text-text text-white">{value}</div>
          {sub && <div className="mt-1 text-xs text-white text-slate-800">{sub}</div>}
        </div>
        <div className="text-3xl text-primary text-white">{icon}</div>
      </div>
    </div>
  );
}
