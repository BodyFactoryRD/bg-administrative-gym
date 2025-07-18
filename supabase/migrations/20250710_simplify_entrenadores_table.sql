-- Migración para simplificar la tabla de entrenadores
-- Eliminar campos no necesarios

-- Eliminar columnas
ALTER TABLE public.entrenadores
  DROP COLUMN IF EXISTS direccion,
  DROP COLUMN IF EXISTS fecha_contratacion,
  DROP COLUMN IF EXISTS especialidad,
  DROP COLUMN IF EXISTS horario,
  DROP COLUMN IF EXISTS salario_base;

-- Actualizar comentarios de la tabla
COMMENT ON TABLE public.entrenadores IS 'Tabla para almacenar los entrenadores del gimnasio con estructura simplificada';
