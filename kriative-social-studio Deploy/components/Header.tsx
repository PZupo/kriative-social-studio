// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nome */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg" />
            <span className="font-bold text-xl text-gray-900">Social Studio</span>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</a>
            <a href="/planos" className="text-gray-700 hover:text-gray-900 font-medium">Planos</a>
          </nav>

          {/* Idioma + Perfil */}
          <div className="flex items-center space-x-4">
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>PT-BR</option>
              <option>EN</option>
              <option>ES</option>
            </select>
            <button className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
