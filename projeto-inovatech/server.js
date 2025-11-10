// server.js
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

// manter apenas São José Operário 2
const LOCAL = "São José Operário 2";

let dadosClima = {
  [LOCAL]: {
    bairro: LOCAL,
    temperatura: 0,
    umidade: 0,
    nivelAgua: 0, // em cm
    status: "normal",
  },
};

function calcularStatus(nivelCm) {
  // ajuste conforme seu critério (valores em cm)
  if (nivelCm >= 25) return "emergencia";
  if (nivelCm >= 15) return "alerta";
  return "normal";
}

// rota GET para debug/teste via navegador
app.get("/api/clima", (req, res) => {
  res.json(dadosClima);
});

// rota que ESP32 fará POST
app.post("/api/atualizar", (req, res) => {
  try {
    const { temperatura, umidade, nivelAgua } = req.body;

    // nivelAgua pode vir como "12.3m" ou número
    let nivel = 0;
    if (typeof nivelAgua === "string") {
      const num = parseFloat(nivelAgua.replace(/[^\d.,-]/g, "").replace(",", "."));
      nivel = isNaN(num) ? 0 : num;
    } else if (typeof nivelAgua === "number") {
      nivel = nivelAgua;
    }

    const tempNum = Number(temperatura) || 0;
    const umidNum = Number(umidade) || 0;

    dadosClima[LOCAL] = {
      bairro: LOCAL,
      temperatura: tempNum,
      umidade: umidNum,
      nivelAgua: parseFloat(nivel.toFixed(1)),
      status: calcularStatus(nivel),
    };

    // emite para todos os clientes conectados via socket.io
    io.emit("climaAtualizado", dadosClima);

    console.log("✅ Dados recebidos:", dadosClima[LOCAL]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao processar /api/atualizar:", err);
    return res.status(500).json({ ok: false, error: "server error" });
  }
});

// socket.io — apenas log de conexões
io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
  // envia estado atual assim que conectam
  socket.emit("climaAtualizado", dadosClima);

  socket.on("disconnect", () => console.log("❌ Cliente desconectou:", socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🌎 Backend rodando em http://0.0.0.0:${PORT}`));
