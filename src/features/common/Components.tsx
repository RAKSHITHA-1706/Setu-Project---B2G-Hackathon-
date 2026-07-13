import type { RiskLevel } from '../../models'
import { getRiskColors } from '../../utils/ui'

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────

export function StatCard({
  label, value, icon, color, sub,
}: {
  label: string; value: string | number; icon: string; color?: string; sub?: string
}) {
  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: color ?? 'var(--color-earth)', marginTop: 4 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</p>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: color ? `${color}18` : 'var(--color-forest-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

// ── Risk Badge ───────────────────────────────────────────────────────────────

export function RiskBadge({ level }: { level: RiskLevel | string }) {
  const colors = getRiskColors(level)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 9999, fontSize: 11,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: colors.color, display: 'inline-block',
      }} />
      {level}
    </span>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending:   { bg: 'var(--color-warning-bg)',   color: 'var(--color-warning)' },
    completed: { bg: 'var(--color-success-bg)',   color: 'var(--color-success)' },
    cancelled: { bg: 'var(--color-gray-100)',      color: 'var(--color-gray-500)' },
    no_show:   { bg: 'var(--color-error-bg)',     color: 'var(--color-error)' },
  }
  const s = map[status] ?? map.pending
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 9999, fontSize: 11,
      fontWeight: 600, textTransform: 'capitalize',
      background: s.bg, color: s.color,
    }}>
      {status.replace('_', ' ')}
    </span>
  )
}

// ── Urgency Badge ─────────────────────────────────────────────────────────────

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    routine:   { bg: 'var(--color-info-bg)',      color: 'var(--color-info)' },
    urgent:    { bg: 'var(--color-warning-bg)',   color: 'var(--color-warning)' },
    emergency: { bg: 'var(--color-error-bg)',     color: 'var(--color-error)' },
  }
  const s = map[urgency] ?? map.routine
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 9999, fontSize: 11,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      background: s.bg, color: s.color,
    }}>
      {urgency}
    </span>
  )
}

// ── Section Header ───────────────────────────────────────────────────────────

export function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-earth)' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</p>}
    </div>
  )
}

// ── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-earth)' }}>{title}</h1>
        {sub && <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Loading State ────────────────────────────────────────────────────────────

export function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 10, color: 'var(--color-text-muted)', fontSize: 14 }}>
      <div style={{
        width: 20, height: 20, border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-forest)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      Loading...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-earth)' }}>{title}</p>
      {sub && <p style={{ fontSize: 13, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

// ── Button ───────────────────────────────────────────────────────────────────

export function Button({
  children, onClick, variant = 'primary', size = 'md', style: extraStyle, disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
  disabled?: boolean
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontWeight: 600, borderRadius: 8,
    transition: 'all 150ms ease', opacity: disabled ? 0.5 : 1,
  }
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '12px 24px', fontSize: 15 },
  }
  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: 'var(--color-forest)', color: '#fff' },
    secondary: { background: 'var(--color-gray-100)', color: 'var(--color-earth)' },
    danger:    { background: 'var(--color-error-bg)', color: 'var(--color-error)' },
    ghost:     { background: 'transparent', color: 'var(--color-forest)' },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
    >
      {children}
    </button>
  )
}

// ── Search Input ─────────────────────────────────────────────────────────────

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative', maxWidth: 360 }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--color-text-muted)' }}>🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        style={{
          width: '100%', padding: '9px 14px 9px 36px',
          border: '1px solid var(--color-border)', borderRadius: 8,
          fontSize: 14, outline: 'none', background: '#fff',
          color: 'var(--color-text-primary)', fontFamily: 'inherit',
        }}
      />
    </div>
  )
}
