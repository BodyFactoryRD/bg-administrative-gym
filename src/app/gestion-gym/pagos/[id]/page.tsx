"use client"

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit, FiTrash } from "react-icons/fi";
import { FaMoneyBillWave, FaUserTie, FaCoins } from "react-icons/fa";

// Mock de pagos (igual que INFO de la página general)
const PAGOS = [
  {
    id: 1,
    cliente: "Karla Padilla",
    plan: "Personal 3 dias x semana",
    metodoPago: "Transferencia GYM",
    sistema: "Signature",
    entrenador: "Acxel Ramses",
    porcentajeEntrenador: "0%",
    fechaPago: "2025-04-05",
    cantidadPagada: 15000.0,
    cantidadDescontada: 15000.0,
    comisionSistema: 15000.0,
    ir17: 0.0,
    comisionEntrenador: 0.0,
    estado: "Pagado",
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
    cantidadPagada: 15000.0,
    cantidadDescontada: 15000.0,
    comisionSistema: 15000.0,
    ir17: 0.0,
    comisionEntrenador: 0.0,
    estado: "Pagado",
    },
  {
    id: 3,
    cliente: "Sarah Rijo",
    plan: "Personal 3 dias x semana",
    metodoPago: "Tarjeta de Crédito",
    sistema: "Signature",
    entrenador: "Liz De León",
    porcentajeEntrenador: "20%",
    fechaPago: "2025-04-06",
    cantidadPagada: 14250.0,
    cantidadDescontada: 13537.5,
    comisionSistema: 10830.0,
    ir17: 270.75,
    comisionEntrenador: 2436.75,
    estado: "Pagado",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("DOP", "RD$");
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

export default function PagoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const pago = PAGOS.find((p) => p.id === Number(id));

  if (!pago) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-2 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 relative mt-4">
  <Link
    href="/gestion-gym/pagos"
    className="flex items-center text-amber-400 hover:text-amber-300 mb-6"
  >
    <FiArrowLeft className="mr-2" /> Volver a Pagos
  </Link>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
    <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-2xl">
      <FaMoneyBillWave className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold truncate text-white">Detalle del Pago</h1>
        <div className="flex flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
          <Link
            href={`/gestion-gym/pagos/${pago.id}/editar`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Editar Pago"
          >
            <FiEdit className="text-lg" />
          </Link>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Eliminar Pago"
            onClick={() => {
              if (window.confirm('¿Seguro que deseas eliminar este pago? Esta acción no se puede deshacer.')) {
                alert('Funcionalidad de eliminación pendiente de implementación.');
              }
            }}
          >
            <FiTrash className="text-lg" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          pago.estado === 'Pagado'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {pago.estado}
        </span>
        <span className="text-xs text-gray-400">ID: {pago.id}</span>
      </div>
    </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Cliente</span>
            <span className="font-semibold text-lg text-white truncate">{pago.cliente}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Plan</span>
            <span className="font-semibold text-white truncate">{pago.plan}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Método de Pago</span>
            <span className="font-semibold text-white truncate">{pago.metodoPago}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Sistema</span>
            <span className="font-semibold text-white truncate">{pago.sistema}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Entrenador</span>
            <span className="font-semibold text-white flex items-center gap-2 truncate"><FaUserTie className="text-blue-400" />{pago.entrenador}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Fecha de Pago</span>
            <span className="font-semibold text-white flex items-center gap-2"><FaCoins className="text-amber-400" />{formatDate(pago.fechaPago)}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Monto Pagado</span>
            <span className="font-semibold text-amber-300 text-lg">{formatCurrency(pago.cantidadPagada)}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Comisión Sistema</span>
            <span className="font-semibold text-green-400">{formatCurrency(typeof pago.comisionSistema === 'number' ? pago.comisionSistema : Math.round(pago.cantidadPagada * 0.05))}</span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Comisión Entrenador</span>
            <span className="font-semibold text-blue-400">{formatCurrency(typeof pago.comisionEntrenador === 'number' ? pago.comisionEntrenador : Math.round(pago.cantidadPagada * 0.3))} <span className="text-xs text-gray-400 ml-2">{pago.porcentajeEntrenador || '0%'}</span></span>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-5 shadow flex flex-col gap-2">
            <span className="text-gray-400 text-sm">IR17</span>
            <span className="font-semibold text-pink-300">{formatCurrency(pago.ir17)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

