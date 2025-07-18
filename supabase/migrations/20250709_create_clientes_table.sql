-- Crear tabla de clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  fecha_nacimiento DATE,
  fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
  plan TEXT NOT NULL,
  sistema TEXT NOT NULL,
  entrenador TEXT,
  pago_mensual DECIMAL(10, 2) NOT NULL,
  dia_de_pago INTEGER NOT NULL CHECK (dia_de_pago BETWEEN 1 AND 31),
  estado_del_mes TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado_del_mes IN ('Pagado', 'Pendiente')),
  notas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para clientes
-- Los administradores pueden ver todos los clientes
CREATE POLICY "Los administradores pueden ver todos los clientes" 
  ON public.clientes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Los administradores pueden crear, actualizar y eliminar clientes
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

-- El personal puede ver todos los clientes
CREATE POLICY "El personal puede ver todos los clientes" 
  ON public.clientes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- El personal puede actualizar clientes pero no eliminarlos
CREATE POLICY "El personal puede actualizar clientes" 
  ON public.clientes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- Los clientes solo pueden ver su propio perfil
CREATE POLICY "Los clientes pueden ver su propio perfil" 
  ON public.clientes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_clientes_nombre ON public.clientes (nombre);
CREATE INDEX idx_clientes_estado_del_mes ON public.clientes (estado_del_mes);
CREATE INDEX idx_clientes_plan ON public.clientes (plan);
CREATE INDEX idx_clientes_entrenador ON public.clientes (entrenador);
CREATE INDEX idx_clientes_dia_de_pago ON public.clientes (dia_de_pago);

-- Función para actualizar el timestamp 'updated_at' cuando se actualiza un registro
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el timestamp 'updated_at'
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
