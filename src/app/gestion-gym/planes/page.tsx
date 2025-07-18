"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiX, FiCheck } from "react-icons/fi"
import { getPlanes, searchPlanes, deletePlan, Plan, createPlan, updatePlan } from "@/utils/supabase/planes"

export default function Planes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)

  // Cargar planes al iniciar
  useEffect(() => {
    const loadPlanes = async () => {
      try {
        setLoading(true)
        const data = await getPlanes()
        setPlanes(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar planes:', err)
        setError('No se pudieron cargar los planes. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    loadPlanes()
  }, [])

  // Buscar planes
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const data = await getPlanes()
      setPlanes(data)
      return
    }

    try {
      setLoading(true)
      const data = await searchPlanes(searchTerm)
      setPlanes(data)
      setError(null)
    } catch (err) {
      console.error('Error al buscar planes:', err)
      setError('Error en la búsqueda. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Eliminar plan
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este plan?')) {
      try {
        const { error } = await deletePlan(id)
        if (error) throw error
        
        // Actualizar la lista de planes
        setPlanes(planes.filter(plan => plan.id !== id))
      } catch (err) {
        console.error('Error al eliminar plan:', err)
        setError('No se pudo eliminar el plan. Intente nuevamente.')
      }
    }
  }

  // Filtrar planes localmente (para búsqueda instantánea)
  const filteredPlans = searchTerm.trim() === '' 
    ? planes 
    : planes.filter(plan => 
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.descripcion && plan.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      )

  // Estados para el formulario del modal
  const [formData, setFormData] = useState<Partial<Plan>>({
    nombre: '',
    descripcion: '',
    activo: true
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      activo: true
    });
  };

  // Cargar datos del plan actual en el formulario
  useEffect(() => {
    if (currentPlan) {
      setFormData({
        nombre: currentPlan.nombre,
        descripcion: currentPlan.descripcion,
        activo: currentPlan.activo
      });
    } else {
      resetForm();
    }
  }, [currentPlan]);

  // Guardar plan (crear o actualizar)
  const handleSavePlan = async () => {
    try {
      if (!formData.nombre) {
        alert('El nombre del plan es obligatorio');
        return;
      }

      if (currentPlan) {
        // Actualizar plan existente
        const { data, error } = await updatePlan(currentPlan.id, formData);
        if (error) throw error;

        // Actualizar la lista local
        setPlanes(planes.map(p => p.id === currentPlan.id ? { ...p, ...data } : p));
      } else {
        // Crear nuevo plan
        const { data, error } = await createPlan(formData as any);
        if (error) throw error;

        // Añadir a la lista local
        setPlanes([...planes, data as Plan]);
      }

      // Cerrar modal y resetear formulario
      setShowModal(false);
      resetForm();
      setCurrentPlan(null);
    } catch (err) {
      console.error('Error al guardar plan:', err);
      alert('No se pudo guardar el plan. Intente nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Gestión de Planes</h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar planes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiSearch size={18} />
              </button>
            </div>
            
            <button
              onClick={() => {
                setCurrentPlan(null)
                setShowModal(true)
              }}
              className="flex items-center justify-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <FiPlus size={18} />
              <span>Nuevo Plan</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {filteredPlans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPlans.map(plan => (
                      <tr key={plan.id} className="bg-gray-900 border-b border-gray-800">
                        <td className="p-3 text-white">{plan.nombre}</td>
                        <td className="p-3 text-gray-300">{plan.descripcion || '-'}</td>
                        <td className="p-3">
                          {plan.activo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                              <FiCheck className="mr-1" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                              <FiX className="mr-1" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="p-3 flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setCurrentPlan(plan)
                              setShowModal(true)
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 rounded-full hover:bg-gray-700"
                            title="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-1 text-red-400 hover:text-red-300 rounded-full hover:bg-gray-700"
                            title="Eliminar"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8 text-center py-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">No se encontraron planes</p>
                <button
                  onClick={() => {
                    setCurrentPlan(null)
                    setShowModal(true)
                  }}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <FiPlus className="text-lg" />
                  Crear nuevo plan
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para crear/editar plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {currentPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Plan</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo !== false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-600 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">
                  Plan activo
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                  setCurrentPlan(null)
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
              >
                {currentPlan ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
