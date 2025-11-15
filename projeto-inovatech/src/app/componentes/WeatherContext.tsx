"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import io from "socket.io-client";

type SocketType = ReturnType<typeof io>;

interface WeatherData {
  bairro: string;
  temperatura: number;
  umidade: number;
  nivelAgua: number;
  status: "normal" | "alerta" | "emergencia";
}

interface LogItem {
  id: string;
  time: string;
  tipo: "info" | "dado" | "alerta" | "erro";
  mensagem: string;
  payload?: any;
}

interface ContextType {
  weatherData: WeatherData;
  isLoading: boolean;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;

  // LOGS
  logs: LogItem[];
  addLog: (msg: string, tipo?: LogItem["tipo"], payload?: any) => void;
  socketStatus: "conectado" | "desconectado";

  // HISTÓRICO PARA O GRÁFICO
  historico: {
    timestamp: number;
    temperatura: number;
    umidade: number;
    nivelAgua: number;
  }[];
}

const defaultData: WeatherData = {
  bairro: "São José Operário 2",
  temperatura: 0,
  umidade: 0,
  nivelAgua: 0,
  status: "normal"
};

const WeatherContext = createContext<ContextType | undefined>(undefined);

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket: SocketType | null = null;

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(
    "São José Operário 2"
  );

  // LOGS
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [socketStatus, setSocketStatus] =
    useState<"conectado" | "desconectado">("desconectado");

  // HISTÓRICO
  const [historico, setHistorico] = useState<
    { timestamp: number; temperatura: number; umidade: number; nivelAgua: number }[]
  >([]);

  // FUNÇÃO PARA ADICIONAR LOG
  const addLog = (
    mensagem: string,
    tipo: LogItem["tipo"] = "info",
    payload?: any
  ) => {
    setLogs(prev => {
      const novoLog: LogItem = {
        id: Math.random().toString(36).slice(2),
        time: new Date().toLocaleTimeString("pt-BR"),
        tipo,
        mensagem,
        payload
      };

      const atualizado = [...prev, novoLog];

      // Limita para 200 registros
      if (atualizado.length > 200) atualizado.shift();

      return atualizado;
    });
  };

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL);
    }

    socket.on("connect", () => {
      setSocketStatus("conectado");
      addLog("Socket conectado ao servidor", "info");
    });

    socket.on("disconnect", () => {
      setSocketStatus("desconectado");
      addLog("Socket desconectado", "alerta");
    });

    // DADOS DO ESP32
    socket.on("climaAtualizado", (dados: Record<string, WeatherData>) => {
      const local = dados[selectedLocation] || Object.values(dados)[0];

      if (local) {
        setWeatherData(local);
        setIsLoading(false);

        addLog("Dado recebido do ESP32", "dado", local);

        // ADICIONA AO HISTÓRICO
        setHistorico(prev => {
          const entrada = {
            timestamp: Date.now(),
            temperatura: local.temperatura,
            umidade: local.umidade,
            nivelAgua: local.nivelAgua
          };

          const novo = [...prev, entrada];

          // limita a 200 pontos
          return novo.slice(-200);
        });

        // ALERTAS
        if (local.nivelAgua >= 60) {
          addLog("NÍVEL DE ÁGUA CRÍTICO - EMERGÊNCIA", "erro", local);
        } else if (local.nivelAgua >= 40) {
          addLog("Nível de água em ALERTA", "alerta", local);
        }
      }
    });

    return () => {
      socket?.off("climaAtualizado");
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, [selectedLocation]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isLoading,
        selectedLocation,
        setSelectedLocation,

        logs,
        addLog,
        socketStatus,

        historico
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx)
    throw new Error("useWeather deve ser usado dentro de WeatherProvider");
  return ctx;
}
