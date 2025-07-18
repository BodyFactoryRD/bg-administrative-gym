import { createClient } from '@/utils/supabase/client';

export interface Sistema {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SistemaInput {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

/**
 * Obtiene todos los sistemas activos
 */
export async function getSistemas(incluirInactivos = false) {
  const supabase = createClient();
  
  let query = supabase
    .from('sistemas')
    .select('*')
    .order('nombre', { ascending: true });
  
  if (!incluirInactivos) {
    query = query.eq('activo', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error al obtener sistemas:', error);
    return [];
  }
  
  return data as Sistema[];
}

/**
 * Crea un nuevo sistema
 */
export async function createSistema(sistemaData: SistemaInput) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sistemas')
    .insert([sistemaData])
    .select();
  
  if (error) {
    console.error('Error al crear sistema:', error);
    return { error };
  }
  
  return { data: data[0] as Sistema };
}

/**
 * Actualiza un sistema existente
 */
export async function updateSistema(id: string, sistemaData: Partial<SistemaInput>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sistemas')
    .update(sistemaData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error al actualizar sistema con ID ${id}:`, error);
    return { error };
  }
  
  return { data: data[0] as Sistema };
}

/**
 * Elimina un sistema (marcándolo como inactivo)
 */
export async function deleteSistema(id: string) {
  const supabase = createClient();
  
  // En lugar de eliminar, marcamos como inactivo
  const { error } = await supabase
    .from('sistemas')
    .update({ activo: false })
    .eq('id', id);
  
  if (error) {
    console.error(`Error al eliminar sistema con ID ${id}:`, error);
    return { error };
  }
  
  return { success: true };
}

/**
 * Inicializa los sistemas predeterminados si no existen
 */
export async function inicializarSistemas() {
  const supabase = createClient();
  
  // Verificar si ya existen sistemas
  const { data: sistemasExistentes } = await supabase
    .from('sistemas')
    .select('nombre');
  
  if (sistemasExistentes && sistemasExistentes.length > 0) {
    return { message: 'Los sistemas ya están inicializados' };
  }
  
  // Crear los sistemas predeterminados
  const sistemas = [
    {
      nombre: 'Body Factory',
      descripcion: 'Sistema principal de Body Factory',
      activo: true
    },
    {
      nombre: 'Signature',
      descripcion: 'Sistema premium Signature',
      activo: true
    }
  ];
  
  const { data, error } = await supabase
    .from('sistemas')
    .insert(sistemas)
    .select();
  
  if (error) {
    console.error('Error al inicializar sistemas:', error);
    return { error };
  }
  
  return { data, message: 'Sistemas inicializados correctamente' };
}
