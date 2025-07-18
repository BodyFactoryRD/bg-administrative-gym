"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiCalendar, FiPercent, FiSave, FiX } from 'react-icons/fi';
import { createEntrenador, EntrenadorInput } from '@/utils/supabase/entrenadores';

export default function NuevoEntrenador() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    comision_porcentaje: 0,
    notas: '',
    imagen_url: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Preparar los datos para enviar a Supabase
      const entrenadorData: EntrenadorInput = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        comision_porcentaje: formData.comision_porcentaje ? Number(formData.comision_porcentaje) : undefined,
        notas: formData.notas || undefined,
        imagen_url: formData.imagen_url || undefined
      };
      
      const { data, error } = await createEntrenador(entrenadorData);
      
      if (error) {
        throw new Error(`Error al crear entrenador: ${error.message}`);
      }
      
      // Redirigir a la lista de entrenadores
      router.push('/gestion-gym/entrenadores');
      
    } catch (err) {
      console.error('Error al guardar entrenador:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar el entrenador');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Nuevo Entrenador</h1>
          <p className="text-gray-400 mt-1">Completa el formulario para agregar un nuevo entrenador</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
                  </label>
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
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                      placeholder="Nombre"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-300 mb-1">
                    Apellido *
                  </label>
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
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                      placeholder="Apellido"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="(809) 123-4567"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Fecha de nacimiento */}
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de nacimiento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Porcentaje de comisión */}
              <div>
                <label htmlFor="comision_porcentaje" className="block text-sm font-medium text-gray-300 mb-1">
                  Porcentaje de comisión
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPercent className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="comision_porcentaje"
                    name="comision_porcentaje"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.comision_porcentaje}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-gray-400">Porcentaje que recibe por cada cliente</p>
                </div>
              </div>
              
              {/* URL de imagen */}
              <div>
                <label htmlFor="imagen_url" className="block text-sm font-medium text-gray-300 mb-1">
                  URL de imagen
                </label>
                <input
                  id="imagen_url"
                  name="imagen_url"
                  type="url"
                  value={formData.imagen_url}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-gray-400">URL de la foto del entrenador (opcional)</p>
              </div>
              
              {/* Notas */}
              <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-300 mb-1">
                  Notas
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  rows={4}
                  value={formData.notas}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Información adicional sobre el entrenador"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          {/* Mensajes de error */}
          {error && (
            <div className="mt-6 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
              <p>{error}</p>
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/gestion-gym/entrenadores"
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
              onClick={(e) => {
                if (loading) {
                  e.preventDefault();
                }
              }}
            >
              <FiX className="mr-2" /> Cancelar
            </Link>
            <button
              type="submit"
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 ${loading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Guardar Entrenador
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
