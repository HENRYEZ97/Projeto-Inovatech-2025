// components/WeatherItem.tsx
"use client";
interface Props {
  icon: string;
  label: string;
  value: string | number;
}
export default function WeatherItem({ icon, label, value }: Props) {
  return (
    <div className="flex justify-between items-center rounded-xl border-2 border-sky-100 p-3 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-sm text-slate-500">{label}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-slate-700">{value}</div>
      </div>
    </div>
  );
}
