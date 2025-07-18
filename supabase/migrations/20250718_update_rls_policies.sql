-- Actualizar políticas RLS para permitir acceso público a clientes y entrenadores

-- Primero, eliminar las políticas existentes restrictivas
DROP POLICY IF EXISTS "Los administradores pueden ver todos los clientes" ON public.clientes;

-- Crear una política que permita a todos los usuarios autenticados ver todos los clientes
CREATE POLICY "Todos los usuarios pueden ver todos los clientes" 
  ON public.clientes 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Crear una política que permita a todos los usuarios autenticados ver todos los entrenadores
CREATE POLICY "Todos los usuarios pueden ver todos los entrenadores" 
  ON public.entrenadores 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Asegurarse de que RLS está habilitado para ambas tablas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrenadores ENABLE ROW LEVEL SECURITY;

-- Opcional: Crear políticas para permitir a los administradores modificar los datos
CREATE POLICY "Los administradores pueden modificar clientes" 
  ON public.clientes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Los administradores pueden modificar entrenadores" 
  ON public.entrenadores 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );
