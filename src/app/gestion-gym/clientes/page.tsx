"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { FaList, FaTh, FaSearch, FaFileExport, FaFilter } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { getClientes, Cliente } from '@/utils/supabase/clientes';

type PaymentStatus = 'all' | 'paid' | 'pending';

export default function Clientes() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus>('all');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        setLoading(true);
        const data = await getClientes();
        setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
        setError('No se pudieron cargar los clientes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/gestion-gym/clientes/${id}`)
  };

  // Filtrar clientes basado en el término de búsqueda y estado de pago
  const filteredClientes = clientes.filter(cliente => {
    const searchTermLower = searchTerm.toLowerCase();
    const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
    
    // Filtro por término de búsqueda (nombre, entrenador o sistema)
    const matchesSearch = searchTerm === '' || 
      nombreCompleto.includes(searchTermLower) ||
      (cliente.entrenador?.toLowerCase() || '').includes(searchTermLower) ||
      cliente.sistema.toLowerCase().includes(searchTermLower);
    
    // Filtro por estado de pago
    const matchesPayment = paymentFilter === 'all' || 
      (paymentFilter === 'paid' && cliente.estado_del_mes === 'Pagado') ||
      (paymentFilter === 'pending' && cliente.estado_del_mes === 'Pendiente');
    
    return matchesSearch && matchesPayment;
  });

  return (
    <>
      <div className="p-4 bg-gray-900 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-400">Lista de clientes</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link 
            href="/gestion-gym/clientes/nuevo" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiPlus className="text-lg" />
            <span>Nuevo Cliente</span>
          </Link>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, entrenador o sistema..." 
              className="w-48 sm:w-72 pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              title="Buscar por nombre, entrenador o sistema"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus)}
              className="pl-10 pr-8 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              disabled={loading}
            >
              <option value="all">Todos</option>
              <option value="paid">Pagados</option>
              <option value="pending">Pendientes</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              onClick={() => setViewMode('list')}
              title="Vista de lista"
              disabled={loading}
            >
              <FaList />
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              onClick={() => setViewMode('grid')}
              title="Vista de cuadrícula"
              disabled={loading}
            >
              <FaTh />
            </button>
          </div>
          
          <Link 
            href="/gestion-gym/clientes/nuevo"
            className={`flex items-center gap-2 px-4 py-2 ${loading ? 'bg-green-600/50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} rounded-md text-white whitespace-nowrap`}
            title="Agregar nuevo cliente"
            onClick={e => loading && e.preventDefault()}
          >
            <FiPlus />
            <span className="hidden sm:inline">Nuevo Cliente</span>
          </Link>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white whitespace-nowrap"
            title="Exportar lista de clientes"
          >
            <FaFileExport />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Cargando clientes...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg mt-6">
          <p>{error}</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="bg-gray-800 text-center p-8 rounded-lg mt-6">
          <p className="text-gray-400">No se encontraron clientes con los filtros seleccionados.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="block w-full overflow-x-auto rounded-2xl shadow-lg bg-gray-900/80 mt-6">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Plan</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Sistema</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Entrenador</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Pago Mensual</th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Día de Pago</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredClientes.map(cliente => (
                <tr
                  key={cliente.id}
                  className="hover:bg-gray-800/60 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-400 outline-none"
                  tabIndex={0}
                  onClick={() => handleRowClick(cliente.id)}
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-white max-w-[160px] truncate">
                    {cliente.nombre} {cliente.apellido}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-200">{cliente.plan}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-300">{cliente.sistema}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-2 truncate justify-center md:justify-start">
                    {cliente.entrenador_nombre ? (
                      <>
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
                          {cliente.entrenador_nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="block">{cliente.entrenador_nombre}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-amber-300 font-semibold">RD$ {cliente.pago_mensual.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center max-w-10">
                    <div className="h-8 w-8 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center text-blue-400 font-medium mx-auto">
                      {cliente.dia_de_pago}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cliente.estado_del_mes === 'Pagado' 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {cliente.estado_del_mes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredClientes.map(cliente => (
            <div 
              key={cliente.id}
              onClick={() => handleRowClick(cliente.id)}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-700 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400 outline-none"
              tabIndex={0}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{cliente.nombre} {cliente.apellido}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${cliente.estado_del_mes === 'Pagado' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {cliente.estado_del_mes}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="font-medium">Plan:</span> {cliente.plan}</p>
                  <p><span className="font-medium">Sistema:</span> {cliente.sistema}</p>
                  <p><span className="font-medium">Entrenador:</span> {cliente.entrenador_nombre || 'Sin asignar'}</p>
                  <p><span className="font-medium">Pago:</span> RD$ {cliente.pago_mensual.toLocaleString()}</p>
                  <p><span className="font-medium">Día de pago:</span> {cliente.dia_de_pago} de cada mes</p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-3 text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Ver detalles →
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredClientes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron clientes que coincidan con la búsqueda.
        </div>
      )}
    </>
  )
}
