import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-lg text-indigo-600 tracking-tight">Avacom</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-mono font-semibold">Prueba técnica - Fernando Freire</span>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
