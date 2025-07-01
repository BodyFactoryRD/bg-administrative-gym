"use client";

import { useParams } from 'next/navigation';
import { FiArrowLeft, FiMail, FiPhone, FiUser, FiUsers, FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle, FiEdit, FiUserPlus, FiX } from 'react-icons/fi';
import Link from 'next/link';

// Mock data - En un caso real, esto vendría de una API
const TRAINERS = [
  {
    id: 1,
    nombre: 'Acxel Ramses',
    email: 'acxel@bodyfactory.com',
    telefono: '809-555-0101',
    especialidad: 'Entrenamiento Funcional',
    estado: 'activo',
    clientes: [
      { id: 1, nombre: 'Juan Pérez', telefono: '809-555-1234', ultimoPago: '2023-05-15', estado: 'activo' },
      { id: 2, nombre: 'María García', telefono: '809-555-5678', ultimoPago: '2023-05-10', estado: 'activo' },
      { id: 3, nombre: 'Carlos Rodríguez', telefono: '809-555-9012', ultimoPago: '2023-04-28', estado: 'inactivo' },
    ]
  },
  // Puedes agregar más entrenadores aquí
];

export default function DetalleEntrenador() {
  const params = useParams();
  const entrenadorId = Number(params?.id);
  const entrenador = TRAINERS.find(t => t.id === entrenadorId);

  // Formato de fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!entrenador) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/gestion-gym/entrenadores" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4">
            <FiArrowLeft className="mr-2" /> Volver a Entrenadores
          </Link>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Entrenador no encontrado</h2>
            <p className="text-gray-400">El entrenador que buscas no existe o ha sido eliminado.</p>
          </div>
        </div>
      </div>
    );
  }

  const clientesActivos = entrenador.clientes.filter(c => c.estado === 'activo').length;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/gestion-gym/entrenadores" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4">
            <FiArrowLeft className="mr-2" /> Volver a Entrenadores
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
  <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-3xl font-bold">
    {entrenador.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <h1 className="text-2xl md:text-3xl font-bold truncate">{entrenador.nombre}</h1>
      <div className="flex flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Editar Entrenador"
        >
          <FiEdit className="text-lg" />
        </button>
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
          title="Agregar Cliente"
        >
          <FiUserPlus className="text-lg" />
        </button>
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Desactivar Entrenador"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        entrenador.estado === 'activo'
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      }`}>
        {entrenador.estado === 'activo' ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  </div>
</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Contacto</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <FiMail className="mr-2 text-amber-400" />
                      {entrenador.email}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiPhone className="mr-2 text-amber-400" />
                      {entrenador.telefono}
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Detalles</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <FiUsers className="mr-2 text-amber-400" />
                      {entrenador.clientes.length} clientes asignados
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 w-full md:w-64 flex-shrink-0">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Clientes Activos</p>
                  <p className="text-2xl font-bold">
                    {clientesActivos}
                    <span className="text-sm text-gray-400 ml-1">/ {entrenador.clientes.length}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Lista de clientes asignados */}
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 mt-8">
          <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Clientes Asignados</h2>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {entrenador.clientes.length} clientes
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Último Pago</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {entrenador.clientes.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-gray-750/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{cliente.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {cliente.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(cliente.ultimoPago)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cliente.estado === 'activo'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {cliente.estado === 'activo' ? (
                          <>
                            <FiCheckCircle className="mr-1" /> Activo
                          </>
                        ) : (
                          <>
                            <FiXCircle className="mr-1" /> Inactivo
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
