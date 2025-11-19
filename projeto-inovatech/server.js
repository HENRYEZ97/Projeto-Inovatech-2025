import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

//middlewares
app.use(cors());
app.use(express.json());

//Array dos dados
const BAIRROS = ["Centro", "Cidade Nova", "Grande Vitória", "São José"];

//Dados fictícios fixos para os bairros
const DADOS_BAIRROS_FIXOS = {
  "Cidade Nova": { 
    bairro: "Cidade Nova", 
    temperatura: 26.5, 
    umidade: 65, 
    nivelAgua: 8.7, 
    status: "normal" 
  },
  "Grande Vitória": { 
    bairro: "Grande Vitória", 
    temperatura: 28.2, 
    umidade: 70, 
    nivelAgua: 22.1, 
    status: "alerta" 
  },
  "São José": { 
    bairro: "São José", 
    temperatura: 26.9, 
    umidade: 68, 
    nivelAgua: 12.4, 
    status: "normal" 
  }
};

//Dados iniciais para todos os bairros
let dadosClima = {
  "Centro": { bairro: "Centro", temperatura: 0, umidade: 0, nivelAgua: 0, status: "normal" },
  "Cidade Nova": DADOS_BAIRROS_FIXOS["Cidade Nova"],
  "Grande Vitória": DADOS_BAIRROS_FIXOS["Grande Vitória"],
  "São José": DADOS_BAIRROS_FIXOS["São José"]
};

function calcularStatus(nivelCm) {
  if (nivelCm >= 25) return "emergencia";
  if (nivelCm >= 15) return "alerta";
  return "normal";
}

//Dados fixos
function inicializarDadosFicticios() {
  // Aplica dados FIXOS aos bairros fictícios
  Object.keys(DADOS_BAIRROS_FIXOS).forEach(bairro => {
    dadosClima[bairro] = DADOS_BAIRROS_FIXOS[bairro];
  });
  
  console.log("Dados fixos aplicados para bairros fictícios");
  io.emit("climaAtualizado", dadosClima);
}

//Rotas
//Rota get para todos os bairros
app.get("/api/clima", (req, res) => {
  res.json(dadosClima);
});

//Rota get específica por bairro
app.get("/api/clima/:bairro", (req, res) => {
  const { bairro } = req.params;
  if (dadosClima[bairro]) {
    res.json(dadosClima[bairro]);
  } else {
    res.status(404).json({ error: "Bairro não encontrado" });
  }
});

//Rota para atualizar dados do ESP32 (apenas o bairro Centro)
app.post("/api/atualizar", (req, res) => {
  try {
    const { temperatura, umidade, nivelAgua } = req.body;

    console.log("📨 Dados recebidos do ESP32:", { temperatura, umidade, nivelAgua });

    //Processamento do Nível da água
    let nivel = 0;
    if (typeof nivelAgua === "string") {
      const num = parseFloat(nivelAgua.replace(/[^\d.,-]/g, "").replace(",", "."));
      nivel = isNaN(num) ? 0 : num;
    } else if (typeof nivelAgua === "number") {
      nivel = nivelAgua;
    }

    const tempNum = Number(temperatura) || 0;
    const umidNum = Number(umidade) || 0;

    //Dados reais para o bairro Centro
    dadosClima["Centro"] = {
      bairro: "Centro",
      temperatura: tempNum,
      umidade: umidNum,
      nivelAgua: parseFloat(nivel.toFixed(1)),
      status: calcularStatus(nivel),
    };

    console.log("Dados reais recebidos para Centro:", dadosClima["Centro"]);
    
    //Emite atualização via socket
    io.emit("climaAtualizado", dadosClima);
    
    return res.json({ 
      ok: true, 
      message: "Dados recebidos com sucesso",
      bairro: "Centro" 
    });

  } catch (err) {
    console.error("Erro ao processar /api/atualizar:", err);
    return res.status(500).json({ ok: false, error: "server error" });
  }
});

//Socket
io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
  
  // Envia dados de todos os bairros quando conecta
  socket.emit("climaAtualizado", dadosClima);

  socket.on("disconnect", () => {
    console.log("Cliente desconectou:", socket.id);
  });
});


//Inicialização dos bairros fixos
inicializarDadosFicticios();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🌎 Backend rodando em http://0.0.0.0:${PORT}`);
  console.log(`Bairros monitorados: ${BAIRROS.join(", ")}`);
  console.log(`Centro: Dados REAIS do ESP32`);
  console.log(`Outros: Dados FIXOS (sem randomização)`);
  console.log(`Sistema 100% funcional!`);
});