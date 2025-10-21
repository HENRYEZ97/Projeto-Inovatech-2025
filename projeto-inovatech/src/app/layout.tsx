'use client';

import { useState } from "react";
import Header from "./componentes/Header";
import Sidebar from "./componentes/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-slate-800 min-h-screen overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="p-6 transition-all duration-300 bg-gray-50">{children}</main>
      </body>
    </html>
  );
}