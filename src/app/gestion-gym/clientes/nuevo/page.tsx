"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiMapPin, FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';

// Datos mock para el formulario
const ENTRENADORES = [  
  { id: 1, nombre: 'Acxel Ramses' },
  { id: 2, nombre: 'Mariel Jerez' },
  { id: 3, nombre: 'Liz De León' }
];

const PLANES = [
  { id: 1, nombre: 'Personal 3 dias x semana', sistema: 'Signature', precio: 15000 },
  { id: 2, nombre: 'Personal 5 dias x semana', sistema: 'Signature', precio: 18000 },
  { id: 3, nombre: 'Grupal 3 dias x semana', sistema: 'Regular', precio: 8000 }
];

export default function NuevoCliente() {
  const router = useRouter();
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    entrenador_id: '',
    plan_id: '',
    diaDePago: 1,
    estado: 'activo'
  });
  
  const [precioMensual, setPrecioMensual] = useState(0);
  const [sistema, setSistema] = useState('');
  
  useEffect(() => {
    if (formData.plan_id) {
      const plan = PLANES.find(p => p.id === parseInt(formData.plan_id));
      if (plan) {
        setPrecioMensual(plan.precio);
        setSistema(plan.sistema);
      }
    }
  }, [formData.plan_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el cliente
    console.log('Guardando cliente:', formData);
    
    // Simulamos éxito y redireccionamos
    setTimeout(() => {
      router.push('/gestion-gym/clientes');
    }, 1000);
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
                    placeholder="Nombre y apellido"
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="cliente@ejemplo.com"
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
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="809-555-1234"
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
                  />
                </div>
              </div>
            </div>
            
            {/* Información de Membresía */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Información de Membresía</h2>
              
              {/* Plan */}
              <div>
                <label htmlFor="plan_id" className="block text-sm font-medium text-gray-300 mb-1">
                  Plan *
                </label>
                <select
                  id="plan_id"
                  name="plan_id"
                  required
                  value={formData.plan_id}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Seleccionar plan</option>
                  {PLANES.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre} - {plan.sistema} - RD$ {plan.precio.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Entrenador */}
              <div>
                <label htmlFor="entrenador_id" className="block text-sm font-medium text-gray-300 mb-1">
                  Entrenador *
                </label>
                <select
                  id="entrenador_id"
                  name="entrenador_id"
                  required
                  value={formData.entrenador_id}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Seleccionar entrenador</option>
                  {ENTRENADORES.map(entrenador => (
                    <option key={entrenador.id} value={entrenador.id}>
                      {entrenador.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Día de Pago */}
              <div>
                <label htmlFor="diaDePago" className="block text-sm font-medium text-gray-300 mb-1">
                  Día de Pago *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="diaDePago"
                    name="diaDePago"
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.diaDePago}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400"
                    placeholder="5"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-400">Día del mes en que se realizará el cobro</p>
              </div>
              
              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              
              {/* Resumen */}
              {formData.plan_id && (
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Resumen de Membresía</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Sistema:</span>
                      <span className="text-white">{sistema}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Pago Mensual:</span>
                      <span className="text-white">RD$ {precioMensual.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-colors"
            >
              <FiSave className="mr-2" /> Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
