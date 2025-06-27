
import { FiActivity, FiSettings} from 'react-icons/fi';

const Card = ({ title, description, icon: Icon, href }: { title: string; description: string; icon: React.ElementType; href: string }) => (
  <a 
    href={href}
    className="group relative overflow-hidden bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 rounded-2xl border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-400/10 flex flex-col h-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4 text-amber-400">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <div className="mt-4 text-amber-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Acceder <FiActivity className="ml-2 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </a>
);

export default function Home() {
  const OPTIONS = [
    {
      title: 'Gestión del Gimnasio',
      description: 'Administra pagos, clientes, entrenadores y planes',
      icon: FiActivity,
      href: '/gestion-gym/pagos'
    },
    {
      title: 'Administración',
      description: 'Configuración general y reportes del sistema',
      icon: FiSettings,
      href: '/administracion-gym'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 p-4 sm:p-6 md:p-8 flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
          {OPTIONS.map((option, index) => (
            <Card 
              key={index}
              title={option.title}
              description={option.description}
              icon={option.icon}
              href={option.href}
            />
          ))}
        </div>
    </div>
  );
}
