-- Crear tabla de sistemas
CREATE TABLE public.sistemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.sistemas ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para sistemas
-- Los administradores pueden ver todos los sistemas
CREATE POLICY "Los administradores pueden ver todos los sistemas" 
  ON public.sistemas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Los administradores pueden crear, actualizar y eliminar sistemas
CREATE POLICY "Los administradores pueden modificar sistemas" 
  ON public.sistemas 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- El personal puede ver todos los sistemas
CREATE POLICY "El personal puede ver todos los sistemas" 
  ON public.sistemas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_sistemas_nombre ON public.sistemas (nombre);
CREATE INDEX idx_sistemas_activo ON public.sistemas (activo);

-- Función para actualizar el timestamp 'updated_at' cuando se actualiza un registro
CREATE OR REPLACE FUNCTION update_sistemas_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el timestamp 'updated_at'
CREATE TRIGGER update_sistemas_updated_at
  BEFORE UPDATE ON public.sistemas
  FOR EACH ROW EXECUTE PROCEDURE update_sistemas_modified_column();

-- Insertar sistemas predeterminados
INSERT INTO public.sistemas (nombre, descripcion, activo) VALUES
  ('Body Factory', 'Sistema principal de Body Factory', TRUE),
  ('Signature', 'Sistema premium Signature', TRUE);
