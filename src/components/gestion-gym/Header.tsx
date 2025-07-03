 "use client";

import { useState } from 'react';
import NavLink from "@/components/NavLink";
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                BF
              </div>
              <h1 className="ml-3 text-xl font-bold text-white hidden sm:block">Gestion del <span className="text-amber-400">Gym</span></h1>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex space-x-1">
            <NavLink href="/gestion-gym/pagos" className="px-4 py-2 rounded-md text-sm font-medium  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500">
              Pagos
            </NavLink>
            <NavLink href="/gestion-gym/clientes" className="px-4 py-2 rounded-md text-sm font-medium  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500">
              Clientes
            </NavLink>
            <NavLink href="/gestion-gym/entrenadores" className="px-4 py-2 rounded-md text-sm font-medium  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500">
              Entrenadores
            </NavLink>
            <NavLink href="/gestion-gym/planes" className="px-4 py-2 rounded-md text-sm font-medium  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500">
              Planes
            </NavLink>
          </nav>

          {/* Perfil de usuario y botón de menú móvil */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-3 border-l border-gray-700 pl-4">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                LP
              </div>
              <span className="text-sm font-medium text-white">Luis Pimentel</span>
            </div>
            
            {/* Botón de menú móvil */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink 
              href="/gestion-gym/pagos" 
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:text-black"
            >
              Pagos
            </NavLink>
            <NavLink 
              href="/gestion-gym/clientes" 
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:text-black"
            >
              Clientes
            </NavLink>
            <NavLink 
              href="/gestion-gym/entrenadores" 
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:text-black"
            >
              Entrenadores
            </NavLink>
            <NavLink 
              href="/gestion-gym/planes" 
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:text-black"
            >
              Planes
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  LP
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">Luis Pimentel</div>
                <div className="text-sm font-medium text-gray-400">Administrador</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}