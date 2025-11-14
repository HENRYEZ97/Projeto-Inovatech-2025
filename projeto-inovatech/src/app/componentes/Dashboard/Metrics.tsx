"use client";
import React from "react";
import Card from "./Card";
import { Thermometer, Droplet, Waves, AlertTriangle } from "lucide-react";

interface Props {
  temperatura: number;
  umidade: number;
  nivelAgua: number;
  status: "normal" | "alerta" | "emergencia";
}

export default function Metrics({ temperatura, umidade, nivelAgua, status }: Props) {
  // border color classes
  const borderTemp = "border-accent";
  const borderUmid = "border-primary";
  const borderNivel = status === "emergencia" ? "border-red-400" : "border-secondary";
  const borderStatus = status === "normal" ? "border-emerald-400" : status === "alerta" ? "border-yellow-400" : "border-red-400";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Temperatura" value={`${temperatura.toFixed(1)}°C`} sub="Sensor DHT22" icon={<Thermometer />} borderClass={borderTemp} />
      <Card title="Umidade" value={`${umidade.toFixed(1)}%`} sub="Sensor DHT22" icon={<Droplet />} borderClass={borderUmid} />
      <Card title="Nível da Água" value={`${nivelAgua.toFixed(1)} cm`} sub="Medição Ultrassônica" icon={<Waves />} borderClass={borderNivel} />
      <Card title="Status" value={status === "normal" ? "Seguro" : status === "alerta" ? "Atenção" : "Emergência"} sub="Verifique medidas" icon={<AlertTriangle />} borderClass={borderStatus} />
    </div>
  );
}
