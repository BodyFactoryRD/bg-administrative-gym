'use client';

import { FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';
import { Cliente } from '@/utils/supabase/clientes';
import { Entrenador } from '@/utils/supabase/entrenadores';
import dynamic from 'next/dynamic';

// Importar el modal dinámicamente para evitar problemas de hidratación
const RegistrarPagoModal = dynamic(
  () => import('@/components/clientes/RegistrarPagoModal'),
  { ssr: false }
);

interface PaymentButtonWrapperProps {
  cliente: string; // JSON string
  entrenador: string | null; // JSON string o null
}

export default function PaymentButtonWrapper({ cliente, entrenador }: PaymentButtonWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Parsear los datos JSON
  const clienteData: Cliente = JSON.parse(cliente);
  const entrenadorData: Entrenador | null = entrenador ? JSON.parse(entrenador) : null;
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <button
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
        title="Registrar Pago"
        onClick={openModal}
      >
        <FiCreditCard className="text-lg" />
      </button>
      
      {isModalOpen && (
        <RegistrarPagoModal
          cliente={clienteData}
          entrenador={entrenadorData}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}
