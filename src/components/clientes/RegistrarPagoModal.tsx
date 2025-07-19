'use client';

import { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiCalendar, FiUser, FiCreditCard } from 'react-icons/fi';
import { Cliente } from '@/utils/supabase/clientes';
import { Entrenador } from '@/utils/supabase/entrenadores';
import { createPago, PagoInput } from '@/utils/supabase/pagos';
import { updateEstadoDelMes } from '@/utils/supabase/clientes';

// Métodos de pago disponibles
const METODOS_PAGO = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia',
  'Otro'
];

interface RegistrarPagoModalProps {
  cliente: Cliente;
  entrenador: Entrenador | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrarPagoModal({ cliente, entrenador, isOpen, onClose }: RegistrarPagoModalProps) {
  
  // Estado para el formulario de pago
  const [formData, setFormData] = useState({
    monto: cliente.pago_mensual,
    fecha_pago: new Date().toISOString().split('T')[0],
    mes_correspondiente: new Date().toISOString().slice(0, 7), // YYYY-MM
    metodo_pago: 'Efectivo',
    comprobante: '',
    notas: ''
  });
  
  // Estado para el proceso de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Calcular la comisión del entrenador
  const comisionEntrenador = entrenador?.comision_porcentaje 
    ? (formData.monto * entrenador.comision_porcentaje / 100).toFixed(2)
    : 0;
  
  // Ya no necesitamos el efecto para escuchar el botón porque ahora controlamos el modal con props
  
  // Manejador para cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Preparar datos del pago
      const pagoData: PagoInput = {
        cliente_id: cliente.id,
        monto: Number(formData.monto),
        fecha_pago: formData.fecha_pago,
        mes_correspondiente: formData.mes_correspondiente,
        metodo_pago: formData.metodo_pago,
        comprobante: formData.comprobante || undefined,
        notas: formData.notas || undefined
      };
      
      // Registrar el pago
      const { data, error } = await createPago(pagoData);
      
      if (error) {
        throw new Error(error.message || 'Error al registrar el pago');
      }
      
      // Actualizar el estado del mes del cliente a "Pagado"
      await updateEstadoDelMes(cliente.id, 'Pagado');
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Recargar la página para ver los cambios
        window.location.reload();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar el pago');
      console.error('Error al registrar pago:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
        onClick={() => !isSubmitting && onClose()}
      ></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800 rounded-xl shadow-xl transform transition-all w-full max-w-lg border border-gray-700">
          {/* Cabecera del modal */}
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <FiDollarSign className="mr-2 text-amber-400" />
              Registrar Pago
            </h3>
            <button 
              onClick={() => !isSubmitting && onClose()}
              className="text-gray-400 hover:text-white"
              disabled={isSubmitting}
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          {/* Contenido del modal */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              {/* Información del cliente */}
              <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiUser className="text-amber-400 mr-2" />
                  <h4 className="text-white font-medium">Información del Cliente</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  <strong>Cliente:</strong> {cliente.nombre} {cliente.apellido}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Plan:</strong> {cliente.plan}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Día de pago:</strong> {cliente.dia_de_pago} de cada mes
                </p>
              </div>
              
              {/* Monto */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monto a pagar (RD$)
                </label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Fecha de pago */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de pago
                </label>
                <input
                  type="date"
                  name="fecha_pago"
                  value={formData.fecha_pago}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Mes correspondiente */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mes correspondiente
                </label>
                <input
                  type="month"
                  name="mes_correspondiente"
                  value={formData.mes_correspondiente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Método de pago */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Método de pago
                </label>
                <select
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                >
                  {METODOS_PAGO.map(metodo => (
                    <option key={metodo} value={metodo}>
                      {metodo}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Comprobante */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Número de comprobante (opcional)
                </label>
                <input
                  type="text"
                  name="comprobante"
                  value={formData.comprobante}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: #12345"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Notas */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={2}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              {/* Información del entrenador y comisión */}
              {entrenador && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiUser className="text-amber-400 mr-2" />
                    <h4 className="text-white font-medium">Información del Entrenador</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <strong>Entrenador:</strong> {entrenador.nombre} {entrenador.apellido}
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Comisión:</strong> {entrenador.comision_porcentaje || 0}% 
                    {comisionEntrenador ? ` (RD$ ${comisionEntrenador})` : ''}
                  </p>
                </div>
              )}
              
              {/* Mensajes de error o éxito */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-300 text-sm">
                  ¡Pago registrado correctamente!
                </div>
              )}
            </div>
            
            {/* Pie del modal con botones */}
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                type="button"
                onClick={() => !isSubmitting && onClose()}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    Registrar Pago
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
