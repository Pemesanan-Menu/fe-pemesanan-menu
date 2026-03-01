import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './app/router'
import { ThemeProvider } from './hooks/ThemeProvider'
import { Toaster } from './components/ui/sonner'
import './styles/index.css'

// Auto-reload on chunk load error (after deployment)
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </React.StrictMode>
)
