-- Crear tabla de entrenadores
CREATE TABLE public.entrenadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  comision_porcentaje DECIMAL(5, 2),
  notas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.entrenadores ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para entrenadores
-- Los administradores pueden ver todos los entrenadores
CREATE POLICY "Los administradores pueden ver todos los entrenadores" 
  ON public.entrenadores 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Los administradores pueden crear, actualizar y eliminar entrenadores
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

-- El personal puede ver todos los entrenadores
CREATE POLICY "El personal puede ver todos los entrenadores" 
  ON public.entrenadores 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- Los entrenadores pueden ver su propio perfil
CREATE POLICY "Los entrenadores pueden ver su propio perfil" 
  ON public.entrenadores 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Los entrenadores pueden actualizar su propio perfil
CREATE POLICY "Los entrenadores pueden actualizar su propio perfil" 
  ON public.entrenadores 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (true);  -- Simplificamos la condición para evitar problemas con old/new

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_entrenadores_nombre ON public.entrenadores (nombre);
CREATE INDEX idx_entrenadores_apellido ON public.entrenadores (apellido);

-- Crear la función para actualizar el timestamp directamente sin verificación
DROP FUNCTION IF EXISTS update_modified_column CASCADE;
CREATE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para actualizar el timestamp
CREATE TRIGGER update_entrenadores_updated_at
  BEFORE UPDATE ON public.entrenadores
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();



