import { notFound } from "next/navigation";
import { FiEdit, FiPlus, FiX, FiCheck, FiMail, FiPhone, FiUser, FiDollarSign, FiCalendar, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import Link from "next/link";
import { getClienteById, Cliente } from '@/utils/supabase/clientes';
import { getEntrenadorById, Entrenador } from '@/utils/supabase/entrenadores';
import { getPagosByClienteId, Pago } from '@/utils/supabase/pagos';
import PaymentButtonWrapper from './PaymentButtonWrapper';

// Esta interfaz es solo para la visualización en esta página, usamos la real de pagos.ts

// Ahora usamos la función real de pagos.ts

export default async function ClienteDetalle({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Asegurarnos de que params.id esté disponible
    const id = (await params).id;  
    
    if (!id) {
      notFound();
    }
    
    // Obtener datos del cliente desde Supabase
    const cliente = await getClienteById(id);

    if (!cliente) {
      notFound();
    }
  
    // Determinar el nombre del entrenador
    let nombreEntrenador = "No asignado";
    if (cliente.entrenador_nombre) {
      nombreEntrenador = cliente.entrenador_nombre;
    } else if (cliente.entrenador) {
      const entrenadorData = await getEntrenadorById(cliente.entrenador);
      if (entrenadorData) {
        nombreEntrenador = `${entrenadorData.nombre} ${entrenadorData.apellido}`;
      }
    }
  
    // Obtener pagos del cliente desde Supabase
    const pagos = await getPagosByClienteId(cliente.id);
  
    // Estadísticas
    const totalPagado = pagos.reduce((acc: number, p: Pago) => acc + p.monto, 0);
    const pagosActivos = pagos.length;
    const pagosPendientes = 0; // En el nuevo sistema todos los pagos registrados son pagados

    return (
      <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/gestion-gym/clientes" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4">
              <FiArrowLeft className="mr-2" /> Volver a Clientes
            </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-3xl font-bold">
                  {cliente.nombre.charAt(0).toUpperCase()}{cliente.apellido.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold truncate">{cliente.nombre} {cliente.apellido}</h1>
                    <div className="flex flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                      <PaymentButtonWrapper 
                        cliente={JSON.stringify(cliente)} 
                        entrenador={cliente.entrenador ? JSON.stringify(await getEntrenadorById(cliente.entrenador)) : null} 
                      />
                      <button
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Editar Cliente"
                      >
                        <FiEdit className="text-lg" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
                        title="Registrar Pago"
                      >
                        <FiPlus className="text-lg" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Desactivar Cliente"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cliente.estado_del_mes === 'Pagado' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {cliente.estado_del_mes}
                    </span>
                    <span className="text-xs text-gray-400">ID: {cliente.id}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Contacto */}
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Contacto</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <FiMail className="mr-2 text-amber-400" />
                      {cliente.email}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiPhone className="mr-2 text-amber-400" />
                      {cliente.telefono}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiUser className="mr-2 text-amber-400" />
                      {cliente.direccion}
                    </li>
                  </ul>
                </div>
                {/* Membresía */}
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Membresía</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <FiUser className="mr-2 text-amber-400" />
                      {cliente.nombre} {cliente.apellido}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="mr-2 text-amber-400">P</span>
                      {cliente.plan}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="mr-2 text-amber-400">S</span>
                      {cliente.sistema}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="mr-2 text-amber-400">E</span>
                      {nombreEntrenador}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiDollarSign className="mr-2 text-amber-400" />
                      Pago Mensual: RD$ {cliente.pago_mensual.toLocaleString()}
                    </li>
                    <li className="flex items-center text-gray-300">
                      <FiCalendar className="mr-2 text-amber-400" />
                      Día de Pago: {cliente.dia_de_pago} de cada mes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 w-full md:w-64 flex-shrink-0">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Total Pagado</p>
                  <p className="text-2xl font-bold">RD$ {totalPagado.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pagos Realizados</p>
                  <p className="text-2xl font-bold">{pagosActivos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pagos Pendientes</p>
                  <p className="text-2xl font-bold">{pagosPendientes}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* Tabla de pagos */}
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 mt-8">
          <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Registro de Pagos</h2>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pagos.length} pagos
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pagos.length > 0 ? (
                  pagos.sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime()).map((pago: Pago, idx: number) => (
                    <tr key={idx} className={`transition-all duration-150 ${idx % 2 === 0 ? "bg-gray-900/70" : "bg-gray-800/60"} hover:bg-amber-900/20`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                        {new Date(pago.fecha_pago).toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-amber-300">
                        RD$ {pago.monto.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold shadow bg-green-500/20 text-green-400" title="Pago realizado correctamente">
                          <FiCheck className="text-green-400 text-xl" />
                          Pagado
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      No hay pagos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* El modal ahora se maneja en el componente ClientePaymentButton */}
    </div>
  );
  } catch (error) {
    console.error('Error al cargar los detalles del cliente:', error);
    return (
      <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error al cargar los datos del cliente</h2>
            <p className="text-gray-300 mb-6">Ha ocurrido un error al intentar cargar la información del cliente.</p>
            <Link href="/gestion-gym/clientes" className="inline-flex items-center text-amber-400 hover:text-amber-300">
              <FiArrowLeft className="mr-2" /> Volver a la lista de clientes
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
