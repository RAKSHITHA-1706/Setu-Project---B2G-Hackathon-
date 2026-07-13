import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../common/Layout'
import {
  Card, StatusBadge, UrgencyBadge, PageHeader, LoadingSpinner, EmptyState, SearchInput,
} from '../common/Components'
import { referralService } from '../../services/referralService'
import { patientService } from '../../services/patientService'
import type { Referral, Patient } from '../../models'
import { formatDate } from '../../utils/ui'
import { ROUTES } from '@/config/routes'

type ReferralRow = Referral & { patient?: Patient }

export function ReferralsPage() {
  const navigate = useNavigate()
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [filtered, setFiltered] = useState<ReferralRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      const [rRes, pRes] = await Promise.all([
        referralService.getAll(),
        patientService.getAll()
      ])
      if (rRes.data) {
        const pats = pRes.data ?? []
        const rows = rRes.data.map(r => ({
          ...r,
          patient: pats.find(p => p.id === r.patient_id)
        }))
        setReferrals(rows)
        setFiltered(rows)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let list = referrals
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r => r.patient?.full_name.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') {
      list = list.filter(r => r.status === statusFilter)
    }
    setFiltered(list)
  }, [search, statusFilter, referrals])

  const filterBtn = (val: string, label: string) => (
    <button
      onClick={() => setStatusFilter(val)}
      style={{
        padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
        border: '1px solid var(--color-border)', cursor: 'pointer', fontFamily: 'inherit',
        background: statusFilter === val ? 'var(--color-forest)' : '#fff',
        color: statusFilter === val ? '#fff' : 'var(--color-earth)',
        transition: 'all 150ms',
      }}
    >
      {label}
    </button>
  )

  return (
    <AppLayout>
      <PageHeader title="Referrals" sub={`${filtered.length} referral${filtered.length !== 1 ? 's' : ''} shown`} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by patient name..." />
        <div style={{ display: 'flex', gap: 6 }}>
          {filterBtn('all', 'All')}
          {filterBtn('pending', 'Pending')}
          {filterBtn('completed', 'Completed')}
          {filterBtn('cancelled', 'Cancelled')}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon="📋" title="No referrals found" sub="Adjust search or filters" />
      ) : (
        <Card>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr',
            padding: '10px 20px', borderBottom: '2px solid var(--color-border)',
            fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Patient</span><span>Date</span><span>Status</span><span>Urgency</span><span>AI Summary</span>
          </div>

          {filtered.map(r => (
            <div
              key={r.id}
              onClick={() => navigate(ROUTES.PATIENT_DETAIL(r.patient_id))}
              style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr',
                padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer', alignItems: 'center', transition: 'background 150ms', gap: 10
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-earth)' }}>
                {r.patient?.full_name ?? 'Unknown'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                {formatDate(r.created_date)}
              </div>
              <div><StatusBadge status={r.status} /></div>
              <div><UrgencyBadge urgency={r.urgency} /></div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {r.ai_summary ?? '—'}
              </div>
            </div>
          ))}
        </Card>
      )}
    </AppLayout>
  )
}
