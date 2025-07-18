-- Crear tabla de planes
CREATE TABLE public.planes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar comentarios a la tabla y columnas
COMMENT ON TABLE public.planes IS 'Tabla para almacenar los planes disponibles en el gimnasio';
COMMENT ON COLUMN public.planes.id IS 'Identificador único del plan';
COMMENT ON COLUMN public.planes.nombre IS 'Nombre del plan';
COMMENT ON COLUMN public.planes.descripcion IS 'Descripción detallada del plan';
COMMENT ON COLUMN public.planes.activo IS 'Indica si el plan está activo';

-- Crear índices para mejorar rendimiento de búsquedas
CREATE INDEX idx_planes_nombre ON public.planes (nombre);
CREATE INDEX idx_planes_activo ON public.planes (activo);

-- Verificar si la función update_modified_column ya existe, si no, crearla
DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_modified_column') THEN
    -- Función para actualizar el timestamp 'updated_at' cuando se actualiza un registro
    CREATE FUNCTION update_modified_column() 
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END
$do$;

-- Crear el trigger para actualizar el timestamp
CREATE TRIGGER update_planes_updated_at
  BEFORE UPDATE ON public.planes
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Habilitar RLS
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)

-- Todos los usuarios autenticados pueden ver planes activos
CREATE POLICY "Los usuarios pueden ver planes activos" 
  ON public.planes 
  FOR SELECT 
  USING (auth.role() = 'authenticated' AND activo = true);

-- Los administradores pueden ver todos los planes (activos e inactivos)
CREATE POLICY "Los administradores pueden ver todos los planes" 
  ON public.planes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Solo los administradores pueden crear, actualizar y eliminar planes
CREATE POLICY "Los administradores pueden gestionar planes" 
  ON public.planes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Insertar algunos planes iniciales
INSERT INTO public.planes (nombre, descripcion)
VALUES 
  ('Básico', 'Plan básico con acceso limitado a instalaciones'),
  ('Estándar', 'Plan estándar con acceso a todas las instalaciones'),
  ('Premium', 'Plan premium con acceso ilimitado y entrenador personal'),
  ('Estudiante', 'Plan especial para estudiantes'),
  ('Familiar', 'Plan para familias (hasta 4 miembros)');
