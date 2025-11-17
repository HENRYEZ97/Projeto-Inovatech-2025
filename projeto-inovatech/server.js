// server.js - VERSÃO COMPLETA E CORRIGIDA
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// middlewares
app.use(cors());
app.use(express.json());

// ==================== CONFIGURAÇÃO DOS BAIRROS ====================
const BAIRROS = ["Centro", "Cidade Nova", "Grande Vitória", "São José"];

// Dados iniciais para TODOS os bairros
let dadosClima = {
  "Centro": { bairro: "Centro", temperatura: 0, umidade: 0, nivelAgua: 0, status: "normal" },
  "Cidade Nova": { bairro: "Cidade Nova", temperatura: 0, umidade: 0, nivelAgua: 0, status: "normal" },
  "Grande Vitória": { bairro: "Grande Vitória", temperatura: 0, umidade: 0, nivelAgua: 0, status: "normal" },
  "São José": { bairro: "São José", temperatura: 0, umidade: 0, nivelAgua: 0, status: "normal" }
};

function calcularStatus(nivelCm) {
  if (nivelCm >= 25) return "emergencia";
  if (nivelCm >= 15) return "alerta";
  return "normal";
}

// ==================== GERAR DADOS FICTÍCIOS INTELIGENTES ====================
function gerarDadosFicticios() {
  const agora = new Date();
  const hora = agora.getHours();
  
  // Variação baseada na hora do dia (mais calor durante o dia)
  const variacaoDiurna = Math.sin((hora - 6) * Math.PI / 12) * 4;
  
  // Padrões diferentes para cada bairro
  const padroesBairros = {
    "Cidade Nova": {
      baseTemp: 26.5,
      baseUmidade: 65,
      baseNivel: 8.7,
      variacaoTemp: 2,
      variacaoNivel: 3
    },
    "Grande Vitória": {
      baseTemp: 28.2,
      baseUmidade: 70, 
      baseNivel: 22.1,
      variacaoTemp: 3,
      variacaoNivel: 5
    },
    "São José": {
      baseTemp: 26.9,
      baseUmidade: 68,
      baseNivel: 12.4,
      variacaoTemp: 2.5,
      variacaoNivel: 4
    }
  };

  // Atualiza cada bairro (exceto Centro)
  Object.keys(padroesBairros).forEach(bairro => {
    const padrao = padroesBairros[bairro];
    
    const novaTemperatura = padrao.baseTemp + variacaoDiurna + (Math.random() * padrao.variacaoTemp - padrao.variacaoTemp/2);
    const novaUmidade = padrao.baseUmidade + (Math.random() * 20 - 10);
    const novoNivel = padrao.baseNivel + (Math.random() * padrao.variacaoNivel - padrao.variacaoNivel/2);
    
    dadosClima[bairro] = {
      bairro: bairro,
      temperatura: parseFloat(novaTemperatura.toFixed(1)),
      umidade: parseFloat(novaUmidade.toFixed(1)),
      nivelAgua: parseFloat(novoNivel.toFixed(1)),
      status: calcularStatus(novoNivel)
    };
  });

  console.log("🔄 Dados fictícios atualizados para:", Object.keys(padroesBairros).join(", "));
  
  // 🔥🔥🔥 CORREÇÃO CRÍTICA: EMITE VIA SOCKET.IO SEMPRE QUE GERA DADOS
  io.emit("climaAtualizado", dadosClima);
}

// ==================== ROTAS ====================

// Rota GET para todos os bairros
app.get("/api/clima", (req, res) => {
  res.json(dadosClima);
});

// Rota GET específica por bairro
app.get("/api/clima/:bairro", (req, res) => {
  const { bairro } = req.params;
  if (dadosClima[bairro]) {
    res.json(dadosClima[bairro]);
  } else {
    res.status(404).json({ error: "Bairro não encontrado" });
  }
});

// Rota que ESP32 fará POST - ATUALIZA APENAS O CENTRO
app.post("/api/atualizar", (req, res) => {
  try {
    const { temperatura, umidade, nivelAgua } = req.body;

    console.log("📨 Dados recebidos do ESP32:", { temperatura, umidade, nivelAgua });

    // Processa nível da água
    let nivel = 0;
    if (typeof nivelAgua === "string") {
      const num = parseFloat(nivelAgua.replace(/[^\d.,-]/g, "").replace(",", "."));
      nivel = isNaN(num) ? 0 : num;
    } else if (typeof nivelAgua === "number") {
      nivel = nivelAgua;
    }

    const tempNum = Number(temperatura) || 0;
    const umidNum = Number(umidade) || 0;

    // ✅ DADOS REAIS - APENAS PARA O CENTRO
    dadosClima["Centro"] = {
      bairro: "Centro",
      temperatura: tempNum,
      umidade: umidNum,
      nivelAgua: parseFloat(nivel.toFixed(1)),
      status: calcularStatus(nivel),
    };

    // 🔄 ATUALIZA DADOS FICTÍCIOS PARA OUTROS BAIRROS
    gerarDadosFicticios();

    console.log("✅ Dados REAIS recebidos para Centro:", dadosClima["Centro"]);
    return res.json({ 
      ok: true, 
      message: "Dados recebidos com sucesso",
      bairro: "Centro" 
    });

  } catch (err) {
    console.error("❌ Erro ao processar /api/atualizar:", err);
    return res.status(500).json({ ok: false, error: "server error" });
  }
});

// ==================== SOCKET.IO ====================
io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
  
  // Envia dados de TODOS os bairros quando conecta
  socket.emit("climaAtualizado", dadosClima);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectou:", socket.id);
  });
});

// ==================== INICIALIZAÇÃO ====================

// Gera dados fictícios iniciais
gerarDadosFicticios();

// 🔥 ATUALIZA DADOS FICTÍCIOS AUTOMATICAMENTE A CADA 30 SEGUNDOS
setInterval(gerarDadosFicticios, 30000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🌎 Backend rodando em http://0.0.0.0:${PORT}`);
  console.log(`📊 Bairros monitorados: ${BAIRROS.join(", ")}`);
  console.log(`✅ Centro: Dados REAIS do ESP32`);
  console.log(`🤖 Outros: Dados FICTÍCIOS inteligentes (atualizando a cada 30s)`);
  console.log(`🚀 Sistema 100% funcional mesmo sem ESP32 conectado!`);
});