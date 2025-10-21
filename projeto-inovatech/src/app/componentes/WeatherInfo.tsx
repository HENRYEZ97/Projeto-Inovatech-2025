export default function WeatherInfo() {
  const data = {
    bairro: "São José Operário 2",
    temperatura: 31,
    condicao: "Ensolarado",
    alerta: "Sem alertas no momento.",
    chuva: "0%",
    nivelRio: "12.4m",
    status: "normal"
  };

  const getStatusColor = () => {
    switch(data.status) {
      case "alerta": return "border-yellow-400 bg-yellow-50";
      case "emergencia": return "border-red-500 bg-red-50";
      default: return "border-blue-100 bg-green-50";
    }
  };

  const getStatusIcon = () => {
    switch(data.status) {
      case "alerta": return "⚠️";
      case "emergencia": return "🚨";
      default: return "✅";
    }
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${getStatusColor()} transition-all duration-300 hover:shadow-xl w-full max-w-md`}>
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">{data.bairro}</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-slate-600">🌡️ Temperatura</span>
          <span className="font-semibold text-slate-800">{data.temperatura}°C</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-slate-600">🌤️ Condição</span>
          <span className="font-semibold text-slate-800">{data.condicao}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-slate-600">🌧️ Chuva</span>
          <span className="font-semibold text-slate-800">{data.chuva}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-slate-600">🌊 Nível do Rio</span>
          <span className="font-semibold text-slate-800">{data.nivelRio}</span>
        </div>
        
        <div className={`p-4 rounded-lg text-center mt-4 ${
          data.status === "normal" ? "bg-green-100 text-green-800" :
          data.status === "alerta" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          <span className="font-semibold">{getStatusIcon()} {data.alerta}</span>
        </div>
      </div>
    </div>
  );
}