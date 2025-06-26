import NavLink from "@/components/NavLink";

export default function GestionGymLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
    <>
    <header className="p-4 bg-gray-900 w-full">
      <div className="flex  items-center gap-6 ">
        <h1>Gestion del Gymnasio</h1>
        <nav className="flex flex-1 gap-2">
          <NavLink href="/gestion-gym/pagos">Pagos</NavLink>
          <NavLink href="/gestion-gym/clientes">Clientes</NavLink>
          <NavLink href="/gestion-gym/entrenadores">Entrenadores</NavLink>
          <NavLink href="/gestion-gym/planes">Planes</NavLink>
          <NavLink href="/gestion-gym/sistema">Sistema</NavLink>
        </nav>
        <div>
          <div>
            perfil
          </div>
        </div>
      </div>
    </header>
    <div>
      {children}
    </div>
    </>
    );
}