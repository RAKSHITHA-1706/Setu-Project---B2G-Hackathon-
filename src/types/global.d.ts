/**
 * Global shared types used across the entire application.
 *
 * Only truly universal types go here.
 * Feature-specific types live in their feature's types/ folder.
 */

// ─── ID Types ─────────────────────────────────────────────────────────────────

/** UUID string. Branded type for type safety. */
export type UUID = string & { readonly __brand: 'UUID' }

/** ISO 8601 date-time string. Branded for clarity. */
export type ISODateTime = string & { readonly __brand: 'ISODateTime' }

// ─── API / Service Patterns ───────────────────────────────────────────────────

/**
 * Result monad for service-layer returns.
 * Forces explicit error handling at the call site.
 */
export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: string }

/**
 * Standard pagination params for list queries.
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * Standard paginated response shape.
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

// ─── UI Patterns ──────────────────────────────────────────────────────────────

/** Standard async state for hooks */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  isError: boolean
  error: string | null
}

/** Select option (used by Select, Combobox components) */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc'

/** Sort state for tables */
export interface SortState {
  key: string
  direction: SortDirection
}
