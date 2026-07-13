import type { RiskLevel } from '../models'

/** Returns Tailwind-compatible inline styles for risk badge */
export function getRiskColors(level: RiskLevel | string) {
  switch (level?.toLowerCase()) {
    case 'high':
    case 'critical':
      return { bg: 'var(--color-risk-high-bg)', color: 'var(--color-risk-high)', border: 'var(--color-risk-high-border)' }
    case 'medium':
      return { bg: 'var(--color-risk-medium-bg)', color: 'var(--color-risk-medium)', border: 'var(--color-risk-medium-border)' }
    default:
      return { bg: 'var(--color-risk-low-bg)', color: 'var(--color-risk-low)', border: 'var(--color-risk-low-border)' }
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1 day ago'
  return `${diff} days ago`
}
