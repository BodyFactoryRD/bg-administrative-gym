"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiMail, FiPhone, FiUser, FiUsers, FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle, FiEdit, FiUserPlus, FiX, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import { getEntrenadorById, updateEntrenador, Entrenador } from '@/utils/supabase/entrenadores';
import { getClientesByEntrenador, Cliente as ClienteDB } from '@/utils/supabase/clientes';

// Tipo extendido para cliente con información adicional para la UI
type ClienteUI = ClienteDB & {
  ultimoPago?: string;
  estado?: 'activo' | 'inactivo';
};

// Tipo extendido para entrenador con datos adicionales para la UI
type EntrenadorConClientes = Entrenador & {
  clientes: ClienteUI[];
};

export default function DetalleEntrenador() {
  const params = useParams();
  const entrenadorId = String(params?.id);
  const router = useRouter();
  const [entrenador, setEntrenador] = useState<EntrenadorConClientes | null>(null);
  const [loading, setLoading] = useState(true);
  const [desactivando, setDesactivando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  // Estado para el formulario de edición
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    comision_porcentaje: 0,
    notas: ''
  });

  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (showEditModal && entrenador) {
      setFormData({
        nombre: entrenador.nombre || '',
        apellido: entrenador.apellido || '',
        email: entrenador.email || '',
        telefono: entrenador.telefono || '',
        fecha_nacimiento: entrenador.fecha_nacimiento || '',
        comision_porcentaje: (entrenador as Entrenador).comision_porcentaje || 0,
        notas: entrenador.notas || ''
      });
    }
  }, [showEditModal, entrenador]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'comision_porcentaje' ? parseFloat(value) || 0 : value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrenador) return;
    
    try {
      setEditLoading(true);
      
      const { error } = await updateEntrenador(entrenadorId, formData);
      
      if (error) {
        alert(`Error al actualizar el entrenador: ${error.message}`);
        console.error('Error al actualizar el entrenador:', error);
      } else {
        // Actualizar el estado local
        setEntrenador(prev => prev ? { ...prev, ...formData } : null);
        setShowEditModal(false);
        alert('Entrenador actualizado correctamente.');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      alert('Ocurrió un error al procesar la solicitud.');
    } finally {
      setEditLoading(false);
    }
  };

  // Cargar datos del entrenador
  useEffect(() => {
    const fetchEntrenador = async () => {
      setLoading(true);
      try {
        // Obtener datos del entrenador
        const entrenadorData = await getEntrenadorById(entrenadorId);
        if (!entrenadorData) {
          setError('No se encontró el entrenador');
          return;
        }
        
        // Obtener los clientes asignados a este entrenador
        const clientesData = await getClientesByEntrenador(entrenadorId);
        
        // Transformar los clientes al formato que necesitamos para la UI
        const clientesUI: ClienteUI[] = clientesData.map(cliente => ({
          ...cliente,
          // Usamos la fecha de último pago o la fecha de creación como fecha de último pago
          ultimoPago: cliente.updated_at || cliente.created_at || '',
          // Determinamos el estado basado en el estado_del_mes
          estado: cliente.estado_del_mes === 'Pagado' ? 'activo' : 'inactivo'
        }));
        
        // Combinar los datos del entrenador con sus clientes
        setEntrenador({
          ...entrenadorData,
          clientes: clientesUI
        });
      } catch (err) {
        console.error('Error al cargar el entrenador:', err);
        setError('Error al cargar los datos del entrenador');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntrenador();
  }, [entrenadorId]);

  // Formato de fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Función para desactivar el entrenador
  const handleDesactivarEntrenador = async () => {
    if (!entrenador || desactivando) return;
    
    if (window.confirm(`¿Estás seguro de que deseas ${entrenador.activo ? 'desactivar' : 'activar'} a ${entrenador.nombre} ${entrenador.apellido}?`)) {
      try {
        setDesactivando(true);
        
        const nuevoEstado = !entrenador.activo;
        const { error } = await updateEntrenador(entrenadorId, { activo: nuevoEstado });
        
        if (error) {
          alert(`Error al ${nuevoEstado ? 'activar' : 'desactivar'} el entrenador: ${error.message}`);
          console.error('Error al actualizar el estado del entrenador:', error);
        } else {
          // Actualizar el estado local
          setEntrenador(prev => prev ? { ...prev, activo: nuevoEstado } : null);
          alert(`Entrenador ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
        }
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        alert('Ocurrió un error al procesar la solicitud.');
      } finally {
        setDesactivando(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/gestion-gym/entrenadores" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4">
            <FiArrowLeft className="mr-2" /> Volver a Entrenadores
          </Link>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Cargando...</h2>
            <p className="text-gray-400">Obteniendo información del entrenador</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !entrenador) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/gestion-gym/entrenadores" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4">
            <FiArrowLeft className="mr-2" /> Volver a Entrenadores
          </Link>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Entrenador no encontrado</h2>
            <p className="text-gray-400">{error || 'El entrenador que buscas no existe o ha sido eliminado.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Contar clientes activos (los que tienen estado_del_mes = 'Pagado')
  const clientesActivos = entrenador.clientes.filter(c => c.estado_del_mes === 'Pagado').length;
  const clientesPendientes = entrenador.clientes.length - clientesActivos;
  const nombreCompleto = `${entrenador.nombre} ${entrenador.apellido}`;

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
    {entrenador.nombre.charAt(0)}{entrenador.apellido.charAt(0)}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <h1 className="text-2xl md:text-3xl font-bold truncate">{nombreCompleto}</h1>
      <div className="flex flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Editar Entrenador"
        >
          <FiEdit className="text-lg" />
        </button>
        <Link
          href={`/gestion-gym/clientes/nuevo?entrenador=${entrenadorId}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
          title="Agregar Cliente"
        >
          <FiUserPlus className="text-lg" />
        </Link>
        <button
          onClick={handleDesactivarEntrenador}
          disabled={desactivando}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${entrenador.activo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 ${desactivando ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={entrenador.activo ? 'Desactivar Entrenador' : 'Activar Entrenador'}
        >
          {desactivando ? (
            <span className="animate-pulse">...</span>
          ) : entrenador.activo ? (
            <FiX className="text-lg" />
          ) : (
            <FiCheckCircle className="text-lg" />
          )}
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        entrenador.activo
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      }`}>
        {entrenador.activo ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Información de Contacto</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <FiMail className="mr-2 text-amber-400" />
                      {entrenador.email || 'No disponible'}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiPhone className="mr-2 text-amber-400" />
                      {entrenador.telefono || 'No disponible'}
                    </li>
                    {entrenador.fecha_nacimiento && (
                      <li className="flex items-center text-gray-300">
                        <FiCalendar className="mr-2 text-amber-400" />
                        {formatDate(entrenador.fecha_nacimiento)}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Comisión</h3>
                  <p className="text-gray-300">{entrenador.comision_porcentaje || 0}% por cliente</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Clientes</h3>
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
                  <p className="text-sm text-gray-400">Total Clientes</p>
                  <p className="text-2xl font-bold">
                    {entrenador.clientes.length}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Clientes Pagados</p>
                  <p className="text-2xl font-bold text-green-400">
                    {clientesActivos}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Clientes Pendientes</p>
                  <p className="text-2xl font-bold text-red-400">
                    {clientesPendientes}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Comisión Estimada</p>
                  <p className="text-2xl font-bold text-amber-400">
                    ${(clientesActivos * 2000 * ((entrenador as Entrenador).comision_porcentaje || 0) / 100).toLocaleString('es-DO')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Porcentaje Comisión</p>
                  <p className="text-2xl font-bold">
                    {(entrenador as Entrenador).comision_porcentaje || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabla de Clientes */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 mt-6">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Clientes Asignados</h3>
            <p className="text-sm text-gray-400">Lista de clientes asignados a este entrenador</p>
          </div>

          {entrenador.clientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Inscripción</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Estado Pago</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {entrenador.clientes.map(cliente => (
                    <tr key={cliente.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{cliente.nombre} {cliente.apellido}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {cliente.telefono}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(cliente.fecha_inscripcion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cliente.estado_del_mes === 'Pagado'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {cliente.estado_del_mes === 'Pagado' ? (
                            <>
                              <FiCheckCircle className="mr-1" /> Pagado
                            </>
                          ) : (
                            <>
                              <FiXCircle className="mr-1" /> Pendiente
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="rounded-full bg-gray-700/50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No hay clientes asignados</h3>
              <p className="text-gray-400 mb-6">Este entrenador no tiene clientes asignados actualmente.</p>
              <Link 
                href={`/gestion-gym/clientes/nuevo?entrenador=${entrenadorId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
              >
                <FiUserPlus className="mr-2" /> Crear Nuevo Cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    
    {/* Modal de edición */}
    {showEditModal && entrenador && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Editar Entrenador</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="comision_porcentaje" className="block text-sm font-medium text-gray-300 mb-1">Porcentaje de Comisión (%)</label>
                <input
                  type="number"
                  id="comision_porcentaje"
                  name="comision_porcentaje"
                  value={formData.comision_porcentaje}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-300 mb-1">Notas</label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                disabled={editLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <span className="animate-pulse">Guardando...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-lg" /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  )
};
