import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '@/config/constants'

// ─── Date Formatters ──────────────────────────────────────────────────────────

/**
 * Format an ISO date string or Date object to display date.
 * @example formatDate('2024-03-15') → '15 Mar 2024'
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '—'
  return format(date, DATE_FORMAT)
}

/**
 * Format an ISO date string to display date + time.
 * @example formatDateTime('2024-03-15T14:30:00') → '15 Mar 2024, 14:30'
 */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '—'
  return format(date, DATETIME_FORMAT)
}

/**
 * Format a date as relative time from now.
 * @example formatRelativeTime('2024-03-10') → '5 days ago'
 */
export function formatRelativeTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '—'
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Format a date as time only.
 * @example formatTime('2024-03-15T14:30:00') → '14:30'
 */
export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '—'
  return format(date, TIME_FORMAT)
}

// ─── Number Formatters ────────────────────────────────────────────────────────

/**
 * Format a risk score for display.
 * @example formatRiskScore(82) → '82 / 100'
 */
export function formatRiskScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '— / 100'
  return `${Math.round(score)} / 100`
}

/**
 * Format a number as a percentage.
 * @example formatPercent(0.75) → '75%'
 */
export function formatPercent(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined) return '—'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format large numbers with locale-aware separators.
 * @example formatNumber(1234567) → '1,234,567'
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString('en-IN')
}

// ─── String Formatters ────────────────────────────────────────────────────────

/**
 * Generate initials from a full name.
 * @example getInitials('Anjali Mehta') → 'AM'
 */
export function getInitials(name: string | null | undefined, maxChars = 2): string {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .slice(0, maxChars)
    .join('')
}

/**
 * Truncate a string with an ellipsis.
 * @example truncate('Long text here', 10) → 'Long text…'
 */
export function truncate(text: string | null | undefined, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

/**
 * Capitalize the first letter of a string.
 * @example capitalize('hypertension') → 'Hypertension'
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert snake_case or kebab-case to Title Case.
 * @example toTitleCase('continuity_of_care') → 'Continuity Of Care'
 */
export function toTitleCase(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
