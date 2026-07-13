import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/app/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('[Setu] Root element #root not found in DOM.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
