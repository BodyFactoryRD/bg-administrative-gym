import { createClient } from '@/utils/supabase/client';

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  fecha_inscripcion: string;
  plan: string;
  sistema: string;
  entrenador?: string;
  entrenador_nombre?: string;
  pago_mensual: number;
  dia_de_pago: number;
  estado_del_mes: 'Pagado' | 'Pendiente';
  notas?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteInput {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  plan: string;
  sistema: string;
  entrenador?: string;
  pago_mensual: number;
  dia_de_pago: number;
  estado_del_mes?: 'Pagado' | 'Pendiente';
  notas?: string;
}

/**
 * Obtiene todos los clientes activos con información del entrenador
 */
export async function getClientes() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .select(`
      *,
      entrenador:entrenadores(id, nombre, apellido)
    `)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
  
  // Procesar los datos para incluir el nombre completo del entrenador
  const clientesConEntrenador = data.map((cliente: Cliente & { entrenador?: { nombre: string, apellido: string } }) => {
    if (cliente.entrenador) {
      return {
        ...cliente,
        entrenador_nombre: `${cliente.entrenador.nombre} ${cliente.entrenador.apellido}`
      };
    }
    return cliente;
  });
  console.log('clientesConEntrenador',clientesConEntrenador);
  return clientesConEntrenador as Cliente[];

}

/**
 * Obtiene un cliente por su ID
 */

export async function getClienteById(id: string) {
  try {
    // En el servidor, usamos createClient que es asíncrono
    const isServer = typeof window === 'undefined';
    
    // Crear el cliente de Supabase adecuado según el entorno
    const supabase = isServer 
      ? await createClient() // En servidor, es asíncrono
      : createClient();      // En cliente, es síncrono
    
    // Verificar si el ID tiene el formato correcto
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('ID de cliente inválido');
      return null;
    }
    
    // Intentar obtener el cliente
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error al obtener cliente con ID ${id}:`, error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Si el cliente tiene un entrenador asignado, obtener sus datos
    if (data.entrenador) {
      try {
        const { data: entrenadorData } = await supabase
          .from('entrenadores')
          .select('id, nombre, apellido')
          .eq('id', data.entrenador)
          .single();
          
        if (entrenadorData) {
          // Asignar el nombre del entrenador al objeto cliente
          data.entrenador_nombre = `${entrenadorData.nombre} ${entrenadorData.apellido}`;
        }
      } catch (entrenadorError) {
        console.error('Error al obtener datos del entrenador:', entrenadorError);
      }
    }
    
    return data as Cliente;
  } catch (error) {
    console.error(`Error inesperado al obtener cliente con ID ${id}:`, error);
    return null;
  }
}

/**
 * Crea un nuevo cliente
 */
export async function createCliente(clienteData: ClienteInput) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .insert([{
      ...clienteData,
      estado_del_mes: clienteData.estado_del_mes || 'Pendiente'
    }])
    .select();
  
  if (error) {
    console.error('Error al crear cliente:', error);
    return { error };
  }
  
  return { data: data[0] as Cliente };
}

/**
 * Actualiza un cliente existente
 */
export async function updateCliente(id: string, clienteData: Partial<ClienteInput>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .update(clienteData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error al actualizar cliente con ID ${id}:`, error);
    return { error };
  }
  
  return { data: data[0] as Cliente };
}

/**
 * Elimina un cliente (marcándolo como inactivo)
 */
export async function deleteCliente(id: string) {
  const supabase = await createClient();
  
  // En lugar de eliminar, marcamos como inactivo
  const { error } = await supabase
    .from('clientes')
    .update({ activo: false })
    .eq('id', id);
  
  if (error) {
    console.error(`Error al eliminar cliente con ID ${id}:`, error);
    return { error };
  }
  
  return { success: true };
}

/**
 * Actualiza el estado del mes de un cliente
 */
export async function updateEstadoDelMes(id: string, estado: 'Pagado' | 'Pendiente') {
  return updateCliente(id, { estado_del_mes: estado });
}

/**
 * Busca clientes por nombre
 */
export async function searchClientes(query: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,email.ilike.%${query}%`)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error('Error al buscar clientes:', error);
    return [];
  }
  
  return data as Cliente[];
}

/**
 * Filtra clientes por estado del mes
 */
export async function filterClientesByEstado(estado: 'Pagado' | 'Pendiente') {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('estado_del_mes', estado)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error(`Error al filtrar clientes por estado ${estado}:`, error);
    return [];
  }
  
  return data as Cliente[];
}

/**
 * Obtiene estadísticas de clientes
 */
export async function getClientesStats() {
  const supabase = await createClient();
  
  // Total de clientes activos
  const { count: totalClientes, error: errorTotal } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true);
  
  if (errorTotal) {
    console.error('Error al obtener total de clientes:', errorTotal);
    return {
      totalClientes: 0,
      clientesPagados: 0,
      clientesPendientes: 0,
      porcentajePagados: 0
    };
  }
  
  // Clientes con estado 'Pagado'
  const { count: clientesPagados, error: errorPagados } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true)
    .eq('estado_del_mes', 'Pagado');
  
  if (errorPagados) {
    console.error('Error al obtener clientes pagados:', errorPagados);
    return {
      totalClientes: totalClientes || 0,
      clientesPagados: 0,
      clientesPendientes: 0,
      porcentajePagados: 0
    };
  }
  
  // Calcular estadísticas
  const clientesPendientes = (totalClientes || 0) - (clientesPagados || 0);
  const porcentajePagados = totalClientes ? Math.round((clientesPagados || 0) * 100 / totalClientes) : 0;
  
  return {
    totalClientes: totalClientes || 0,
    clientesPagados: clientesPagados || 0,
    clientesPendientes,
    porcentajePagados
  };
}

/**
 * Obtiene todos los clientes asignados a un entrenador específico
 */
export async function getClientesByEntrenador(entrenadorId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('entrenador', entrenadorId)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) {
    console.error(`Error al obtener clientes del entrenador ${entrenadorId}:`, error);
    return [];
  }
  
  return data as Cliente[];
}
