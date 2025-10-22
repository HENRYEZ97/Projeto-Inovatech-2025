interface WeatherItemProps {
  icon: string;
  label: string;
  value: string | number;
  variant?: 'default' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function WeatherItem({ 
  icon, 
  label, 
  value, 
  variant = 'default',
  size = 'md'
}: WeatherItemProps) {
  // Sistema de variants profissional
  const variantStyles = {
    default: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    danger: 'bg-red-50 border-red-300 text-red-800'
  };

  const sizeStyles = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  return (
    <div 
      className={`
        flex justify-between w-80 items-center 
        rounded-xl border-2 
        transition-all duration-200 
        hover:shadow-md hover:scale-[1.02]
        ${variantStyles[variant]} 
        ${sizeStyles[size]}
      `}
    >
      {/* Lado esquerdo - Icone + Label */}
      <div className="flex items-center gap-3">
        <span className="text-xl filter drop-shadow-sm">{icon}</span>
        <span className="font-medium tracking-wide">{label}</span>
      </div>
      
      {/* Lado direito - Valor */}
      <div className="text-right">
        <span className="font-bold tracking-tight">{value}</span>
      </div>
    </div>
  );
}