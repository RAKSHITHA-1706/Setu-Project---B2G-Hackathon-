import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { PatientsPage } from '../features/patients/PatientsPage'
import { PatientDetailPage } from '../features/patients/PatientDetailPage'
import { ReferralsPage } from '../features/referrals/ReferralsPage'
import { AnalyticsPage } from '../features/analytics/AnalyticsPage'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.PATIENTS} element={<PatientsPage />} />
        <Route path={ROUTES.PATIENT_DETAIL()} element={<PatientDetailPage />} />
        <Route path={ROUTES.REFERRALS} element={<ReferralsPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        
        {/* Fallbacks */}
        <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
