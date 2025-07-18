"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi"
import { getSistemas, createSistema, updateSistema, deleteSistema, Sistema } from "@/utils/supabase/sistemas"

export default function Sistemas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sistemas, setSistemas] = useState<Sistema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentSistema, setCurrentSistema] = useState<Sistema | null>(null)

  // Cargar sistemas al iniciar
  useEffect(() => {
    const loadSistemas = async () => {
      try {
        setLoading(true)
        const data = await getSistemas()
        setSistemas(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar sistemas:', err)
        setError('No se pudieron cargar los sistemas. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    loadSistemas()
  }, [])

  // Buscar sistemas
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const data = await getSistemas()
      setSistemas(data)
      return
    }

    // Filtrar sistemas localmente
    const filteredSistemas = sistemas.filter(sistema => 
      sistema.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sistema.descripcion && sistema.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setSistemas(filteredSistemas)
  }

  // Eliminar sistema
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este sistema?')) {
      try {
        const { error } = await deleteSistema(id)
        if (error) throw error
        
        // Actualizar la lista de sistemas
        setSistemas(sistemas.filter(sistema => sistema.id !== id))
      } catch (err) {
        console.error('Error al eliminar sistema:', err)
        setError('No se pudo eliminar el sistema. Intente nuevamente.')
      }
    }
  }

  // Estados para el formulario del modal
  const [formData, setFormData] = useState<Partial<Sistema>>({
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

  // Cargar datos del sistema actual en el formulario
  useEffect(() => {
    if (currentSistema) {
      setFormData({
        nombre: currentSistema.nombre,
        descripcion: currentSistema.descripcion,
        activo: currentSistema.activo
      });
    } else {
      resetForm();
    }
  }, [currentSistema]);

  // Guardar sistema (crear o actualizar)
  const handleSaveSistema = async () => {
    try {
      setLoading(true);
      
      if (currentSistema) {
        // Actualizar sistema existente
        const { error } = await updateSistema(currentSistema.id, formData);
        if (error) throw error;
        
        // Actualizar el sistema en la lista local
        setSistemas(sistemas.map(sistema => 
          sistema.id === currentSistema.id ? { ...sistema, ...formData } : sistema
        ));
        
        setError(null);
        setShowModal(false);
      } else {
        // Crear nuevo sistema
        const { data, error } = await createSistema(formData as { nombre: string, descripcion?: string, activo?: boolean });
        if (error) throw error;
        
        // Añadir el nuevo sistema a la lista local
        if (data) {
          setSistemas([...sistemas, data]);
        }
        
        setError(null);
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error al guardar sistema:', err);
      setError('No se pudo guardar el sistema. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Modal para crear/editar sistema */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {currentSistema ? 'Editar Sistema' : 'Nuevo Sistema'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre del Sistema*
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Activo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">
                  Sistema activo
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSistema}
                disabled={!formData.nombre}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentSistema ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Sistemas</h1>
            <p className="text-gray-400">Gestión de sistemas del gimnasio</p>
          </div>
          
          {/* Botón para agregar nuevo sistema */}
          <button
            onClick={() => {
              setCurrentSistema(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FiPlus className="text-lg" />
            Nuevo Sistema
          </button>
        </div>
        
        {/* Buscador */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar sistemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {sistemas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Nombre</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 rounded-tr-lg">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sistemas.map((sistema) => (
                      <tr key={sistema.id} className="bg-gray-800 hover:bg-gray-750">
                        <td className="p-3 text-white">{sistema.nombre}</td>
                        <td className="p-3 text-gray-300">{sistema.descripcion || '-'}</td>
                        <td className="p-3">
                          {sistema.activo ? (
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
                              setCurrentSistema(sistema)
                              setShowModal(true)
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 rounded-full hover:bg-gray-700"
                            title="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(sistema.id)}
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
                <p className="text-gray-400 text-lg">No se encontraron sistemas</p>
                <button
                  onClick={() => {
                    setCurrentSistema(null)
                    setShowModal(true)
                  }}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <FiPlus className="text-lg" />
                  Crear nuevo sistema
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
