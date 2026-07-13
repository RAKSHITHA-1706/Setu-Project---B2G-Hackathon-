/**
 * Setu Database Models
 * Matches the Supabase schema defined in Phase 2.
 */

export interface Village {
  id: string
  name: string
  district: string
  distance_from_phc_km: number
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  full_name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string | null
  village_id: string
  registered_date: string
  created_at: string
  updated_at: string
}

export interface Screening {
  id: string
  patient_id: string
  screening_date: string
  disease_type: string
  bp_systolic: number | null
  bp_diastolic: number | null
  flagged_condition: boolean
  created_at: string
}

export interface FollowUpVisit {
  id: string
  patient_id: string
  visit_date: string
  bp_systolic: number | null
  bp_diastolic: number | null
  medication_adherent: boolean | null
  chw_notes: string | null
  expected_next_visit_date: string | null
  created_at: string
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface RiskScore {
  id: string
  patient_id: string
  disease_type: string
  score: number
  risk_level: RiskLevel
  ai_reason: string | null
  suggested_action: string | null
  calculated_at: string
}

export type ReferralUrgency = 'routine' | 'urgent' | 'emergency'
export type ReferralStatus = 'pending' | 'completed' | 'cancelled' | 'no_show'

export interface Referral {
  id: string
  patient_id: string
  created_date: string
  urgency: ReferralUrgency
  ai_summary: string | null
  status: ReferralStatus
}

/**
 * Common payload types for inserts and updates
 */
export type InsertPatient = Omit<Patient, 'id' | 'created_at' | 'updated_at'> & { id?: string }
export type UpdatePatient = Partial<InsertPatient>

export type InsertVillage = Omit<Village, 'id' | 'created_at' | 'updated_at'> & { id?: string }
export type UpdateVillage = Partial<InsertVillage>

export type InsertScreening = Omit<Screening, 'id' | 'created_at'> & { id?: string }
export type UpdateScreening = Partial<InsertScreening>

export type InsertFollowUpVisit = Omit<FollowUpVisit, 'id' | 'created_at'> & { id?: string }
export type UpdateFollowUpVisit = Partial<InsertFollowUpVisit>

export type InsertRiskScore = Omit<RiskScore, 'id' | 'calculated_at'> & { id?: string }
export type UpdateRiskScore = Partial<InsertRiskScore>

export type InsertReferral = Omit<Referral, 'id'> & { id?: string }
export type UpdateReferral = Partial<InsertReferral>
