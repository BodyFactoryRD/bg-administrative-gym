"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiMapPin, FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { createCliente, ClienteInput } from '@/utils/supabase/clientes';
import { getEntrenadores, Entrenador } from '@/utils/supabase/entrenadores';
import { getSistemas, Sistema } from '@/utils/supabase/sistemas';
import { getPlanes, Plan as PlanSupabase } from '@/utils/supabase/planes';

interface PlanExtendido extends PlanSupabase {
  sistema: string;
}

export default function NuevoCliente() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entrenadorIdParam = searchParams.get('entrenador');
  
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [planes, setPlanes] = useState<PlanExtendido[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    plan: '',
    sistema: '',
    entrenador: entrenadorIdParam || '',
    pago_mensual: 0,
    dia_de_pago: 1,
    estado_del_mes: 'Pendiente',
    notas: '',
    activo: true
  });
  
  // Cargar entrenadores, sistemas y planes al iniciar
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const [entrenadoresData, sistemasData, planesData] = await Promise.all([
          getEntrenadores(),
          getSistemas(),
          getPlanes()
        ]);
        
        // Extender los planes con información de sistema
        // En un caso real, estos datos vendrían de la base de datos
        const planesExtendidos: PlanExtendido[] = planesData.map(plan => ({
          ...plan,
          sistema: plan.descripcion?.includes('Signature') ? 'Signature' : 'Body Factory'
        }));
        
        setEntrenadores(entrenadoresData);
        setSistemas(sistemasData);
        setPlanes(planesExtendidos);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
      } finally {
        setLoadingData(false);
      }
    }
    
    loadData();
  }, []);
  
  // Actualizar sistema cuando cambia el plan
  useEffect(() => {
    if (formData.plan) {
      const planSeleccionado = planes.find(p => p.nombre === formData.plan);
      if (planSeleccionado) {
        setFormData(prev => ({
          ...prev,
          sistema: planSeleccionado.sistema
        }));
      }
    }
  }, [formData.plan, planes]);

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
      const clienteData: ClienteInput = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        plan: formData.plan,
        sistema: formData.sistema,
        entrenador: formData.entrenador || undefined,
        pago_mensual: formData.pago_mensual,
        dia_de_pago: formData.dia_de_pago,
        estado_del_mes: formData.estado_del_mes as 'Pagado' | 'Pendiente',
        notas: formData.notas || undefined
      };
      
      const { data, error } = await createCliente(clienteData);
      
      if (error) {
        throw new Error(`Error al crear cliente: ${error.message}`);
      }
      
      // Redirigir a la lista de clientes
      router.push('/gestion-gym/clientes');
      
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cabecera */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Cliente</h1>
          <p className="text-gray-400 mt-1">Ingresa la información del nuevo cliente</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/gestion-gym/clientes"
            className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          >
            <FiX className="mr-2" /> Cancelar
          </Link>
        </div>
      </div>
      
      {loadingData && (
        <div className="bg-gray-800 p-4 rounded-md mb-6 flex items-center justify-center">
          <svg className="animate-spin mr-3 h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Cargando datos necesarios...</span>
        </div>
      )}
      
      {/* Formulario */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Información Personal</h2>
              
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre Completo *
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="Nombre"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Correo Electrónico *
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="cliente@ejemplo.com"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">
                  Teléfono *
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="809-555-1234"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-300 mb-1">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="direccion"
                    name="direccion"
                    rows={3}
                    value={formData.direccion}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="Calle, sector, ciudad"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de Nacimiento
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            {/* Información de Membresía */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Información de Membresía</h2>
              
              {/* Apellido */}
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="Apellido"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Plan */}
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-300 mb-1">
                  Plan *
                </label>
                <select
                  id="plan"
                  name="plan"
                  required
                  value={formData.plan}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  disabled={loading || loadingData}
                >
                  <option value="">Seleccionar plan</option>
                  {loadingData ? (
                    <option value="" disabled>Cargando planes...</option>
                  ) : (
                    planes.map(plan => (
                      <option key={plan.id} value={plan.nombre}>
                        {plan.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {/* Entrenador */}
              <div>
                <label htmlFor="entrenador" className="block text-sm font-medium text-gray-300 mb-1">
                  Entrenador
                </label>
                <select
                  id="entrenador"
                  name="entrenador"
                  value={formData.entrenador}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  disabled={loading || loadingData}
                >
                  <option value="">Seleccionar entrenador</option>
                  {loadingData ? (
                    <option value="" disabled>Cargando entrenadores...</option>
                  ) : (
                    entrenadores.map((entrenador) => (
                      <option key={entrenador.id} value={entrenador.id}>
                        {entrenador.nombre} {entrenador.apellido}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {/* Pago Mensual */}
              <div>
                <label htmlFor="pago_mensual" className="block text-sm font-medium text-gray-300 mb-1">
                  Pago Mensual *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pago_mensual"
                    name="pago_mensual"
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.pago_mensual}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-400">Monto mensual a pagar en RD$</p>
              </div>
              
              {/* Día de Pago */}
              <div>
                <label htmlFor="dia_de_pago" className="block text-sm font-medium text-gray-300 mb-1">
                  Día de Pago *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="dia_de_pago"
                    name="dia_de_pago"
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.dia_de_pago}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="5"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-400">Día del mes en que se realizará el cobro</p>
              </div>
              
              {/* Notas */}
              <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-300 mb-1">
                  Notas
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  rows={3}
                  value={formData.notas}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                  placeholder="Información adicional sobre el cliente"
                  disabled={loading}
                />
              </div>
              
              {/* Resumen */}
              {formData.plan && !loadingData && (
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Resumen de Membresía</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Sistema:</span>
                      <span className="text-white">{formData.sistema}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mensajes de error */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
              <p>{error}</p>
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/gestion-gym/clientes"
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
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 ${loading ? 'bg-amber-500/50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-colors`}
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
                  <FiSave className="mr-2" /> Guardar Cliente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
