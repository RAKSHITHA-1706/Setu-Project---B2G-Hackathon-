import { supabase } from '../lib/supabase/client'
import type { FollowUpVisit, InsertFollowUpVisit, UpdateFollowUpVisit } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const followupService = {
  async getAll(): Promise<Result<FollowUpVisit[]>> {
    try {
      const { data, error } = await supabase.from('followup_visits').select('*').order('visit_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as FollowUpVisit[])
    } catch {
      return failure('Failed to fetch follow-up visits')
    }
  },

  async getById(id: string): Promise<Result<FollowUpVisit>> {
    try {
      const { data, error } = await supabase.from('followup_visits').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as FollowUpVisit)
    } catch {
      return failure('Failed to fetch follow-up visit')
    }
  },

  async getByPatientId(patientId: string): Promise<Result<FollowUpVisit[]>> {
    try {
      const { data, error } = await supabase.from('followup_visits').select('*').eq('patient_id', patientId).order('visit_date', { ascending: false })
      if (error) return failure(error.message)
      return success(data as FollowUpVisit[])
    } catch {
      return failure('Failed to fetch patient follow-up visits')
    }
  },

  async create(visit: InsertFollowUpVisit): Promise<Result<FollowUpVisit>> {
    try {
      const { data, error } = await supabase.from('followup_visits').insert(visit).select().single()
      if (error) return failure(error.message)
      return success(data as FollowUpVisit)
    } catch {
      return failure('Failed to create follow-up visit')
    }
  },

  async update(id: string, updates: UpdateFollowUpVisit): Promise<Result<FollowUpVisit>> {
    try {
      const { data, error } = await supabase.from('followup_visits').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as FollowUpVisit)
    } catch {
      return failure('Failed to update follow-up visit')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('followup_visits').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete follow-up visit')
    }
  },
}
