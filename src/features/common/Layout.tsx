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
  boxShadow: 'var(--shadow-lg)',
  zIndex: 100,
}

const logoBlockStyle: React.CSSProperties = {
  padding: '28px 20px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
}

const logoTitleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: '#fff',
  letterSpacing: '-0.5px',
}

const logoTaglineStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.5)',
  marginTop: 4,
  lineHeight: 1.4,
}

const navStyle: React.CSSProperties = {
  padding: '16px 12px',
  flex: 1,
}

function navLinkStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 8,
    marginBottom: 4,
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
    transition: 'all 150ms ease',
  }
}

const footerStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  fontSize: 12,
  color: 'rgba(255,255,255,0.4)',
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
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {/* Settings is a dummy link for now */}
        <NavLink
            to="/settings"
            style={({ isActive }) => navLinkStyle(isActive)}
          >
            <span style={{ fontSize: 18 }}>⚙️</span>
            Settings
          </NavLink>
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
  boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
}

function bottomNavItemStyle(isActive: boolean): React.CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: '10px 4px',
    textDecoration: 'none',
    fontSize: 11,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'var(--color-forest)' : 'var(--color-gray-500)',
    borderTop: isActive ? '3px solid var(--color-forest)' : '3px solid transparent',
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
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

// ── Mobile header (Hamburger) ──────────────────────────────────────────────────

export function MobileHeader() {
  const loc = useLocation()
  const pageTitle = NAV_ITEMS.find(i => loc.pathname.startsWith(i.to))?.label ?? 'Setu'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 150,
      background: 'var(--color-forest-dark)',
      color: '#fff',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>
          ☰
        </button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>{pageTitle}</span>
      </div>
      <div style={{ fontSize: 20 }}>🔔</div>
    </header>
  )
}

// ── Desktop Top Header ─────────────────────────────────────────────────────────

export function TopHeader() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [search, setSearch] = useState('')

  return (
    <header style={{
      background: '#fff',
      padding: '16px 32px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90,
    }}>
      <div style={{ position: 'relative', width: 360 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--color-text-muted)' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Global Patient Search (Name, Village, Phone)..."
          style={{
            width: '100%', padding: '10px 16px 10px 42px',
            border: '1px solid var(--color-gray-300)', borderRadius: 9999,
            fontSize: 14, outline: 'none', background: 'var(--color-gray-50)',
            color: 'var(--color-text-primary)', fontFamily: 'inherit',
            transition: 'border-color 150ms, box-shadow 150ms',
          }}
          onFocus={e => {
             e.target.style.borderColor = 'var(--color-forest)'
             e.target.style.background = '#fff'
             e.target.style.boxShadow = '0 0 0 3px var(--color-forest-50)'
          }}
          onBlur={e => {
             e.target.style.borderColor = 'var(--color-gray-300)'
             e.target.style.background = 'var(--color-gray-50)'
             e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {today}
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--color-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-earth)' }}>Dr. Aditi Sharma</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>PHC Medical Officer</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-forest-100)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
            AS
          </div>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20, position: 'relative', marginLeft: 8 }}>
            🔔
            <span style={{ position: 'absolute', top: 0, right: -2, width: 8, height: 8, background: 'var(--color-error)', borderRadius: '50%', border: '2px solid #fff' }} />
          </button>
        </div>
      </div>
    </header>
  )
}

// ── Responsive Layout wrapper ──────────────────────────────────────────────────

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile] = useState(() => window.innerWidth < 1024)

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopHeader />
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
