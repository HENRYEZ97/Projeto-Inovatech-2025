'use client';

import { useState } from "react";
import Header from "./componentes/Header";
import Sidebar from "./componentes/Sidebar";
import { WeatherProvider } from "./componentes/WeatherContext";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-slate-800 min-h-screen overflow-x-hidden">
        <WeatherProvider>
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="p-6 transition-all duration-300 bg-gray-50">
            {children}
          </main>
        </WeatherProvider>
      </body>
    </html>
  );
}