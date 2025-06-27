"use client";

import { useState } from 'react';
import { FiSearch, FiDownload, FiFilter, FiChevronDown, FiCalendar } from 'react-icons/fi';
import { FaMoneyBillWave, FaPercentage, FaUserTie, FaCoins } from 'react-icons/fa';

// Formateador de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace('DOP', 'RD$');
};

// Formateador de fechas
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

type Pago = {
  id: number;
  cliente: string;
  plan: string;
  metodoPago: string;
  sistema: string;
  entrenador: string;
  porcentajeEntrenador: string;
  fechaPago: string;
  cantidadPagada: number;
  cantidadDescontada: number;
  comisionSistema: number;
  ir17: number;
  comisionEntrenador: number;
};

export default function Pagos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    metodoPago: '',
    sistema: '',
    entrenador: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const INFO: Pago[] = [
    {
      id: 1,
      cliente: "Karla Padilla",
      plan: "Personal 3 dias x semana",
      metodoPago: "Transferencia GYM",
      sistema: "Signature",
      entrenador: "Acxel Ramses",
      porcentajeEntrenador: "0%",
      fechaPago: "2025-04-05",
      cantidadPagada: 15000.00,
      cantidadDescontada: 15000.00,
      comisionSistema: 15000.00,
      ir17: 0.00,
      comisionEntrenador: 0.00
    },
    {
      id: 2,
      cliente: "Zeta Mejia",
      plan: "Personal 3 dias x semana",
      metodoPago: "Tarjeta de Crédito",
      sistema: "Signature",
      entrenador: "Mariel Jerez",
      porcentajeEntrenador: "30%",
      fechaPago: "2025-04-04",
      cantidadPagada: 15000.00,
      cantidadDescontada: 15000.00,
      comisionSistema: 15000.00,
      ir17: 0.00,
      comisionEntrenador: 0.00
    },
    {
      id: 3,
      cliente: 'Sarah Rijo',
      plan: 'Personal 3 dias x semana',
      metodoPago: 'Tarjeta de Crédito',
      sistema: 'Signature',
      entrenador: 'Liz De León',
      porcentajeEntrenador: '20%',
      fechaPago: '2025-04-06',
      cantidadPagada: 14250.00,
      cantidadDescontada: 13537.50,
      comisionSistema: 10830.00,
      ir17: 270.75,
      comisionEntrenador: 2436.75
    }
  ];

  // Filtrar datos
  const filteredData = INFO.filter(pago => {
    const matchesSearch = 
      pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.plan.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilters = 
      (!filters.metodoPago || pago.metodoPago === filters.metodoPago) &&
      (!filters.sistema || pago.sistema === filters.sistema) &&
      (!filters.entrenador || pago.entrenador === filters.entrenador) &&
      (!filters.fechaDesde || new Date(pago.fechaPago) >= new Date(filters.fechaDesde)) &&
      (!filters.fechaHasta || new Date(pago.fechaPago) <= new Date(filters.fechaHasta));

    return matchesSearch && matchesFilters;
  });

  // Calcular totales
  const totales = {
    ingresos: filteredData.reduce((sum, pago) => sum + pago.cantidadPagada, 0),
    comisiones: filteredData.reduce((sum, pago) => sum + pago.comisionSistema, 0),
    ir17: filteredData.reduce((sum, pago) => sum + pago.ir17, 0),
    comisionEntrenadores: filteredData.reduce((sum, pago) => sum + pago.comisionEntrenador, 0)
  };

  // Obtener opciones únicas para los filtros
  const metodosPago = [...new Set(INFO.map(pago => pago.metodoPago))];
  const sistemas = [...new Set(INFO.map(pago => pago.sistema))];
  const entrenadores = [...new Set(INFO.map(pago => pago.entrenador))];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Encabezado */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Pagos del Gimnasio</h1>
            <p className="text-gray-400">Gestión y seguimiento de pagos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o plan..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiFilter />
              <span>Filtros</span>
              <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <FiDownload />
              <span className="">Exportar</span>
            </button>
          </div>
        </div>

        {/* Filtros desplegables */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-750 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Método de Pago</label>
                <select 
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  value={filters.metodoPago}
                  onChange={(e) => setFilters({...filters, metodoPago: e.target.value})}
                >
                  <option value="">Todos</option>
                  {metodosPago.map((metodo, index) => (
                    <option key={index} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sistema</label>
                <select 
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  value={filters.sistema}
                  onChange={(e) => setFilters({...filters, sistema: e.target.value})}
                >
                  <option value="">Todos</option>
                  {sistemas.map((sistema, index) => (
                    <option key={index} value={sistema}>{sistema}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Entrenador</label>
                <select 
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  value={filters.entrenador}
                  onChange={(e) => setFilters({...filters, entrenador: e.target.value})}
                >
                  <option value="">Todos</option>
                  {entrenadores.map((entrenador, index) => (
                    <option key={index} value={entrenador}>{entrenador}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Desde</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      value={filters.fechaDesde}
                      onChange={(e) => setFilters({...filters, fechaDesde: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hasta</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      value={filters.fechaHasta}
                      onChange={(e) => setFilters({...filters, fechaHasta: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setFilters({
                  metodoPago: '',
                  sistema: '',
                  entrenador: '',
                  fechaDesde: '',
                  fechaHasta: ''
                })}
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
              <p className="text-sm text-blue-100">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totales.ingresos)}</p>
              <p className="text-xs text-blue-200 mt-1">{filteredData.length} transacciones</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <FaMoneyBillWave className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Comisión del Sistema</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totales.comisiones)}</p>
              <p className="text-xs text-green-200 mt-1">Total de comisiones</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <FaPercentage className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">IR17 Retenido</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totales.ir17)}</p>
              <p className="text-xs text-purple-200 mt-1">Total retenido</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <FaCoins className="text-2xl text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100">Comisión Entrenadores</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totales.comisionEntrenadores)}</p>
              <p className="text-xs text-amber-200 mt-1">Total a pagar</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full">
              <FaUserTie className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="px-6 pb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Comisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredData.length > 0 ? (
                  filteredData.map((pago) => (
                    <tr 
                      key={pago.id}
                      className="hover:bg-gray-750/50 transition-colors cursor-pointer"
                      onClick={() => console.log('Ver detalle del pago:', pago.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {pago.cliente.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{pago.cliente}</div>
                            <div className="text-xs text-gray-400">{pago.entrenador}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-200">{pago.plan}</div>
                        <div className="text-xs text-gray-400">{pago.sistema}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pago.metodoPago.includes('Tarjeta') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(pago.fechaPago)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-white">
                        {formatCurrency(pago.cantidadPagada)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-green-400">{formatCurrency(pago.comisionSistema)}</span>
                        <span className="block text-xs text-gray-400">{pago.porcentajeEntrenador} Entrenador</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      No se encontraron pagos que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-750">
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-sm font-medium text-gray-300 text-right">
                    Totales:
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-white text-right">
                    {formatCurrency(totales.ingresos)}
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-green-400 text-right">
                    {formatCurrency(totales.comisiones)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}