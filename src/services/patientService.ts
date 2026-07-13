import { supabase } from '../lib/supabase/client'
import type { Patient, InsertPatient, UpdatePatient } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const patientService = {
  async getAll(): Promise<Result<Patient[]>> {
    try {
      const { data, error } = await supabase.from('patients').select('*').order('full_name')
      if (error) return failure(error.message)
      return success(data as Patient[])
    } catch {
      return failure('Failed to fetch patients')
    }
  },

  async getById(id: string): Promise<Result<Patient>> {
    try {
      const { data, error } = await supabase.from('patients').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as Patient)
    } catch {
      return failure('Failed to fetch patient')
    }
  },

  async getByVillageId(villageId: string): Promise<Result<Patient[]>> {
    try {
      const { data, error } = await supabase.from('patients').select('*').eq('village_id', villageId).order('full_name')
      if (error) return failure(error.message)
      return success(data as Patient[])
    } catch {
      return failure('Failed to fetch patients for village')
    }
  },

  async create(patient: InsertPatient): Promise<Result<Patient>> {
    try {
      const { data, error } = await supabase.from('patients').insert(patient).select().single()
      if (error) return failure(error.message)
      return success(data as Patient)
    } catch {
      return failure('Failed to create patient')
    }
  },

  async update(id: string, updates: UpdatePatient): Promise<Result<Patient>> {
    try {
      const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as Patient)
    } catch {
      return failure('Failed to update patient')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('patients').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete patient')
    }
  },
}
