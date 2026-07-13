/**
 * App Root Component.
 *
 * Responsibilities:
 * - Compose all providers (QueryClient, Router, Auth, Theme)
 * - Mount the Router
 *
 * Keep this file minimal. All logic lives in features.
 */

import { Router } from './Router'

function App() {
  return <Router />
}

export default App
