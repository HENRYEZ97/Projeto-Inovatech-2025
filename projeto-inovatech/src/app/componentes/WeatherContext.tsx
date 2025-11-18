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

// Dados fixos para localStorage
const DADOS_BAIRROS_FIXOS = {
  "Cidade Nova": { temperatura: 26.5, umidade: 65, nivelAgua: 8.7 },
  "Grande Vitória": { temperatura: 28.2, umidade: 70, nivelAgua: 22.1 },
  "São José": { temperatura: 26.9, umidade: 68, nivelAgua: 12.4 }
};

// Dados fixos iniciais para logs
const REGISTROS_FIXOS_INICIAIS = [
  {
    id: "1",
    time: "15/01/2024 10:30:45",
    tipo: "dado" as const,
    mensagem: "Leitura normal - Centro",
    payload: { temperatura: 26.5, umidade: 68, nivelAgua: 12.3 }
  },
  {
    id: "2", 
    time: "15/01/2024 10:31:20",
    tipo: "dado" as const,
    mensagem: "Leitura estável - Cidade Nova",
    payload: DADOS_BAIRROS_FIXOS["Cidade Nova"]
  },
  {
    id: "3",
    time: "15/01/2024 10:32:05", 
    tipo: "alerta" as const,
    mensagem: "Nível elevado - Grande Vitória",
    payload: DADOS_BAIRROS_FIXOS["Grande Vitória"]
  },
  {
    id: "4",
    time: "15/01/2024 10:32:40",
    tipo: "dado" as const,
    mensagem: "Leitura normal - São José", 
    payload: DADOS_BAIRROS_FIXOS["São José"]
  }
];

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

  // CONTROLE PARA EVITAR DUPLICAÇÃO
  const [ultimoBairroSalvo, setUltimoBairroSalvo] = useState<string>("");

  // FUNÇÃO PARA SALVAR DADOS DE BAIRRO NO LOCALSTORAGE (EVITA DUPLICAÇÃO)
  const salvarDadosBairro = (bairro: string, dados: WeatherData, forcarSalvar: boolean = false) => {
    try {
      // ✅ EVITA DUPLICAÇÃO: Só salva se for bairro diferente OU forçar salvamento
      if (!forcarSalvar && ultimoBairroSalvo === bairro) {
        console.log(`⏭️ Pulando salvamento duplicado para ${bairro}`);
        return;
      }

      // Cria um log de DADOS
      const logDados: LogItem = {
        id: `dados-${Date.now()}-${bairro}`,
        time: new Date().toLocaleString("pt-BR"),
        tipo: "dado" as const,
        mensagem: `Leitura atual - ${bairro}`,
        payload: {
          temperatura: dados.temperatura,
          umidade: dados.umidade,
          nivelAgua: dados.nivelAgua
        }
      };

      // Pega logs existentes do localStorage
      const logsSalvos = localStorage.getItem('hydrosense_logs_completos');
      const logsExistentes = logsSalvos ? JSON.parse(logsSalvos) : REGISTROS_FIXOS_INICIAIS;
      
      // Adiciona o novo log de dados
      const todosLogs = [...logsExistentes, logDados];
      
      // Limita a 50 registros
      const logsLimitados = todosLogs.slice(-50);
      
      // Salva no localStorage
      localStorage.setItem('hydrosense_logs_completos', JSON.stringify(logsLimitados));
      
      // Atualiza controle do último bairro salvo
      setUltimoBairroSalvo(bairro);
      
      console.log(`✅ Dados de ${bairro} salvos no localStorage:`, dados);
    } catch (error) {
      console.error("❌ Erro ao salvar dados no localStorage:", error);
    }
  };

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

  // EFFECT 1: INICIALIZAR LOCALSTORAGE
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem('hydrosense_dados_fixos');
      const logsSalvos = localStorage.getItem('hydrosense_logs_completos');
      
      if (!dadosSalvos) {
        localStorage.setItem('hydrosense_dados_fixos', JSON.stringify(DADOS_BAIRROS_FIXOS));
      }
      
      if (!logsSalvos) {
        localStorage.setItem('hydrosense_logs_completos', JSON.stringify(REGISTROS_FIXOS_INICIAIS));
      }
      
      console.log("✅ Dados fixos inicializados no localStorage");
    } catch (error) {
      console.error("❌ Erro ao inicializar localStorage:", error);
    }
  }, []);

  // EFFECT 2: CONEXÃO SOCKET - SALVA APENAS QUANDO CHEGAM DADOS NOVOS
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

    socket.on("climaAtualizado", (dados: Record<string, WeatherData>) => {
      console.log("📡 Dados recebidos do backend:", dados);
      
      // SALVA TODOS OS DADOS
      dadosCompletos = dados;
      
      // ATUALIZA COM DADOS DO BAIRRO SELECIONADO
      const dadosBairroSelecionado = dados[selectedLocation];
      
      if (dadosBairroSelecionado) {
        setWeatherData(dadosBairroSelecionado);
        setIsLoading(false);

        // ✅ SALVA APENAS SE FOR DADOS DO CENTRO (ESP32) OU SE FORÇAR
        // Para bairros fictícios, só salva quando o usuário clicar
        if (selectedLocation === "Centro") {
          salvarDadosBairro(selectedLocation, dadosBairroSelecionado, true);
        }
        
        addLog(`Dados recebidos para ${selectedLocation}`, "dado", dadosBairroSelecionado);

        // SALVA HISTÓRICO FIXO
        setHistorico(prev => {
          const entrada = {
            timestamp: Date.now(),
            temperatura: dadosBairroSelecionado.temperatura,
            umidade: dadosBairroSelecionado.umidade,
            nivelAgua: dadosBairroSelecionado.nivelAgua
          };

          const novo = [...prev, entrada];
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
  }, [selectedLocation]);

  // ✅ EFFECT 3: QUANDO TROCA DE BAIRRO, SALVA APENAS UMA VEZ!
  useEffect(() => {
    if (dadosCompletos[selectedLocation]) {
      console.log(`🔄 Trocando para bairro: ${selectedLocation}`);
      
      const dadosBairro = dadosCompletos[selectedLocation];
      
      // Atualiza dados do bairro
      setWeatherData(dadosBairro);
      
      // ✅ SALVA OS DADOS DO NOVO BAIRRO (APENAS QUANDO O USUÁRIO CLICA)
      salvarDadosBairro(selectedLocation, dadosBairro);
      
      // HISTÓRICO FIXO
      const historicoFixo = Array.from({ length: 10 }, (_, i) => ({
        timestamp: Date.now() - (10 - i) * 30000,
        temperatura: dadosBairro.temperatura,
        umidade: dadosBairro.umidade,
        nivelAgua: dadosBairro.nivelAgua
      }));
      
      setHistorico(historicoFixo);
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