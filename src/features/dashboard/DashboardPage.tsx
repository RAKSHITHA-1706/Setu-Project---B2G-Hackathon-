import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../common/Layout'
import {
  StatCard, Card, RiskBadge, UrgencyBadge,
  SectionHeader, PageHeader, LoadingSpinner, EmptyState,
} from '../common/Components'
import { dashboardService } from '../../services/dashboardService'
import { formatDate, daysAgo } from '../../utils/ui'
import { ROUTES } from '@/config/routes'

export function DashboardPage() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<{ totalPatients: number; highRiskPatients: number; pendingReferrals: number } | null>(null)
  const [highRisk, setHighRisk] = useState<any[]>([])
  const [overdue, setOverdue] = useState<any[]>([])
  const [recentReferrals, setRecentReferrals] = useState<any[]>([])
  const [villageStats, setVillageStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, hr, od, rr, vs] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getHighRiskPatients(),
        dashboardService.getOverduePatients(),
        dashboardService.getRecentReferrals(6),
        dashboardService.getVillageStatistics(),
      ])
      if (s.data) setSummary(s.data)
      if (hr.data) setHighRisk(hr.data.slice(0, 5))
      if (od.data) setOverdue(od.data.slice(0, 5))
      if (rr.data) setRecentReferrals(rr.data)
      if (vs.data) setVillageStats(vs.data.slice(0, 6))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        sub={`Mysuru District PHC · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {loading ? <LoadingSpinner /> : (
        <>
          {/* ── Summary Cards ─────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard label="Total Patients" value={summary?.totalPatients ?? 0} icon="👥" color="var(--color-forest)" />
            <StatCard label="High Risk" value={summary?.highRiskPatients ?? 0} icon="🔴" color="var(--color-risk-high)" sub="Need urgent attention" />
            <StatCard label="Overdue Visits" value={overdue.length} icon="⏰" color="var(--color-warning)" sub="Follow-up required" />
            <StatCard label="Pending Referrals" value={summary?.pendingReferrals ?? 0} icon="↗" color="var(--color-info)" sub="Awaiting completion" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>

            {/* ── High Risk Patients ──────────────────────── */}
            <Card>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
                <SectionHeader title="⚠️ High Risk Patients" sub="Immediate intervention needed" />
              </div>
              {highRisk.length === 0
                ? <EmptyState icon="✅" title="No high-risk patients" />
                : highRisk.map((rs: any) => (
                  <div
                    key={rs.id}
                    onClick={() => navigate(ROUTES.PATIENT_DETAIL(rs.patient_id))}
                    style={{
                      padding: '12px 20px', borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer', transition: 'background 150ms',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-earth)' }}>
                        {rs.patients?.full_name ?? 'Unknown'}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                        Score: {rs.score}/100 · {rs.suggested_action ?? '—'}
                      </p>
                    </div>
                    <RiskBadge level={rs.risk_level} />
                  </div>
                ))
              }
            </Card>

            {/* ── Overdue Follow-ups ──────────────────────── */}
            <Card>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
                <SectionHeader title="⏰ Overdue Follow-ups" sub="Expected visits that were missed" />
              </div>
              {overdue.length === 0
                ? <EmptyState icon="✅" title="No overdue patients" />
                : overdue.map((fv: any) => (
                  <div
                    key={fv.id}
                    onClick={() => navigate(ROUTES.PATIENT_DETAIL(fv.patient_id))}
                    style={{
                      padding: '12px 20px', borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-earth)' }}>
                        {fv.patients?.full_name ?? 'Unknown'}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-risk-high)', marginTop: 1 }}>
                        Due: {formatDate(fv.expected_next_visit_date)}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {daysAgo(fv.expected_next_visit_date)} late
                    </span>
                  </div>
                ))
              }
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

            {/* ── Recent Referrals ────────────────────────── */}
            <Card>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
                <SectionHeader title="↗ Recent Referrals" />
              </div>
              {recentReferrals.length === 0
                ? <EmptyState icon="📋" title="No referrals yet" />
                : recentReferrals.map((r: any) => (
                  <div key={r.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-earth)' }}>
                        {r.patients?.full_name ?? 'Unknown'}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                        {formatDate(r.created_date)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <UrgencyBadge urgency={r.urgency} />
                    </div>
                  </div>
                ))
              }
            </Card>

            {/* ── Village Statistics ──────────────────────── */}
            <Card style={{ padding: '18px 20px' }}>
              <SectionHeader title="🏘️ Village Coverage" sub="Patients registered per village" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {villageStats.map((v: any) => (
                  <div key={v.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                      <span style={{ fontWeight: 500, color: 'var(--color-earth)' }}>{v.name}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{v.patientCount}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--color-gray-100)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 9999,
                        background: 'var(--color-forest)',
                        width: `${Math.min((v.patientCount / 30) * 100, 100)}%`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  )
}
