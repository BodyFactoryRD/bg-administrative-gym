import { notFound } from 'next/navigation';


// Datos de ejemplo - en una aplicación real, esto vendría de una API
const CLIENTES = [
  {
    id: 1,
    nombre: "Karla Padilla",
    plan: "Personal 3 dias x semana",
    sistema: "Signature",
    entrenador: "Acxel Ramses",
    pagoMensual: 15000.00,
    diaDePago: 5,
    estadoDelMes: "Pagado",
    telefono: "809-555-1234",
    email: "karla@example.com",
    fechaInicio: "2024-01-15",
    direccion: "Calle Principal #123, Santo Domingo"
  },
  // ... otros clientes
];

export default function ClienteDetalle({ params }: { params: { id: string } }) {
  const cliente = CLIENTES.find(c => c.id === Number(params.id));
  
  if (!cliente) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{cliente.nombre}</h1>
            <p className="text-gray-400">ID: {cliente.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${cliente.estadoDelMes === 'Pagado' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {cliente.estadoDelMes}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Información Personal</h2>
            <div>
              <p className="text-gray-400">Teléfono</p>
              <p>{cliente.telefono}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p>{cliente.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Dirección</p>
              <p>{cliente.direccion}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Membresía</h2>
            <div>
              <p className="text-gray-400">Plan</p>
              <p>{cliente.plan}</p>
            </div>
            <div>
              <p className="text-gray-400">Sistema</p>
              <p>{cliente.sistema}</p>
            </div>
            <div>
              <p className="text-gray-400">Entrenador</p>
              <p>{cliente.entrenador}</p>
            </div>
            <div>
              <p className="text-gray-400">Pago Mensual</p>
              <p>RD$ {cliente.pagoMensual.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Día de Pago</p>
              <p>{cliente.diaDePago} de cada mes</p>
            </div>
            <div>
              <p className="text-gray-400">Fecha de Inicio</p>
              <p>{cliente.fechaInicio}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Editar Cliente
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Registrar Pago
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Dar de Baja
          </button>
        </div>
      </div>
    </div>
  );
}
