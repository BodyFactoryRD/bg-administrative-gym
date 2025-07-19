'use client';

import { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { Cliente } from '@/utils/supabase/clientes';
import { Entrenador } from '@/utils/supabase/entrenadores';
import dynamic from 'next/dynamic';

// Importar el componente modal dinámicamente para evitar problemas de hidratación
const RegistrarPagoModal = dynamic(() => import('./RegistrarPagoModal'), {
  ssr: false,
});

interface ClientePaymentButtonProps {
  cliente: Cliente;
  entrenador: Entrenador | null;
}

export default function ClientePaymentButton({ cliente, entrenador }: ClientePaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          cliente={cliente} 
          entrenador={entrenador}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}
