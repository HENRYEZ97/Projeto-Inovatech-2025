export default function NoDataMessage() {
  return (
    <div className="text-center py-20 bg-[#111b22] border border-cyan-600/20 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-cyan-300">Nenhum dado recebido ainda</h2>
      <p className="text-gray-400 mt-2">
        Aguarde o ESP32 enviar as primeiras leituras...
      </p>
    </div>
  );
}
