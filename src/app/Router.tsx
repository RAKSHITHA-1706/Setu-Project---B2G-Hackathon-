/**
 * Application Router.
 *
 * All route declarations live here.
 * Routes reference ROUTES constants — never hardcode paths.
 *
 * NOTE: react-router-dom will be installed in Phase 1B.
 *       This file is a scaffold. BrowserRouter + Routes are placeholders.
 */

import { ROUTES } from '@/config/routes'

export function Router() {
  // Phase 1B: replace this with BrowserRouter + Routes + Route components
  // import { BrowserRouter, Routes, Route } from 'react-router-dom'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: 'var(--color-sand-50)',
        color: 'var(--color-earth)',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-forest)' }}>
        Setu
      </h1>
      <p style={{ color: 'var(--color-earth-muted)', fontSize: '1.125rem' }}>
        Screening finds them. Setu keeps them.
      </p>
      <p style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem' }}>
        Phase 1A Foundation — Architecture complete.
      </p>
      <pre
        style={{
          background: 'var(--color-gray-100)',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-gray-600)',
          marginTop: '1rem',
        }}
      >
        Routes defined:{'\n'}
        {Object.entries(ROUTES)
          .map(([key, val]) => `  ${key}: ${typeof val === 'function' ? val() : val}`)
          .join('\n')}
      </pre>
    </div>
  )
}
