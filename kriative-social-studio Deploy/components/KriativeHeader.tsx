// src/components/KriativeHeader.tsx
import { useState } from 'react';

export default function KriativeHeader({ appName }: { appName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-[#404040] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#008080] to-[#FF8C00] rounded-lg"></div>
            <span className="ml-3 text-xl font-bold text-[#333333] dark:text-white">
              {appName}
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="https://hub.kriative.app" className="text-[#333333] dark:text-white hover:text-[#008080] font-medium">
              Dashboard
            </a>
            <a href="/pricing" className="text-[#333333] dark:text-white hover:text-[#008080] font-medium">
              Planos
            </a>
          </nav>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition">
              <svg className="w-5 h-5 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? (
              <svg className="w-6 h-6 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white dark:bg-[#1A1A1A] border-t dark:border-[#404040]">
          <div className="px-4 py-3 space-y-2">
            <a href="https://hub.kriative.app" className="block px-3 py-2 text-[#333333] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded">Dashboard</a>
            <a href="/pricing" className="block px-3 py-2 text-[#333333] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded">Planos</a>
          </div>
        </div>
      )}
    </header>
  );
}
