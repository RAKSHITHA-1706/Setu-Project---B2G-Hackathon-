import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../common/Layout'
import {
  Card, RiskBadge, PageHeader, LoadingSpinner, EmptyState, Button,
} from '../common/Components'
import { patientService } from '../../services/patientService'
import { riskService } from '../../services/riskService'
import { followupService } from '../../services/followupService'
import { screeningService } from '../../services/screeningService'
import { referralService } from '../../services/referralService'
import { villageService } from '../../services/villageService'
import type { Patient, RiskScore, FollowUpVisit, Screening, Referral, Village } from '../../models'
import { formatDate } from '../../utils/ui'
import { ROUTES } from '@/config/routes'

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [village, setVillage] = useState<Village | null>(null)
  const [riskScores, setRiskScores] = useState<RiskScore[]>([])
  const [visits, setVisits] = useState<FollowUpVisit[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      const [pRes, rsRes, fvRes, scRes, rfRes] = await Promise.all([
        patientService.getById(id!),
        riskService.getByPatientId(id!),
        followupService.getByPatientId(id!),
        screeningService.getByPatientId(id!),
        referralService.getByPatientId(id!),
      ])
      if (pRes.data) {
        setPatient(pRes.data)
        const vRes = await villageService.getById(pRes.data.village_id)
        if (vRes.data) setVillage(vRes.data)
      }
      setRiskScores(rsRes.data ?? [])
      setVisits(fvRes.data ?? [])
      setScreenings(scRes.data ?? [])
      setReferrals(rfRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  const latestRisk = riskScores[0]

  const adherentCount = visits.filter(v => v.medication_adherent).length
  const adherenceRate = visits.length > 0 ? Math.round((adherentCount / visits.length) * 100) : null

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>
  if (!patient) return <AppLayout><EmptyState icon="❌" title="Patient not found" /></AppLayout>

  return (
    <AppLayout>
      <PageHeader
        title={patient.full_name}
        sub={`Age ${patient.age} · ${patient.gender} · Registered ${formatDate(patient.registered_date)}`}
        action={
          <Button onClick={() => navigate(ROUTES.PATIENTS)} variant="secondary" size="sm">
            ← Back to Patients
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>

        {/* Profile */}
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-earth)' }}>👤 Patient Profile</h3>
          <InfoRow label="Full Name" value={patient.full_name} />
          <InfoRow label="Age" value={`${patient.age} years`} />
          <InfoRow label="Gender" value={patient.gender} />
          <InfoRow label="Phone" value={patient.phone ?? 'Not provided'} />
          <InfoRow label="Registered" value={formatDate(patient.registered_date)} />
        </Card>

        {/* Village */}
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-earth)' }}>🏘️ Village Information</h3>
          {village ? (
            <>
              <InfoRow label="Village" value={village.name} />
              <InfoRow label="District" value={village.district} />
              <InfoRow label="Distance to PHC" value={`${village.distance_from_phc_km} km`} />
            </>
          ) : <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Village data unavailable</p>}
        </Card>

        {/* Current Risk */}
        {latestRisk && (
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-earth)' }}>📊 Continuity Risk Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: '4px solid var(--color-risk-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
                borderColor: latestRisk.risk_level === 'high' || latestRisk.risk_level === 'critical'
                  ? 'var(--color-risk-high)' : latestRisk.risk_level === 'medium'
                  ? 'var(--color-risk-medium)' : 'var(--color-risk-low)',
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-earth)' }}>{latestRisk.score}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>/100</span>
              </div>
              <div>
                <RiskBadge level={latestRisk.risk_level} />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
                  Calculated {formatDate(latestRisk.calculated_at)}
                </p>
              </div>
            </div>
            {latestRisk.ai_reason && (
              <div style={{ background: 'var(--color-gray-50)', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                  "{latestRisk.ai_reason}"
                </p>
              </div>
            )}
            {latestRisk.suggested_action && (
              <div style={{ background: 'var(--color-forest-50)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--color-forest-100)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-forest)', marginBottom: 3 }}>SUGGESTED ACTION</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{latestRisk.suggested_action}</p>
              </div>
            )}
          </Card>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>

        {/* BP History */}
        <Card>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-earth)' }}>🩺 BP History</h3>
          </div>
          {visits.length === 0
            ? <EmptyState icon="📋" title="No visits recorded" />
            : visits.slice(0, 6).map(v => (
              <div key={v.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: v.bp_systolic && v.bp_systolic > 140 ? 'var(--color-risk-high)' : 'var(--color-earth)' }}>
                    {v.bp_systolic}/{v.bp_diastolic} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-muted)' }}>mmHg</span>
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{formatDate(v.visit_date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
                    background: v.medication_adherent ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                    color: v.medication_adherent ? 'var(--color-success)' : 'var(--color-error)',
                  }}>
                    {v.medication_adherent ? '✓ Adherent' : '✗ Non-adherent'}
                  </span>
                </div>
              </div>
            ))
          }
        </Card>

        {/* Medication Adherence */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-earth)', marginBottom: 16 }}>💊 Medication Adherence</h3>
          {adherenceRate !== null ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: adherenceRate >= 70 ? 'var(--color-success)' : adherenceRate >= 40 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                  {adherenceRate}%
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {adherentCount} of {visits.length} visits<br />medication taken
                </p>
              </div>
              <div style={{ height: 8, background: 'var(--color-gray-100)', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 9999, transition: 'width 0.6s ease',
                  width: `${adherenceRate}%`,
                  background: adherenceRate >= 70 ? 'var(--color-success)' : adherenceRate >= 40 ? 'var(--color-warning)' : 'var(--color-error)',
                }} />
              </div>
            </>
          ) : <EmptyState icon="💊" title="No adherence data" />}

          {/* Screenings */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-earth)', marginBottom: 12 }}>🔬 Screenings</h4>
            {screenings.length === 0
              ? <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No screenings on record</p>
              : screenings.slice(0, 3).map(s => (
                <div key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-earth)', textTransform: 'capitalize' }}>{s.disease_type}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatDate(s.screening_date)}</p>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999,
                    background: s.flagged_condition ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
                    color: s.flagged_condition ? 'var(--color-error)' : 'var(--color-success)',
                  }}>
                    {s.flagged_condition ? '⚠ Flagged' : '✓ Normal'}
                  </span>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      {/* Referrals */}
      <Card>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-earth)' }}>↗ Referrals</h3>
          <Button size="sm" onClick={() => navigate(ROUTES.REFERRALS)}>View All Referrals</Button>
        </div>
        {referrals.length === 0
          ? <EmptyState icon="📋" title="No referrals for this patient" />
          : referrals.map(r => (
            <div key={r.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-earth)' }}>{formatDate(r.created_date)}</p>
                {r.ai_summary && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{r.ai_summary}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600, textTransform: 'capitalize',
                  background: r.status === 'completed' ? 'var(--color-success-bg)' : r.status === 'pending' ? 'var(--color-warning-bg)' : 'var(--color-gray-100)',
                  color: r.status === 'completed' ? 'var(--color-success)' : r.status === 'pending' ? 'var(--color-warning)' : 'var(--color-gray-500)',
                }}>
                  {r.status}
                </span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 700, textTransform: 'uppercase',
                  background: r.urgency === 'emergency' ? 'var(--color-error-bg)' : r.urgency === 'urgent' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)',
                  color: r.urgency === 'emergency' ? 'var(--color-error)' : r.urgency === 'urgent' ? 'var(--color-warning)' : 'var(--color-info)',
                }}>
                  {r.urgency}
                </span>
              </div>
            </div>
          ))
        }
      </Card>
    </AppLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13 }}>
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--color-earth)', fontWeight: 600, textAlign: 'right', maxWidth: '55%', textTransform: 'capitalize' }}>{value}</span>
    </div>
  )
}
