import { createClient } from '@/utils/supabase/client';

export interface Pago {
  id: string;
  cliente_id: string;
  monto: number;
  fecha_pago: string;
  mes_correspondiente: string; // Formato: 'YYYY-MM'
  metodo_pago: string;
  comprobante?: string;
  notas?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PagoInput {
  cliente_id: string;
  monto: number;
  fecha_pago?: string; // Si no se proporciona, se usará la fecha actual
  mes_correspondiente: string;
  metodo_pago: string;
  comprobante?: string;
  notas?: string;
}

/**
 * Obtiene todos los pagos
 */
export async function getPagos() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .order('fecha_pago', { ascending: false });
  
  if (error) {
    console.error('Error al obtener pagos:', error);
    return [];
  }
  
  return data as Pago[];
}

/**
 * Obtiene los pagos de un cliente específico
 */
export async function getPagosByClienteId(clienteId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('fecha_pago', { ascending: false });
  
  if (error) {
    console.error(`Error al obtener pagos del cliente ${clienteId}:`, error);
    return [];
  }
  
  return data as Pago[];
}

/**
 * Obtiene un pago por su ID
 */
export async function getPagoById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error al obtener pago con ID ${id}:`, error);
    return null;
  }
  
  return data as Pago;
}

/**
 * Crea un nuevo pago
 */
export async function createPago(pagoData: PagoInput) {
  const supabase = await createClient();
  
  // Obtener el usuario actual para registrarlo como creador del pago
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('pagos')
    .insert([{
      ...pagoData,
      created_by: user?.id
    }])
    .select();
  
  if (error) {
    console.error('Error al crear pago:', error);
    return { error };
  }
  
  return { data: data[0] as Pago };
}

/**
 * Actualiza un pago existente
 */
export async function updatePago(id: string, pagoData: Partial<PagoInput>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pagos')
    .update(pagoData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error al actualizar pago con ID ${id}:`, error);
    return { error };
  }
  
  return { data: data[0] as Pago };
}

/**
 * Elimina un pago
 */
export async function deletePago(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('pagos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error al eliminar pago con ID ${id}:`, error);
    return { error };
  }
  
  return { success: true };
}

/**
 * Obtiene los pagos por mes
 */
export async function getPagosByMes(mes: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('mes_correspondiente', mes)
    .order('fecha_pago', { ascending: false });
  
  if (error) {
    console.error(`Error al obtener pagos del mes ${mes}:`, error);
    return [];
  }
  
  return data as Pago[];
}

/**
 * Obtiene estadísticas de pagos
 */
export async function getPagosStats() {
  const supabase = await createClient();
  
  // Obtener el mes actual en formato 'YYYY-MM'
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Total de pagos del mes actual
  const { data: pagosMes, error: errorPagosMes } = await supabase
    .from('pagos')
    .select('monto')
    .eq('mes_correspondiente', currentMonth);
  
  if (errorPagosMes) {
    console.error('Error al obtener pagos del mes:', errorPagosMes);
    return null;
  }
  
  // Calcular el total recaudado en el mes
  const totalMes = pagosMes.reduce((sum, pago) => sum + Number(pago.monto), 0);
  
  // Total de pagos del día actual
  const today = new Date().toISOString().split('T')[0];
  
  const { data: pagosHoy, error: errorPagosHoy } = await supabase
    .from('pagos')
    .select('monto')
    .gte('fecha_pago', `${today}T00:00:00`)
    .lte('fecha_pago', `${today}T23:59:59`);
  
  if (errorPagosHoy) {
    console.error('Error al obtener pagos del día:', errorPagosHoy);
    return null;
  }
  
  // Calcular el total recaudado en el día
  const totalHoy = pagosHoy.reduce((sum, pago) => sum + Number(pago.monto), 0);
  
  return {
    totalMes,
    totalHoy,
    cantidadPagosMes: pagosMes.length,
    cantidadPagosHoy: pagosHoy.length
  };
}
