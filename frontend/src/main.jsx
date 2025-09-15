import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from './utils/serviceWorker.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

// Register service worker
if (import.meta.env.PROD) {
  registerSW({
    onSuccess: (registration) => {
      console.log('[SW] Service worker registered successfully');
    },
    onUpdate: (registration) => {
      console.log('[SW] New version available');
    },
  });
}
