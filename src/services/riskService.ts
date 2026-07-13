import { supabase } from '../lib/supabase/client'
import type { RiskScore, InsertRiskScore, UpdateRiskScore } from '../models'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'

export const riskService = {
  async getAll(): Promise<Result<RiskScore[]>> {
    try {
      const { data, error } = await supabase.from('risk_scores').select('*').order('calculated_at', { ascending: false })
      if (error) return failure(error.message)
      return success(data as RiskScore[])
    } catch {
      return failure('Failed to fetch risk scores')
    }
  },

  async getById(id: string): Promise<Result<RiskScore>> {
    try {
      const { data, error } = await supabase.from('risk_scores').select('*').eq('id', id).single()
      if (error) return failure(error.message)
      return success(data as RiskScore)
    } catch {
      return failure('Failed to fetch risk score')
    }
  },

  async getByPatientId(patientId: string): Promise<Result<RiskScore[]>> {
    try {
      const { data, error } = await supabase.from('risk_scores').select('*').eq('patient_id', patientId).order('calculated_at', { ascending: false })
      if (error) return failure(error.message)
      return success(data as RiskScore[])
    } catch {
      return failure('Failed to fetch patient risk scores')
    }
  },

  async create(riskScore: InsertRiskScore): Promise<Result<RiskScore>> {
    try {
      const { data, error } = await supabase.from('risk_scores').insert(riskScore).select().single()
      if (error) return failure(error.message)
      return success(data as RiskScore)
    } catch {
      return failure('Failed to create risk score')
    }
  },

  async update(id: string, updates: UpdateRiskScore): Promise<Result<RiskScore>> {
    try {
      const { data, error } = await supabase.from('risk_scores').update(updates).eq('id', id).select().single()
      if (error) return failure(error.message)
      return success(data as RiskScore)
    } catch {
      return failure('Failed to update risk score')
    }
  },

  async delete(id: string): Promise<Result<null>> {
    try {
      const { error } = await supabase.from('risk_scores').delete().eq('id', id)
      if (error) return failure(error.message)
      return success(null)
    } catch {
      return failure('Failed to delete risk score')
    }
  },
}
