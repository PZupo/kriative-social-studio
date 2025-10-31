import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import KriativeHeader from './components/KriativeHeader'

// Renderiza o App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KriativeHeader appName="Social Studio" />
    <App />
  </React.StrictMode>
)
