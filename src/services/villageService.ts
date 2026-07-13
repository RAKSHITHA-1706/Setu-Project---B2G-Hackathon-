import { supabase } from '../lib/supabase/client'
import type { Village, InsertVillage, UpdateVillage } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const villageService = {
  async getAll(): Promise<Result<Village[]>> {
    try {
      const { data, error } = await supabase.from('villages').select('*').order('name')
      if (error) return failure(error.message)
      return success(data as Village[])
    } catch {
      return failure('Failed to fetch villages')
    }
  },

  async getById(id: string): Promise<Result<Village>> {
    try {
      const { data, error } = await supabase.from('villages').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as Village)
    } catch {
      return failure('Failed to fetch village')
    }
  },

  async create(village: InsertVillage): Promise<Result<Village>> {
    try {
      const { data, error } = await supabase.from('villages').insert(village).select().single()
      if (error) return failure(error.message)
      return success(data as Village)
    } catch {
      return failure('Failed to create village')
    }
  },

  async update(id: string, updates: UpdateVillage): Promise<Result<Village>> {
    try {
      const { data, error } = await supabase.from('villages').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as Village)
    } catch {
      return failure('Failed to update village')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('villages').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete village')
    }
  },
}
