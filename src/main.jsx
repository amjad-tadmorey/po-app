import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { makeServer } from './api/mirageServer'

// Start Mirage server for both development and production
if (typeof window !== 'undefined') {
  makeServer({ environment: import.meta.env.DEV ? 'development' : 'production' })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
