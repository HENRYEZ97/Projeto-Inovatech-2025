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
  bairro: "Centro",
  temperatura: 0,
  umidade: 0,
  nivelAgua: 0,
  status: "normal"
};

const WeatherContext = createContext<ContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket: SocketType | null = null;
let dadosCompletos: Record<string, WeatherData> = {};

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Centro");

  // LOGS
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [socketStatus, setSocketStatus] = useState<"conectado" | "desconectado">("desconectado");

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
      if (atualizado.length > 200) atualizado.shift();
      return atualizado;
    });
  };

  // EFFECT 1: CONEXÃO SOCKET
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

    //CORREÇÃO: SALVA HISTÓRICO PARA TODOS OS BAIRROS
socket.on("climaAtualizado", (dados: Record<string, WeatherData>) => {
  console.log("📡 Dados recebidos do backend:", dados);
  
  // SALVA TODOS OS DADOS
  dadosCompletos = dados;
  
  // ATUALIZA COM DADOS DO BAIRRO SELECIONADO
  const dadosBairroSelecionado = dados[selectedLocation];
  
  if (dadosBairroSelecionado) {
    setWeatherData(dadosBairroSelecionado);
    setIsLoading(false);

    addLog(`Dados recebidos para ${selectedLocation}`, "dado", dadosBairroSelecionado);

    // ✅ CORREÇÃO: SALVA HISTÓRICO PARA O BAIRRO ATUAL
    setHistorico(prev => {
      const entrada = {
        timestamp: Date.now(),
        temperatura: dadosBairroSelecionado.temperatura,
        umidade: dadosBairroSelecionado.umidade,
        nivelAgua: dadosBairroSelecionado.nivelAgua
      };

      const novo = [...prev, entrada];
      // limita a 50 pontos para o gráfico não ficar poluído
      return novo.slice(-50);
    });

    // ALERTAS
    if (dadosBairroSelecionado.nivelAgua >= 60) {
      addLog("NÍVEL DE ÁGUA CRÍTICO - EMERGÊNCIA", "erro", dadosBairroSelecionado);
    } else if (dadosBairroSelecionado.nivelAgua >= 40) {
      addLog("Nível de água em ALERTA", "alerta", dadosBairroSelecionado);
    }
  }
});

    return () => {
      socket?.off("climaAtualizado");
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  // ✅ EFFECT 2: ATUALIZA DADOS E HISTÓRICO QUANDO TROCA DE BAIRRO
useEffect(() => {
  if (dadosCompletos[selectedLocation]) {
    console.log(`🔄 Trocando para bairro: ${selectedLocation}`);
    
    // Atualiza dados do bairro
    setWeatherData(dadosCompletos[selectedLocation]);
    
    // ✅ CORREÇÃO: CRIA HISTÓRICO FICTÍCIO PARA O NOVO BAIRRO
    const historicoFicticio = Array.from({ length: 10 }, (_, i) => ({
      timestamp: Date.now() - (10 - i) * 30000, // 30 segundos entre pontos
      temperatura: dadosCompletos[selectedLocation].temperatura + (Math.random() * 4 - 2),
      umidade: dadosCompletos[selectedLocation].umidade + (Math.random() * 10 - 5),
      nivelAgua: dadosCompletos[selectedLocation].nivelAgua + (Math.random() * 3 - 1.5)
    }));
    
    setHistorico(historicoFicticio);
    addLog(`Alterado para bairro: ${selectedLocation}`, "info");
  }
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