import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors());

//cordenadas
const locais = {
  "São José Operário 2": { lat: -3.1019, lon: -60.0111 },
  "Jorge Teixeira": { lat: -3.0853, lon: -59.9322 },
  "Cidade Nova": { lat: -3.0278, lon: -59.9388 },
  "Japiim": { lat: -3.1162, lon: -59.9725 },
};

let dadosClima = {};

for (const nome in locais) {
  dadosClima[nome] = {
    bairro: nome,
    temperatura: 0,
    condicao: "Carregando...",
    chuva: "0%",
    nivelAgua: "12.4m",
    status: "normal",
  };
}

// 🔹 Função para mapear o código do clima (Open-Meteo)
function mapearCondicao(codigo) {
  const map = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    51: "Chuvisco leve",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    80: "Chuva leve de verão",
    81: "Chuva moderada de verão",
    82: "Chuva intensa de verão",
    95: "Tempestade",
    99: "Tempestade com granizo",
  };
  return map[codigo] || "Desconhecido";
}

// 🔹 Atualiza os dados de clima para todos os locais
async function atualizarClima() {
  for (const nome in locais) {
    const { lat, lon } = locais[nome];
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      const clima = res.data.current_weather;
      const temperatura = clima.temperature;
      const condicao = mapearCondicao(clima.weathercode);
      const chuva = `${Math.floor(Math.random() * 100)}%`;
      const nivelAgua = `${(Math.random() * 8 + 10).toFixed(1)}m`;

      // Determina status com base em chuva e nível da água
      let status = "normal";
      const nivel = parseFloat(nivelAgua);
      const chuvaNum = parseInt(chuva);
      if (nivel > 13 || chuvaNum > 70) status = "alerta";
      if (nivel > 14 || chuvaNum > 90) status = "emergencia";

      dadosClima[nome] = {
        bairro: nome,
        temperatura,
        condicao,
        chuva,
        nivelAgua,
        status,
      };
    } catch (err) {
      console.error("Erro ao atualizar clima:", err.message);
    }
  }

  // 🔸 Envia os dados atualizados ao front-end
  io.emit("climaAtualizado", dadosClima);
  console.log("✅ Dados meteorológicos enviados:", new Date().toLocaleTimeString());
}

// 🔁 Atualiza a cada 10 segundos
setInterval(atualizarClima, 10000);
atualizarClima();

// 🔹 Endpoint REST (caso queira testar pelo navegador)
app.get("/api/clima", (req, res) => res.json(dadosClima));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🌎 Servidor rodando em http://localhost:${PORT}`));
