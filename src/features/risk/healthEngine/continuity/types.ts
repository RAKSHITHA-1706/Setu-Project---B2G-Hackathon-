/**
 * Core types for the Continuity Risk Engine.
 */

export interface Village {
  id: string
  name: string
  distanceFromPhcKm: number
}

export interface Patient {
  id: string
  fullName: string
  age: number
  gender: 'male' | 'female' | 'other'
}

export interface FollowUpVisit {
  id: string
  visitDate: Date
  bpSystolic: number
  bpDiastolic: number
  medicationAdherent: boolean
  expectedNextVisitDate: Date
}

export interface RiskFactors {
  overdue: number
  bpTrend: number
  adherence: number
  distance: number
  severity: number
}

export interface RiskExplanation {
  factor: keyof RiskFactors
  description: string
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface RiskResult {
  score: number
  level: RiskLevel
  factors: RiskFactors
  explanations: string[]
  suggestedAction: string
}
