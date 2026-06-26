/**
 * Generic Supabase CRUD factory for Bella CRM.
 * Replaces Firestore CRUD factory.
 */
import { supabase } from './supabase'

export function createCollectionService(tableName, { defaultOrderBy = 'created_at' } = {}) {
  async function list() {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(defaultOrderBy, { ascending: false })
    if (error) throw error
    return data || []
  }

  async function get(id) {
    const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async function create(docData) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from(tableName)
      .insert({ ...docData, created_at: now, updated_at: now })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async function update(id, docData) {
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...docData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async function remove(id) {
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    if (error) throw error
    return id
  }

  function subscribe(callback, onError) {
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        list().then(callback).catch(onError)
      })
      .subscribe()
    // Initial load
    list().then(callback).catch(onError)
    return () => supabase.removeChannel(channel)
  }

  return { tableName, list, get, create, update, remove, subscribe }
}
