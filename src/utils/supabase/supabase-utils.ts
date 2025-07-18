import { createClient as createClientServer } from '@/utils/supabase/server';
import { createClient as createClientBrowser } from '@/utils/supabase/client';

/**
 * Crea un cliente Supabase que funciona tanto en el servidor como en el cliente
 * Detecta automáticamente el entorno y usa la versión apropiada
 */
export async function createSupabaseClient() {
  // Verificar si estamos en el servidor o en el cliente
  const isServer = typeof window === 'undefined';
  
  try {
    if (isServer) {
      // En el servidor, usamos la versión del servidor
      return await createClientServer();
    } else {
      // En el cliente, usamos la versión del navegador
      return createClientBrowser();
    }
  } catch (error) {
    console.error('Error al crear cliente Supabase:', error);
    // En caso de error, intentamos usar la versión del navegador como fallback
    return createClientBrowser();
  }
}
