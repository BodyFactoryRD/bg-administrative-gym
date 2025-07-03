"use client";

import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de registro
        console.log('Register attempt with:', { 
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y cabecera */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3">
                        BF
                    </div>
                    <h1 className="text-xl font-bold text-white">Body Factory <span className="text-amber-400">Gym</span></h1>
                    <p className="text-gray-400 mt-1">Registro de Usuario</p>
                </div>
                
                {/* Tarjeta de registro */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-center text-white mb-6">Crear Cuenta</h2>
                        
                        <form onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="Juan"
                                    />
                                </div>
                            </div>
                            
                            {/* Apellido */}
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        required
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="Pérez"
                                    />
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                            </div>
                            
                            {/* Contraseña */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-5 w-5" />
                                            ) : (
                                                <FiEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Confirmar Contraseña */}
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            
                            {/* Botón de registro */}
                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-colors duration-200"
                                >
                                    Crear Cuenta
                                </button>
                            </div>
                            
                            {/* Enlace a login */}
                            <div className="text-center">
                                <p className="text-sm text-gray-400">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link href="/login" className="text-amber-400 hover:text-amber-300 focus:outline-none focus:underline transition-colors duration-200">
                                        Iniciar Sesión
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}