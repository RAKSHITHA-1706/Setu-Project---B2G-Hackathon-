import { useState, useEffect } from 'react'
import { AppLayout } from '../common/Layout'
import {
  Card, SectionHeader, PageHeader, LoadingSpinner, StatCard
} from '../common/Components'
import { dashboardService } from '../../services/dashboardService'
import { riskService } from '../../services/riskService'
import { referralService } from '../../services/referralService'

export function AnalyticsPage() {
  const [villageStats, setVillageStats] = useState<any[]>([])
  const [riskStats, setRiskStats] = useState({ low: 0, medium: 0, high: 0, critical: 0 })
  const [refStats, setRefStats] = useState({ pending: 0, completed: 0, cancelled: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [vsRes, rsRes, rfRes] = await Promise.all([
        dashboardService.getVillageStatistics(),
        riskService.getAll(),
        referralService.getAll()
      ])
      if (vsRes.data) setVillageStats(vsRes.data)
      if (rsRes.data) {
        const rStats = { low: 0, medium: 0, high: 0, critical: 0 }
        rsRes.data.forEach(r => {
           if(r.risk_level in rStats) rStats[r.risk_level as keyof typeof rStats]++
        })
        setRiskStats(rStats)
      }
      if (rfRes.data) {
         const reStats = { pending: 0, completed: 0, cancelled: 0, total: rfRes.data.length }
         rfRes.data.forEach(r => {
            if(r.status in reStats) reStats[r.status as keyof typeof reStats]++
         })
         setRefStats(reStats)
      }
      setLoading(false)
    }
    load()
  }, [])

  const totalRisks = riskStats.low + riskStats.medium + riskStats.high + riskStats.critical
  
  return (
    <AppLayout>
      <PageHeader title="Analytics & Reports" sub="Key metrics and distribution across Mysuru District" />

      {loading ? <LoadingSpinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard label="Referrals Completion" value={refStats.total > 0 ? Math.round(refStats.completed/refStats.total * 100) + '%' : '0%'} icon="📈" color="var(--color-success)" />
             <StatCard label="High Risk %" value={totalRisks > 0 ? Math.round((riskStats.high+riskStats.critical)/totalRisks * 100) + '%' : '0%'} icon="⚠️" color="var(--color-risk-high)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {/* Risk Distribution */}
            <Card style={{ padding: '20px 24px' }}>
              <SectionHeader title="Risk Distribution" sub="Current active patients by risk tier" />
              <div style={{ display: 'flex', gap: 2, height: 24, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${(riskStats.low/totalRisks)*100}%`, background: 'var(--color-risk-low)' }} title="Low" />
                <div style={{ width: `${(riskStats.medium/totalRisks)*100}%`, background: 'var(--color-risk-medium)' }} title="Medium" />
                <div style={{ width: `${(riskStats.high/totalRisks)*100}%`, background: 'var(--color-risk-high)' }} title="High" />
                <div style={{ width: `${(riskStats.critical/totalRisks)*100}%`, background: 'var(--color-risk-critical)' }} title="Critical" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                 <div style={{fontSize: 13, color: 'var(--color-earth)'}}><span style={{color: 'var(--color-risk-low)', fontWeight: 800}}>●</span> Low: {riskStats.low}</div>
                 <div style={{fontSize: 13, color: 'var(--color-earth)'}}><span style={{color: 'var(--color-risk-medium)', fontWeight: 800}}>●</span> Medium: {riskStats.medium}</div>
                 <div style={{fontSize: 13, color: 'var(--color-earth)'}}><span style={{color: 'var(--color-risk-high)', fontWeight: 800}}>●</span> High: {riskStats.high}</div>
                 <div style={{fontSize: 13, color: 'var(--color-earth)'}}><span style={{color: 'var(--color-risk-critical)', fontWeight: 800}}>●</span> Critical: {riskStats.critical}</div>
              </div>
            </Card>

            {/* Referrals Breakdown */}
            <Card style={{ padding: '20px 24px' }}>
              <SectionHeader title="Referrals Status" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <span style={{color: 'var(--color-warning)'}}>Pending</span>
                    <span>{refStats.pending}</span>
                 </div>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <span style={{color: 'var(--color-success)'}}>Completed</span>
                    <span>{refStats.completed}</span>
                 </div>
                 <div style={{display:'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600}}>
                    <span style={{color: 'var(--color-gray-500)'}}>Cancelled/No Show</span>
                    <span>{refStats.cancelled}</span>
                 </div>
              </div>
            </Card>
          </div>
          
          <Card style={{ padding: '20px 24px', marginTop: 24 }}>
             <SectionHeader title="Village Population" sub="Patients registered per village" />
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                 {villageStats.map((v: any) => (
                    <div key={v.id} style={{ padding: 12, background: 'var(--color-gray-50)', borderRadius: 8 }}>
                       <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-earth)' }}>{v.name}</div>
                       <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{v.patientCount} patients</div>
                    </div>
                 ))}
             </div>
          </Card>
        </>
      )}
    </AppLayout>
  )
}
