-- Crear tabla de pagos
CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  mes_correspondiente TEXT NOT NULL, -- Formato: 'YYYY-MM'
  metodo_pago TEXT NOT NULL,
  comprobante TEXT,
  notas TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para pagos
-- Los administradores pueden ver todos los pagos
CREATE POLICY "Los administradores pueden ver todos los pagos" 
  ON public.pagos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Los administradores pueden crear, actualizar y eliminar pagos
CREATE POLICY "Los administradores pueden modificar pagos" 
  ON public.pagos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- El personal puede ver todos los pagos
CREATE POLICY "El personal puede ver todos los pagos" 
  ON public.pagos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- El personal puede crear pagos
CREATE POLICY "El personal puede crear pagos" 
  ON public.pagos 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'staff'
    )
  );

-- Los clientes pueden ver sus propios pagos
CREATE POLICY "Los clientes pueden ver sus propios pagos" 
  ON public.pagos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes
      WHERE cliente_id = id AND user_id = auth.uid()
    )
  );

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_pagos_cliente_id ON public.pagos (cliente_id);
CREATE INDEX idx_pagos_fecha_pago ON public.pagos (fecha_pago);
CREATE INDEX idx_pagos_mes_correspondiente ON public.pagos (mes_correspondiente);

-- Función para actualizar el timestamp 'updated_at' cuando se actualiza un registro
CREATE TRIGGER update_pagos_updated_at
  BEFORE UPDATE ON public.pagos
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Función para actualizar automáticamente el estado del mes del cliente cuando se registra un pago
CREATE OR REPLACE FUNCTION update_cliente_estado_after_payment()
RETURNS TRIGGER AS $$
DECLARE
  current_month TEXT;
BEGIN
  -- Obtener el mes actual en formato 'YYYY-MM'
  current_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  -- Si el pago corresponde al mes actual, actualizar el estado del cliente a 'Pagado'
  IF NEW.mes_correspondiente = current_month THEN
    UPDATE public.clientes
    SET estado_del_mes = 'Pagado'
    WHERE id = NEW.cliente_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el estado del cliente después de un pago
CREATE TRIGGER update_cliente_estado_on_payment
  AFTER INSERT ON public.pagos
  FOR EACH ROW EXECUTE PROCEDURE update_cliente_estado_after_payment();
