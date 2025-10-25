'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ioClient from 'socket.io-client'; // Import default, não destruturado

interface WeatherData {
  bairro: string;
  temperatura: number;
  condicao: string;
  chuva: string;
  nivelAgua: string;
  status: 'normal' | 'alerta' | 'emergencia';
}

interface WeatherContextType {
  weatherData: WeatherData;
  setSelectedLocation: (loc: string) => void;
  selectedLocation: string;
  isLoading: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Cria socket do lado do cliente
const socket = ioClient("http://localhost:4000");

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState("São José Operário 2");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    bairro: "São José Operário 2",
    temperatura: 0,
    condicao: "Carregando...",
    chuva: "0%",
    nivelAgua: "0m",
    status: "normal"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Conecta ao backend
    socket.on("connect", () => console.log("🔌 Conectado ao backend", socket.id));

    // Recebe dados em tempo real
    socket.on("climaAtualizado", (dados: Record<string, WeatherData>) => {
      const clima = dados[selectedLocation];
      if (clima) setWeatherData(clima);
      setIsLoading(false);
    });

    return () => {
      socket.off("climaAtualizado");
      socket.off("connect");
    };
  }, [selectedLocation]);

  return (
    <WeatherContext.Provider value={{ weatherData, setSelectedLocation, selectedLocation, isLoading }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather deve ser usado dentro de WeatherProvider");
  return ctx;
}
