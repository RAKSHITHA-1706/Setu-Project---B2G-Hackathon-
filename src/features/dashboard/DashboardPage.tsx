import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../common/Layout'
import {
  DashboardCard, SectionCard, RiskBadge, StatusBadge, UrgencyBadge,
  SkeletonLoader, ErrorState, EmptyState, Button
} from '../common/Components'
import { dashboardService } from '../../services/dashboardService'
import { villageService } from '../../services/villageService'
import { patientService } from '../../services/patientService'
import { riskService } from '../../services/riskService'
import { followupService } from '../../services/followupService'
import { formatDate } from '../../utils/ui'
import { ROUTES } from '@/config/routes'

export function DashboardPage() {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [summary, setSummary] = useState<any>(null)
  const [highRisk, setHighRisk] = useState<any[]>([])
  const [mediumRisk, setMediumRisk] = useState<any[]>([])
  const [dueToday, setDueToday] = useState<any[]>([])
  const [overdue, setOverdue] = useState<any[]>([])
  const [referrals, setReferrals] = useState<any[]>([])

  const [riskStats, setRiskStats] = useState({ high: 0, medium: 0, low: 0, critical: 0, total: 0 })
  const [villageAgg, setVillageAgg] = useState<any[]>([])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [
        sumRes, hrRes, mrRes, dtRes, odRes, refRes, vRes, pRes, rsRes, fvRes
      ] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getHighRiskPatients(),
        dashboardService.getMediumRiskPatients(),
        dashboardService.getPatientsDueToday(),
        dashboardService.getOverduePatients(),
        dashboardService.getRecentReferrals(5),
        villageService.getAll(),
        patientService.getAll(),
        riskService.getAll(),
        followupService.getAll()
      ])

      if (hrRes.error) throw new Error(hrRes.error)

      setSummary(sumRes.data)
      
      // We need to attach village names to patients
      const villageMap = new Map((vRes.data || []).map(v => [v.id, v]))
      
      // High Risk
      const hrList = hrRes.data || []
      const allFollowups = fvRes.data || []
      const hrRich = hrList.map(r => {
        const vId = r.patients?.village_id
        const v = vId ? villageMap.get(vId) : null
        const lastVisit = allFollowups.filter(f => f.patient_id === r.patient_id).sort((a,b) => b.visit_date.localeCompare(a.visit_date))[0]
        return { ...r, villageName: v?.name, lastVisitDate: lastVisit?.visit_date }
      })
      setHighRisk(hrRich.slice(0, 5))

      setMediumRisk(mrRes.data || [])

      // Due Today
      const dtRich = (dtRes.data || []).map(f => {
         const vId = f.patients?.village_id
         const v = vId ? villageMap.get(vId) : null
         return { ...f, villageName: v?.name, distance: v?.distance_from_phc_km }
      })
      setDueToday(dtRich.slice(0, 5))

      setOverdue(odRes.data || [])
      setReferrals(refRes.data || [])


      // Calculate Risk Distribution
      const allRisks = rsRes.data || []
      const allPatients = pRes.data || []
      
      const rStats = { high: 0, medium: 0, low: 0, critical: 0, total: allRisks.length }
      allRisks.forEach(r => {
         if (r.risk_level in rStats) rStats[r.risk_level as keyof typeof rStats]++
      })
      setRiskStats(rStats)

      // Calculate Village Statistics
      const vAgg = (vRes.data || []).map(v => {
         const pats = allPatients.filter(p => p.village_id === v.id)
         const pIds = pats.map(p => p.id)
         const vRisks = allRisks.filter(r => pIds.includes(r.patient_id))
         const hrCount = vRisks.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length
         const avgRisk = vRisks.length > 0 ? Math.round(vRisks.reduce((acc, curr) => acc + curr.score, 0) / vRisks.length) : 0
         return {
            name: v.name,
            total: pats.length,
            highRisk: hrCount,
            avgRisk,
            distance: v.distance_from_phc_km
         }
      }).sort((a, b) => b.highRisk - a.highRisk)
      setVillageAgg(vAgg)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (error) {
    return (
      <AppLayout>
        <ErrorState message={error} onRetry={loadData} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* ── Summary Cards Grid ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {loading ? <SkeletonLoader rows={1} height={120} /> : (
          <DashboardCard 
            title="High Risk Patients" 
            count={highRisk.length + (summary?.highRiskPatients > 5 ? summary.highRiskPatients - 5 : 0)} 
            icon="🚨" 
            color="var(--color-risk-high)" 
            trendDir="up" 
            trendLabel="Needs intervention"
          />
        )}
        {loading ? <SkeletonLoader rows={1} height={120} /> : (
          <DashboardCard 
            title="Medium Risk Patients" 
            count={mediumRisk.length} 
            icon="⚠️" 
            color="var(--color-risk-medium)" 
            trendDir="neutral" 
            trendLabel="Monitor closely"
          />
        )}
        {loading ? <SkeletonLoader rows={1} height={120} /> : (
           <DashboardCard 
            title="Follow-ups Today" 
            count={dueToday.length} 
            icon="📅" 
            color="var(--color-info)" 
          />
        )}
        {loading ? <SkeletonLoader rows={1} height={120} /> : (
           <DashboardCard 
            title="Overdue Patients" 
            count={overdue.length} 
            icon="⏰" 
            color="var(--color-warning)" 
            trendDir="up"
            trendLabel="Follow-up missed"
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 32 }}>
        {/* ── High Risk Patients Table ────────────────────────────────────── */}
        <SectionCard 
          title="🔴 High Risk Patients" 
          sub="Patients requiring immediate clinical review"
          action={<Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PATIENTS)}>View All</Button>}
        >
          {loading ? <div style={{ padding: 20 }}><SkeletonLoader rows={4} height={40} /></div> : highRisk.length === 0 ? (
            <EmptyState icon="✅" title="No high risk patients" sub="All patients are currently stable." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-gray-50)' }}>
                    <th style={thStyle}>Patient</th>
                    <th style={thStyle}>Village</th>
                    <th style={thStyle}>Risk Score</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Last Visit</th>
                    <th style={thStyle}>Suggested Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highRisk.map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => navigate(ROUTES.PATIENT_DETAIL(r.patient_id))}
                      style={trStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--color-earth)' }}>{r.patients?.full_name}</td>
                      <td style={tdStyle}>{r.villageName || '—'}</td>
                      <td style={{ ...tdStyle, fontWeight: 800 }}>{r.score}</td>
                      <td style={tdStyle}><RiskBadge level={r.risk_level} /></td>
                      <td style={tdStyle}>{formatDate(r.lastVisitDate)}</td>
                      <td style={{ ...tdStyle, color: 'var(--color-risk-high)', fontSize: 12 }}>{r.suggested_action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* ── Follow-ups Today ────────────────────────────────────────────── */}
        <SectionCard title="📅 Follow-ups Today" sub="Patients scheduled for a visit today">
          {loading ? <div style={{ padding: 20 }}><SkeletonLoader rows={3} height={40} /></div> : dueToday.length === 0 ? (
            <EmptyState icon="☕" title="No visits scheduled" sub="No patients are expected today." />
          ) : (
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-gray-50)' }}>
                    <th style={thStyle}>Patient</th>
                    <th style={thStyle}>Village</th>
                    <th style={thStyle}>Expected Visit</th>
                    <th style={thStyle}>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {dueToday.map(v => (
                    <tr 
                      key={v.id} 
                      onClick={() => navigate(ROUTES.PATIENT_DETAIL(v.patient_id))}
                      style={trStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{v.patients?.full_name}</td>
                      <td style={tdStyle}>{v.villageName || '—'}</td>
                      <td style={tdStyle}>{formatDate(v.expected_next_visit_date)}</td>
                      <td style={tdStyle}>{v.distance ? `${v.distance} km` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          )}
        </SectionCard>

        {/* ── Recent Referrals ────────────────────────────────────────────── */}
        <SectionCard title="↗ Recent Referrals" sub="Patients referred to higher facilities" action={<Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.REFERRALS)}>View All</Button>}>
          {loading ? <div style={{ padding: 20 }}><SkeletonLoader rows={3} height={40} /></div> : referrals.length === 0 ? (
            <EmptyState icon="📋" title="No recent referrals" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-gray-50)' }}>
                    <th style={thStyle}>Patient</th>
                    <th style={thStyle}>Urgency</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => navigate(ROUTES.PATIENT_DETAIL(r.patient_id))}
                      style={trStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{r.patients?.full_name}</td>
                      <td style={tdStyle}><UrgencyBadge urgency={r.urgency} /></td>
                      <td style={tdStyle}><StatusBadge status={r.status} /></td>
                      <td style={{ ...tdStyle, fontSize: 12, color: 'var(--color-text-secondary)', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.ai_summary}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* ── Village Statistics ──────────────────────────────────────────── */}
        <SectionCard title="🏘️ Village Statistics" sub="Population overview by location">
          {loading ? <div style={{ padding: 20 }}><SkeletonLoader rows={4} height={40} /></div> : (
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-gray-50)' }}>
                    <th style={thStyle}>Village</th>
                    <th style={thStyle}>Total Patients</th>
                    <th style={thStyle}>High Risk</th>
                    <th style={thStyle}>Avg Risk Score</th>
                    <th style={thStyle}>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {villageAgg.slice(0, 6).map((v, i) => (
                    <tr key={i} style={trStyle}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{v.name}</td>
                      <td style={tdStyle}>{v.total}</td>
                      <td style={{ ...tdStyle, color: v.highRisk > 0 ? 'var(--color-risk-high)' : 'var(--color-text-muted)' }}>{v.highRisk}</td>
                      <td style={tdStyle}>{v.avgRisk}</td>
                      <td style={tdStyle}>{v.distance} km</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          )}
        </SectionCard>

        {/* ── Risk Distribution ───────────────────────────────────────────── */}
        <SectionCard title="📊 Risk Distribution" sub="Current district overview">
          {loading ? <div style={{ padding: 20 }}><SkeletonLoader rows={2} height={20} /></div> : (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: 2, height: 28, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ width: `${(riskStats.low/riskStats.total)*100}%`, background: 'var(--color-risk-low)' }} title="Low" />
                <div style={{ width: `${(riskStats.medium/riskStats.total)*100}%`, background: 'var(--color-risk-medium)' }} title="Medium" />
                <div style={{ width: `${(riskStats.high/riskStats.total)*100}%`, background: 'var(--color-risk-high)' }} title="High" />
                <div style={{ width: `${(riskStats.critical/riskStats.total)*100}%`, background: 'var(--color-risk-critical)' }} title="Critical" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <div style={{display:'flex', alignItems:'center', gap: 8}}><span style={{color: 'var(--color-risk-low)', fontSize: 18}}>●</span> Low Risk</div>
                    <span>{riskStats.low}</span>
                 </div>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <div style={{display:'flex', alignItems:'center', gap: 8}}><span style={{color: 'var(--color-risk-medium)', fontSize: 18}}>●</span> Medium Risk</div>
                    <span>{riskStats.medium}</span>
                 </div>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <div style={{display:'flex', alignItems:'center', gap: 8}}><span style={{color: 'var(--color-risk-high)', fontSize: 18}}>●</span> High Risk</div>
                    <span>{riskStats.high}</span>
                 </div>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <div style={{display:'flex', alignItems:'center', gap: 8}}><span style={{color: 'var(--color-risk-critical)', fontSize: 18}}>●</span> Critical</div>
                    <span>{riskStats.critical}</span>
                 </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

    </AppLayout>
  )
}

// Table styling constants
const thStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: 14,
  color: 'var(--color-text-secondary)',
  borderBottom: '1px solid var(--color-border)'
}

const trStyle: React.CSSProperties = {
  cursor: 'pointer',
  transition: 'background 150ms'
}
