import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import KriativeHeader from './components/KriativeHeader'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KriativeHeader />
    <div style={{ paddingTop: '80px' }}>
      <App />
    </div>
  </React.StrictMode>
)
