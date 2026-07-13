import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '⊞' },
  { to: ROUTES.PATIENTS, label: 'Patients', icon: '👤' },
  { to: ROUTES.REFERRALS, label: 'Referrals', icon: '↗' },
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: '📊' },
]

const sidebarStyle: React.CSSProperties = {
  width: 240,
  minHeight: '100vh',
  background: 'var(--color-forest-dark)',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  position: 'sticky',
  top: 0,
  height: '100vh',
  overflowY: 'auto',
}

const logoBlockStyle: React.CSSProperties = {
  padding: '28px 20px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
}

const logoTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#fff',
  letterSpacing: '-0.5px',
}

const logoTaglineStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.5)',
  marginTop: 3,
  lineHeight: 1.3,
}

const navStyle: React.CSSProperties = {
  padding: '12px 10px',
  flex: 1,
}

function navLinkStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    marginBottom: 2,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
    transition: 'all 150ms ease',
  }
}

const footerStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  fontSize: 11,
  color: 'rgba(255,255,255,0.35)',
}

export function Sidebar() {
  return (
    <aside style={sidebarStyle}>
      <div style={logoBlockStyle}>
        <div style={logoTitleStyle}>🌿 Setu</div>
        <div style={logoTaglineStyle}>Screening finds them.<br />Setu keeps them.</div>
      </div>
      <nav style={navStyle}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => navLinkStyle(isActive)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={footerStyle}>
        Mysuru District · PHC Portal<br />v0.1.0 MVP
      </div>
    </aside>
  )
}

// ── Mobile bottom nav ──────────────────────────────────────────────────────────

const bottomNavStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  zIndex: 200,
  boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
}

function bottomNavItemStyle(isActive: boolean): React.CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '8px 4px',
    textDecoration: 'none',
    fontSize: 10,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--color-forest)' : 'var(--color-gray-400)',
    borderTop: isActive ? '2px solid var(--color-forest)' : '2px solid transparent',
    transition: 'all 150ms ease',
  }
}

export function BottomNav() {
  return (
    <nav style={bottomNavStyle}>
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => bottomNavItemStyle(isActive)}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

// ── Mobile header ──────────────────────────────────────────────────────────────

export function MobileHeader({ title }: { title?: string }) {
  const loc = useLocation()
  const pageTitle = title ?? NAV_ITEMS.find(i => loc.pathname.startsWith(i.to))?.label ?? 'Setu'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 150,
      background: 'var(--color-forest-dark)',
      color: '#fff',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ fontSize: 20 }}>🌿</span>
      <span style={{ fontWeight: 700, fontSize: 16 }}>{pageTitle}</span>
    </header>
  )
}

// ── Responsive Layout wrapper ──────────────────────────────────────────────────

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile] = useState(() => window.innerWidth < 768)

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)', paddingBottom: 64 }}>
        <MobileHeader />
        <main style={{ padding: '16px' }}>{children}</main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-app)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>{children}</main>
    </div>
  )
}
