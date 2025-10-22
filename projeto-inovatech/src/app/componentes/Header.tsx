import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between  bg-gradient-to-br from-blue-300 to blue-600 px-6 py-4 shadow-sm border-b border-gray-200">
        <button
          onClick={onMenuClick}
          className="text-slate-600 hover:text-blue-500 transition-colors hover:bg-gray-100 p2-rounded-lg cursor-pointer"
           >
          <Menu size={28} />
        </button>
      <h1 className="text-2x1 font-bold text-slate-500 cursor-pointer">CLIMATECH</h1>     
    </header>
  );
}