import { createClient } from '@/utils/supabase/client';

export interface Entrenador {
  id: string;
  user_id?: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  comision_porcentaje?: number;
  notas?: string;
  activo: boolean;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EntrenadorInput {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  comision_porcentaje?: number;
  notas?: string;
  imagen_url?: string;
  user_id?: string;
}

/**
 * Obtiene todos los entrenadores activos
 */
export async function getEntrenadores() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('entrenadores')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error('Error al obtener entrenadores:', error);
    return [];
  }
  
  return data as Entrenador[];
}

/**
 * Obtiene un entrenador por su ID
 */
export async function getEntrenadorById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('entrenadores')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error al obtener entrenador con ID ${id}:`, error);
    return null;
  }
  
  return data as Entrenador;
}

/**
 * Crea un nuevo entrenador
 */
export async function createEntrenador(entrenadorData: EntrenadorInput) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('entrenadores')
    .insert([entrenadorData])
    .select();
  
  if (error) {
    console.error('Error al crear entrenador:', error);
    return { error };
  }
  
  return { data: data[0] as Entrenador };
}

/**
 * Actualiza un entrenador existente
 */
export async function updateEntrenador(id: string, entrenadorData: Partial<EntrenadorInput>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('entrenadores')
    .update(entrenadorData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error al actualizar entrenador con ID ${id}:`, error);
    return { error };
  }
  
  return { data: data[0] as Entrenador };
}

/**
 * Elimina un entrenador (marcándolo como inactivo)
 */
export async function deleteEntrenador(id: string) {
  const supabase = await createClient();
  
  // En lugar de eliminar, marcamos como inactivo
  const { error } = await supabase
    .from('entrenadores')
    .update({ activo: false })
    .eq('id', id);
  
  if (error) {
    console.error(`Error al eliminar entrenador con ID ${id}:`, error);
    return { error };
  }
  
  return { success: true };
}

/**
 * Busca entrenadores por nombre
 */
export async function searchEntrenadores(query: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('entrenadores')
    .select('*')
    .eq('activo', true)
    .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%`)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error('Error al buscar entrenadores:', error);
    return [];
  }
  
  return data as Entrenador[];
}

/**
 * Obtiene el número de clientes asignados a cada entrenador
 */
export async function getClientesPorEntrenador() {
  const supabase = await createClient();
  
  // Obtenemos todos los entrenadores activos
  const { data: entrenadores, error: errorEntrenadores } = await supabase
    .from('entrenadores')
    .select('id, nombre, apellido')
    .eq('activo', true);
  
  if (errorEntrenadores) {
    console.error('Error al obtener entrenadores:', errorEntrenadores);
    return [];
  }
  
  // Para cada entrenador, contamos sus clientes
  const entrenadorConClientes = await Promise.all(entrenadores.map(async (entrenador) => {
    const { count, error: errorCount } = await supabase
      .from('clientes')
      .select('id', { count: 'exact', head: true })
      .eq('entrenador', entrenador.id)
      .eq('activo', true);
    
    if (errorCount) {
      console.error(`Error al contar clientes para entrenador ${entrenador.id}:`, errorCount);
      return {
        ...entrenador,
        clientes_count: 0
      };
    }
    
    return {
      ...entrenador,
      clientes_count: count || 0
    };
  }));
  
  return entrenadorConClientes;
}
