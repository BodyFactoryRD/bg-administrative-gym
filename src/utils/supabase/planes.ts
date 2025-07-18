import { createClient } from "@/utils/supabase/client"

export interface Plan {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface PlanInput {
  nombre: string
  descripcion?: string
  activo?: boolean
}

/**
 * Obtiene todos los planes activos
 */
export async function getPlanes(incluirInactivos = false) {
  const supabase = createClient()

  let query = supabase
    .from("planes")
    .select("*")
    .order("nombre", { ascending: true })

  if (!incluirInactivos) {
    query = query.eq("activo", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener planes:", error)
    return []
  }

  return data as Plan[]
}

/**
 * Obtiene un plan por su ID
 */
export async function getPlanById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error al obtener plan con ID ${id}:`, error)
    return null
  }

  return data as Plan
}

/**
 * Crea un nuevo plan
 */
export async function createPlan(planData: PlanInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .insert([planData])
    .select()

  if (error) {
    console.error("Error al crear plan:", error)
    return { error }
  }

  return { data: data[0] as Plan }
}

/**
 * Actualiza un plan existente
 */
export async function updatePlan(id: string, planData: Partial<PlanInput>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .update(planData)
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error al actualizar plan con ID ${id}:`, error)
    return { error }
  }

  return { data: data[0] as Plan }
}

/**
 * Elimina un plan (marcándolo como inactivo)
 */
export async function deletePlan(id: string) {
  const supabase = createClient()

  // En lugar de eliminar, marcamos como inactivo
  const { error } = await supabase
    .from("planes")
    .update({ activo: false })
    .eq("id", id)

  if (error) {
    console.error(`Error al eliminar plan con ID ${id}:`, error)
    return { error }
  }

  return { success: true }
}

/**
 * Busca planes por nombre
 */
export async function searchPlanes(query: string, incluirInactivos = false) {
  const supabase = createClient()

  let queryBuilder = supabase
    .from("planes")
    .select("*")
    .ilike("nombre", `%${query}%`)
    .order("nombre", { ascending: true })

  if (!incluirInactivos) {
    queryBuilder = queryBuilder.eq("activo", true)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error("Error al buscar planes:", error)
    return []
  }

  return data as Plan[]
}

/**
 * Obtiene planes por rango de precio
 */
export async function getPlanesByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .select("*")
    .eq("activo", true)
    .gte("precio", minPrice)
    .lte("precio", maxPrice)
    .order("precio", { ascending: true })

  if (error) {
    console.error(`Error al obtener planes por rango de precio:`, error)
    return []
  }

  return data as Plan[]
}

/**
 * Obtiene planes que incluyen entrenador
 */
export async function getPlanesConEntrenador() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .select("*")
    .eq("activo", true)
    .eq("incluye_entrenador", true)
    .order("precio", { ascending: true })

  if (error) {
    console.error("Error al obtener planes con entrenador:", error)
    return []
  }

  return data as Plan[]
}

/**
 * Obtiene planes con acceso ilimitado
 */
export async function getPlanesConAccesoIlimitado() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("planes")
    .select("*")
    .eq("activo", true)
    .eq("acceso_ilimitado", true)
    .order("precio", { ascending: true })

  if (error) {
    console.error("Error al obtener planes con acceso ilimitado:", error)
    return []
  }

  return data as Plan[]
}
