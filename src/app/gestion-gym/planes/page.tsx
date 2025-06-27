"use client"

import { useState } from "react"
import { FiSearch, FiPlus } from "react-icons/fi"

export default function Planes() {
  const [searchTerm, setSearchTerm] = useState("")

  const PLANS = [
    {
      id: 1,
      nombre: "Plan 1",
      descripcion: "Descripción del plan 1",
    },
    {
      id: 2,
      nombre: "Plan 2",
      descripcion: "Descripción del plan 2",
    },
    {
      id: 3,
      nombre: "Plan 3",
      descripcion: "Descripción del plan 3",
    },
  ]

  const filteredPlans = PLANS.filter(plan => 
    plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )
    

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <div className="p-6 bg-gray-800 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Planes</h1>
              <p className="text-gray-400">Gestión de planes</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">Nuevo Plan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 mt-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nombre del plan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map(plan => (
                      <tr
                        key={plan.id}
                        className="hover:bg-gray-750/50 transition-colors cursor-pointer"
                        onClick={() =>
                          console.log("Ver detalle del entrenador:", plan.id)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {plan.nombre}
                              </div>
                              <div className="text-xs text-gray-400">
                                {plan.descripcion}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={1}
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No se encontraron planes que coincidan con los filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
