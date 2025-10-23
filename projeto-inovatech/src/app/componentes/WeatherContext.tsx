'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  setWeatherData: (data: WeatherData) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  isLoading: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    bairro: "São José Operário 2",
    temperatura: 31,
    condicao: "Ensolarado",
    chuva: "0%",
    nivelAgua: "12.4m",
    status: "normal"
  });

  const [selectedLocation, setSelectedLocation] = useState<string>("São José Operário 2");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataFromArduino = async () => {
      setIsLoading(true);
      try {
        // NESTA FUNÇÃO PODEMOS FAZER A CONEXÃO COM O ARDUÍNO
        const simulatedData: WeatherData = {
          bairro: selectedLocation,
          temperatura: Math.floor(Math.random() * 15) + 20,
          condicao: ["Ensolarado", "Parcialmente Nublado", "Chuvoso"][Math.floor(Math.random() * 3)],
          chuva: `${Math.floor(Math.random() * 100)}%`,
          nivelAgua: `${(Math.random() * 8 + 10).toFixed(1)}m`,
          status: Math.random() > 0.7 ? "alerta" : Math.random() > 0.9 ? "emergencia" : "normal"
        };
        
        setWeatherData(simulatedData);
        console.log('📡 Dados atualizados:', simulatedData);
        
      } catch (error) {
        console.error('❌ Erro ao buscar dados do Arduino:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromArduino();
    const interval = setInterval(fetchDataFromArduino, 3000);

    return () => clearInterval(interval);
  }, [selectedLocation]);

  return (
    <WeatherContext.Provider value={{
      weatherData,
      setWeatherData,
      selectedLocation,
      setSelectedLocation,
      isLoading
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather deve ser usado dentro de WeatherProvider');
  }
  return context;
};