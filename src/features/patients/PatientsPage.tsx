import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../common/Layout'
import {
  Card, RiskBadge, PageHeader, LoadingSpinner, EmptyState, SearchInput,
} from '../common/Components'
import { patientService } from '../../services/patientService'
import { riskService } from '../../services/riskService'
import { followupService } from '../../services/followupService'
import type { Patient, RiskScore, FollowUpVisit } from '../../models'
import { formatDate } from '../../utils/ui'
import { ROUTES } from '@/config/routes'

type PatientRow = Patient & { latestRisk?: RiskScore; latestVisit?: FollowUpVisit }

export function PatientsPage() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<PatientRow[]>([])
  const [filtered, setFiltered] = useState<PatientRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [riskFilter, setRiskFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      const [pRes, rsRes, fvRes] = await Promise.all([
        patientService.getAll(),
        riskService.getAll(),
        followupService.getAll(),
      ])
      if (pRes.data) {
        const risks = rsRes.data ?? []
        const visits = fvRes.data ?? []
        const rows: PatientRow[] = pRes.data.map(p => ({
          ...p,
          latestRisk: risks.filter(r => r.patient_id === p.id).sort((a, b) => b.calculated_at.localeCompare(a.calculated_at))[0],
          latestVisit: visits.filter(v => v.patient_id === p.id).sort((a, b) => b.visit_date.localeCompare(a.visit_date))[0],
        }))
        setPatients(rows)
        setFiltered(rows)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let list = patients
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.full_name.toLowerCase().includes(q) || p.phone?.includes(q))
    }
    if (riskFilter !== 'all') {
      list = list.filter(p => p.latestRisk?.risk_level === riskFilter)
    }
    setFiltered(list)
  }, [search, riskFilter, patients])

  const filterBtn = (val: string, label: string) => (
    <button
      onClick={() => setRiskFilter(val)}
      style={{
        padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
        border: '1px solid var(--color-border)', cursor: 'pointer', fontFamily: 'inherit',
        background: riskFilter === val ? 'var(--color-forest)' : '#fff',
        color: riskFilter === val ? '#fff' : 'var(--color-earth)',
        transition: 'all 150ms',
      }}
    >
      {label}
    </button>
  )

  return (
    <AppLayout>
      <PageHeader title="Patients" sub={`${filtered.length} patient${filtered.length !== 1 ? 's' : ''} shown`} />

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or phone..." />
        <div style={{ display: 'flex', gap: 6 }}>
          {filterBtn('all', 'All')}
          {filterBtn('high', '🔴 High')}
          {filterBtn('medium', '🟡 Medium')}
          {filterBtn('low', '🟢 Low')}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon="👤" title="No patients found" sub="Try adjusting your search or filters" />
      ) : (
        <Card>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr',
            padding: '10px 20px', borderBottom: '2px solid var(--color-border)',
            fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Patient</span><span>Age / Gender</span><span>Last BP</span>
            <span>Last Visit</span><span>Next Visit</span><span>Risk</span>
          </div>

          {/* Table rows */}
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(ROUTES.PATIENT_DETAIL(p.id))}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr',
                padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer', alignItems: 'center', transition: 'background 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-earth)' }}>{p.full_name}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                  {p.phone ?? 'No phone'}
                </p>
              </div>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {p.age}y · {p.gender}
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-earth)', fontWeight: 500 }}>
                {p.latestVisit ? `${p.latestVisit.bp_systolic}/${p.latestVisit.bp_diastolic}` : '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                {formatDate(p.latestVisit?.visit_date)}
              </span>
              <span style={{ fontSize: 12, color: p.latestVisit?.expected_next_visit_date && new Date(p.latestVisit.expected_next_visit_date) < new Date() ? 'var(--color-risk-high)' : 'var(--color-text-muted)' }}>
                {formatDate(p.latestVisit?.expected_next_visit_date)}
              </span>
              <div>{p.latestRisk ? <RiskBadge level={p.latestRisk.risk_level} /> : <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>—</span>}</div>
            </div>
          ))}
        </Card>
      )}
    </AppLayout>
  )
}
