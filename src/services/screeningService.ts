import { supabase } from '../lib/supabase/client'
import type { Screening, InsertScreening, UpdateScreening } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const screeningService = {
  async getAll(): Promise<Result<Screening[]>> {
    try {
      const { data, error } = await supabase.from('screenings').select('*').order('screening_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as Screening[])
    } catch {
      return failure('Failed to fetch screenings')
    }
  },

  async getById(id: string): Promise<Result<Screening>> {
    try {
      const { data, error } = await supabase.from('screenings').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as Screening)
    } catch {
      return failure('Failed to fetch screening')
    }
  },

  async getByPatientId(patientId: string): Promise<Result<Screening[]>> {
    try {
      const { data, error } = await supabase.from('screenings').select('*').eq('patient_id', patientId).order('screening_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as Screening[])
    } catch {
      return failure('Failed to fetch patient screenings')
    }
  },

  async create(screening: InsertScreening): Promise<Result<Screening>> {
    try {
      const { data, error } = await supabase.from('screenings').insert(screening).select().single()
      if (error) return failure(error.message)
      return success(data as Screening)
    } catch {
      return failure('Failed to create screening')
    }
  },

  async update(id: string, updates: UpdateScreening): Promise<Result<Screening>> {
    try {
      const { data, error } = await supabase.from('screenings').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as Screening)
    } catch {
      return failure('Failed to update screening')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('screenings').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete screening')
    }
  },
}
