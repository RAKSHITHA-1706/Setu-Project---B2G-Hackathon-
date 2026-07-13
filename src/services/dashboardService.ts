import { supabase } from '../lib/supabase/client'
import { success, failure } from '../lib/supabase/helpers'
import type { Result } from '../lib/supabase/helpers'
import type { Patient, RiskScore, Screening, Referral, FollowUpVisit } from '../models'

/**
 * Dashboard & Aggregation Helpers
 * These queries join and aggregate data specifically to support BOTH
 * the Mobile UI (ASHA/ANM workflows) and the Desktop Dashboard.
 */
export const dashboardService = {
  async getHighRiskPatients(): Promise<Result<(RiskScore & { patients: Patient })[]>> {
    try {
      const { data, error } = await supabase
        .from('risk_scores')
        .select(`*, patients (*)`)
        .in('risk_level', ['high', 'critical'])
        .order('score', { ascending: false })

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch high risk patients')
    }
  },

  async getMediumRiskPatients(): Promise<Result<(RiskScore & { patients: Patient })[]>> {
    try {
      const { data, error } = await supabase
        .from('risk_scores')
        .select(`*, patients (*)`)
        .eq('risk_level', 'medium')
        .order('score', { ascending: false })

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch medium risk patients')
    }
  },

  async getPatientsDueToday(): Promise<Result<(FollowUpVisit & { patients: Patient })[]>> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('followup_visits')
        .select(`*, patients (*)`)
        .eq('expected_next_visit_date', today)

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch patients due today')
    }
  },

  async getOverduePatients(): Promise<Result<(FollowUpVisit & { patients: Patient })[]>> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('followup_visits')
        .select(`*, patients (*)`)
        .lt('expected_next_visit_date', today)
        .order('expected_next_visit_date', { ascending: true }) // Most overdue first

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch overdue patients')
    }
  },

  async getRecentScreenings(limit = 10): Promise<Result<(Screening & { patients: Patient })[]>> {
    try {
      const { data, error } = await supabase
        .from('screenings')
        .select(`*, patients (*)`)
        .order('screening_date', { ascending: false })
        .limit(limit)

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch recent screenings')
    }
  },

  async getRecentReferrals(limit = 10): Promise<Result<(Referral & { patients: Patient })[]>> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`*, patients (*)`)
        .order('created_date', { ascending: false })
        .limit(limit)

      if (error) return failure(error.message)
      return success(data as any)
    } catch {
      return failure('Failed to fetch recent referrals')
    }
  },

  async getPatientsNeedingHomeVisit(): Promise<Result<any[]>> {
    try {
      const { data, error } = await supabase
        .from('risk_scores')
        .select(`*, patients (*)`)
        .ilike('suggested_action', '%home visit%')

      if (error) return failure(error.message)
      return success(data as any[])
    } catch {
      return failure('Failed to fetch patients needing home visits')
    }
  },

  async getVillageStatistics(): Promise<Result<any>> {
    try {
      const [villagesRes, patientsRes] = await Promise.all([
        supabase.from('villages').select('id, name'),
        supabase.from('patients').select('village_id'),
      ])

      if (villagesRes.error) return failure(villagesRes.error.message)
      if (patientsRes.error) return failure(patientsRes.error.message)

      const counts = patientsRes.data.reduce(
        (acc, curr) => {
          acc[curr.village_id] = (acc[curr.village_id] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const stats = villagesRes.data.map((v) => ({
        id: v.id,
        name: v.name,
        patientCount: counts[v.id] || 0,
      }))

      return success(stats)
    } catch {
      return failure('Failed to fetch village statistics')
    }
  },

  async getDashboardSummary(): Promise<Result<any>> {
    try {
      const [patientsRes, highRiskRes, referralsRes] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('risk_scores').select('*', { count: 'exact', head: true }).in('risk_level', ['high', 'critical']),
        supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      return success({
        totalPatients: patientsRes.count || 0,
        highRiskPatients: highRiskRes.count || 0,
        pendingReferrals: referralsRes.count || 0,
      })
    } catch {
      return failure('Failed to fetch dashboard summary')
    }
  },
}
