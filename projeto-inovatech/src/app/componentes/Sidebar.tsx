'use client';


//Futuramente podemos decidir mais funções aqui no type e acrescentamos na linha
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
const locais = ["São José Operário 2", "Jorge Teixeira", "Cidade Nova", "Japiim"];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-x1 transform ${
    open ? "translate-x-0" : "-translate-x-full"
  } transition-transform duration-300 ease-in-out z-50 border-r border-gray-200`}>
 <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to blue-600">
  <h2 className="text-lg font-semibold text-white cursor-pointer">Localidades</h2>
    <button onClick={onClose}
      className="text-blue-500 hover:text-blue-200 text-xl cursor-pointer font-bold p-1 rounded-full hover:bg-blue-700 w-8 h-8 flex items-center justify-center">
        ×
         </button>
         </div>
        <ul className="p-4 space-y-3">
        {locais.map((local) => (
        <li
        key={local}
        className="cursor-pointer text-slate-700 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-transparent hover:border-blue-200"
        >
            <div className="flex items-center">
                <span className="w-2 h2 bg-green-500 rounded-full mr-3"></span>
            </div>
        {local}
        </li>
        ))}
      </ul>
      <div className="ansolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-slate-500 text-center">
            CLIMATECH
        </p>
      </div>
    </aside>
  );
}