 "use client";

import { useState, useRef, useEffect } from 'react';
import NavLink from "@/components/NavLink";
import { FiMenu, FiX, FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi';
import LogoutButton from '@/components/LogoutButton';
import { useUser } from '@/components/UserProfile';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUser();
  
  // Obtener las iniciales del usuario para mostrar en el avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  // Cerrar el menú de usuario cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <NavLink href="/gestion-gym/sistemas" className="px-4 py-2 rounded-md text-sm font-medium  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500">
              Sistemas
            </NavLink>
          </nav>

          {/* Perfil de usuario y botón de menú móvil */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-3 border-l border-gray-700 pl-4">
              <div ref={userMenuRef} className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1"
                >
                  <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                    {loading ? '...' : getUserInitials()}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {loading ? 'Cargando...' : (user?.user_metadata?.name || 'Usuario')}
                  </span>
                  <FiChevronDown className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* Menú desplegable del usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">Conectado como</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email || 'Sin correo'}</p>
                    </div>
                    <div className="py-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                        Perfil
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                        Configuración
                      </a>
                    </div>
                    <div className="py-1 border-t border-gray-700">
                      <div className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">
                        <FiLogOut className="mr-2" />
                        <LogoutButton />
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
            <NavLink 
              href="/gestion-gym/sistemas" 
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:text-black"
            >
              Sistemas
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {loading ? '...' : getUserInitials()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{loading ? 'Cargando...' : (user?.user_metadata?.name || 'Usuario')}</div>
                <div className="text-sm font-medium text-gray-400">{user?.email || 'Sin correo'}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                Perfil
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                Configuración
              </a>
              <div className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700">
                <div className="flex items-center">
                  <FiLogOut className="mr-2" />
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}