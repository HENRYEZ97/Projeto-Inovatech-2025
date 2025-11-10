// components/WeatherContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import  io  from "socket.io-client";
type SocketType = ReturnType<typeof io>;


interface WeatherData {
  bairro: string;
  temperatura: number;
  umidade: number;
  nivelAgua: number;
  status: "normal" | "alerta" | "emergencia";
}

interface ContextType {
  weatherData: WeatherData;
  isLoading: boolean;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

const defaultData: WeatherData = {
  bairro: "São José Operário 2",
  temperatura: 0,
  umidade: 0,
  nivelAgua: 0,
  status: "normal"
};

const WeatherContext = createContext<ContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
let socket: SocketType | null = null;


export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("São José Operário 2");

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL);
    }

    socket.on("connect", () => {
      console.log("⚡ conectado ao socket:", socket?.id);
    });

    socket.on("climaAtualizado", (dados: Record<string, WeatherData>) => {
      const local = dados[selectedLocation] || Object.values(dados)[0];
      if (local) {
        setWeatherData(local);
        setIsLoading(false);
      }
    });

    // request initial state (server already emits on connect)
    return () => {
      socket?.off("climaAtualizado");
      socket?.off("connect");
    };
  }, [selectedLocation]);

  return (
    <WeatherContext.Provider value={{ weatherData, isLoading, selectedLocation, setSelectedLocation }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather deve ser usado dentro de WeatherProvider");
  return ctx;
}
