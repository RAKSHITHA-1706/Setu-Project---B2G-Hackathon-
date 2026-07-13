import { supabase } from '../lib/supabase/client'
import type { Referral, InsertReferral, UpdateReferral } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const referralService = {
  async getAll(): Promise<Result<Referral[]>> {
    try {
      const { data, error } = await supabase.from('referrals').select('*').order('created_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as Referral[])
    } catch {
      return failure('Failed to fetch referrals')
    }
  },

  async getById(id: string): Promise<Result<Referral>> {
    try {
      const { data, error } = await supabase.from('referrals').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as Referral)
    } catch {
      return failure('Failed to fetch referral')
    }
  },

  async getByPatientId(patientId: string): Promise<Result<Referral[]>> {
    try {
      const { data, error } = await supabase.from('referrals').select('*').eq('patient_id', patientId).order('created_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as Referral[])
    } catch {
      return failure('Failed to fetch patient referrals')
    }
  },

  async create(referral: InsertReferral): Promise<Result<Referral>> {
    try {
      const { data, error } = await supabase.from('referrals').insert(referral).select().single()
      if (error) return failure(error.message)
      return success(data as Referral)
    } catch {
      return failure('Failed to create referral')
    }
  },

  async update(id: string, updates: UpdateReferral): Promise<Result<Referral>> {
    try {
      const { data, error } = await supabase.from('referrals').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as Referral)
    } catch {
      return failure('Failed to update referral')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('referrals').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete referral')
    }
  },
}
