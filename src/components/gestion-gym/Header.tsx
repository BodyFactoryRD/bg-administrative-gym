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
        <header className="p-4 bg-gray-900 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Gestion del Gymnasio</h1>
                    
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium hidden md:block">Luis Pimentel</span>
                            <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
                                LP
                            </div>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex flex-1 justify-center gap-6 px-8">
                        <NavLink href="/gestion-gym/pagos">Pagos</NavLink>
                        <NavLink href="/gestion-gym/clientes">Clientes</NavLink>
                        <NavLink href="/gestion-gym/entrenadores">Entrenadores</NavLink>
                        <NavLink href="/gestion-gym/planes">Planes</NavLink>
                        <NavLink href="/gestion-gym/sistema">Sistema</NavLink>
                    </nav>

                    {/* Desktop Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
                            LP
                        </div>
                        <p className="text-white font-bold hidden md:block">Luis Pimentel</p>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <nav className="flex flex-col gap-3 bg-gray-800 p-4 rounded-lg">
                            <NavLink href="/gestion-gym/pagos" onClick={toggleMenu}>Pagos</NavLink>
                            <NavLink href="/gestion-gym/clientes" onClick={toggleMenu}>Clientes</NavLink>
                            <NavLink href="/gestion-gym/entrenadores" onClick={toggleMenu}>Entrenadores</NavLink>
                            <NavLink href="/gestion-gym/planes" onClick={toggleMenu}>Planes</NavLink>
                            <NavLink href="/gestion-gym/sistema" onClick={toggleMenu}>Sistema</NavLink>
                        </nav>
                    </div>
                )}
            </header> 
          )
}