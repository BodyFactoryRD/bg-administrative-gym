"use client";

import { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login } from './actions';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

// Componente para el botón de envío con estado de carga
function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
    );
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    
    // Función wrapper para manejar el resultado del server action
    async function handleLogin(formData: FormData) {
        setErrorMessage('');
        const result = await login(formData);
        
        // Si hay un error y no se redirigió, mostrar el mensaje de error
        if (result?.error) {
            setErrorMessage(result.error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y cabecera */}
                <div className="text-center mb-10">
                    <div className="mx-auto h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-md mb-4">
                        BF
                    </div>
                    <h1 className="text-2xl font-bold text-white">Body Factory <span className="text-amber-400">Gym</span></h1>
                    <p className="text-gray-400 mt-2">Sistema de Administración</p>
                </div>
                
                {/* Tarjeta de login */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>
                        
                        <form action={handleLogin}>
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md text-sm">
                                    {errorMessage}
                                </div>
                            )}
                            {/* Campo de email */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        defaultValue=""
                                        className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                            </div>
                            
                            {/* Campo de contraseña */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                                    <a href="#" className="text-sm text-amber-400 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md">
                                        ¿Olvidó su contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        defaultValue=""
                                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
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
                            
                            
                            {/* Botón de inicio de sesión */}
                            <div>
                                <SubmitButton />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}