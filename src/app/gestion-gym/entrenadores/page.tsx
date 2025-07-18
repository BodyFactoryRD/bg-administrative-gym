"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiDownload, FiFilter, FiChevronDown, FiPlus } from 'react-icons/fi';
import { FaUserTie, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { getEntrenadores, searchEntrenadores, getClientesPorEntrenador, Entrenador } from '@/utils/supabase/entrenadores';

// Formateador de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace('DOP', 'RD$');
};

// Tipo para entrenador con datos adicionales para la UI
type EntrenadorUI = Entrenador & {
  clientes: number;
  clientes_count?: number;
  comisionMes: number;
};

export default function Entrenadores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [entrenadores, setEntrenadores] = useState<EntrenadorUI[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar entrenadores desde Supabase
  useEffect(() => {
    const fetchEntrenadores = async () => {
      setLoading(true);
      try {
        // Obtener entrenadores según la búsqueda
        let entrenadores;
        if (searchTerm) {
          entrenadores = await searchEntrenadores(searchTerm);
        } else {
          entrenadores = await getEntrenadores();
        }
        
        // Obtener el número real de clientes por entrenador
        const entrenadorConClientes = await getClientesPorEntrenador();
        
        // Crear un mapa para acceder rápidamente al conteo de clientes
        const clientesMap = new Map();
        entrenadorConClientes.forEach(item => {
          clientesMap.set(item.id, item.clientes_count);
        });
        
        // Transformar los datos para incluir clientes reales y comisiones estimadas
        const entrenadorData = entrenadores.map(entrenador => {
          // Obtener el número real de clientes
          const clientesCount = clientesMap.get(entrenador.id) || 0;
          
          // Calcular comisión basada en el número real de clientes y el porcentaje
          // Asumimos un valor promedio de pago mensual por cliente de 2000 pesos
          const pagoPromedioCliente = 2000;
          const comisionPorcentaje = entrenador.comision_porcentaje || 10; // Valor por defecto 10%
          const comisionEstimada = clientesCount * pagoPromedioCliente * (comisionPorcentaje / 100);
          
          return {
            ...entrenador,
            clientes: clientesCount, // Usar el número real de clientes
            clientes_count: clientesCount,
            comisionMes: comisionEstimada,
          };
        });
        
        setEntrenadores(entrenadorData);
      } catch (error) {
        console.error('Error al cargar entrenadores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntrenadores();
  }, [searchTerm]);

  // Filtrar datos
  const filteredData = entrenadores.filter(entrenador => {
    const matchesFilters = 
      (!filters.estado || (filters.estado === 'activo' ? entrenador.activo : !entrenador.activo));

    return matchesFilters;
  });

  // Calcular totales
  const totales = {
    entrenadores: entrenadores.length,
    activos: entrenadores.filter(e => e.activo).length,
    clientes: entrenadores.reduce((sum, e) => sum + e.clientes, 0),
    comisiones: entrenadores.reduce((sum, e) => sum + e.comisionMes, 0)
  };



  // Función para renderizar el estado
  const renderEstado = (activo: boolean) => {
    const estado = activo ? 'activo' : 'inactivo';
    const estados = {
      activo: { bg: 'bg-green-100 text-green-800', text: 'Activo' },
      inactivo: { bg: 'bg-red-100 text-red-800', text: 'Inactivo' }
    };
    
    const estadoInfo = estados[estado] || { bg: 'bg-gray-100 text-gray-800', text: estado };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoInfo.bg}`}>
        {estadoInfo.text}
      </span>
    );
  };



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Encabezado */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Entrenadores</h1>
            <p className="text-gray-400">Gestión de entrenadores y sus comisiones</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiFilter className="mr-2" />
              Filtros
              <FiChevronDown className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <Link href="/gestion-gym/entrenadores/nuevo" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
              <FiPlus />
              <span className="hidden sm:inline">Nuevo Entrenador</span>
              <span className="sm:hidden">Nuevo</span>
            </Link>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <FiDownload className="text-lg" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        {/* Filtros desplegables */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-750 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                <select 
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  value={filters.estado}
                  onChange={(e) => setFilters({...filters, estado: e.target.value})}
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setFilters({ estado: '' })}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de resumen */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Entrenadores</p>
              <p className="text-2xl font-bold text-white">{totales.entrenadores}</p>
              <p className="text-xs text-blue-200 mt-1">Registrados en el sistema</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <FaUserTie className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Entrenadores Activos</p>
              <p className="text-2xl font-bold text-white">{totales.activos}</p>
              <p className="text-xs text-green-200 mt-1">Disponibles actualmente</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <FaUserTie className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Total Clientes</p>
              <p className="text-2xl font-bold text-white">{totales.clientes}</p>
              <p className="text-xs text-purple-200 mt-1">Atendidos por entrenadores</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <FaUsers className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100">Comisiones del Mes</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totales.comisiones)}</p>
              <p className="text-xs text-amber-200 mt-1">Total a pagar</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full">
              <FaMoneyBillWave className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de entrenadores */}
      <div className="px-6 pb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entrenador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Clientes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Comisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      Cargando entrenadores...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((entrenador) => (
                    <tr
                      key={entrenador.id}
                      className="hover:bg-gray-750/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/gestion-gym/entrenadores/${entrenador.id}`)}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') router.push(`/gestion-gym/entrenadores/${entrenador.id}`); }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {entrenador.nombre.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{entrenador.nombre} {entrenador.apellido}</div>
                            <div className="text-xs text-gray-400">{renderEstado(entrenador.activo)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-200">{entrenador.email || 'No disponible'}</div>
                        <div className="text-xs text-gray-400">{entrenador.telefono || 'No disponible'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-white">{entrenador.clientes}</div>
                        <div className="text-xs text-gray-400">clientes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-green-400">{formatCurrency(entrenador.comisionMes)}</div>
                        <div className="text-xs text-gray-400">este mes</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      No se encontraron entrenadores que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}