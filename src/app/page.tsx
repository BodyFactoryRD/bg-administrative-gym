
export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-4">
        <a href="/gestion-gym/pagos" className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-2 w-64 h-32 flex items-center justify-center rounded-lg border border-gray-700 hover:opacity-80 transition-all font-semibold">
          Gestion del Gymnasio
        </a>
        <a href="/administracion-gym" className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-2 w-64 h-32 flex items-center justify-center rounded-lg border border-gray-700 hover:opacity-80 transition-all font-semibold">
          Administracion del Gymnasio
        </a>
      </div>
    </div>
  );
}
