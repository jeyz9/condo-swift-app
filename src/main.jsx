import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from "react-router";
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter basename="/condo-swift">
  <AuthProvider>
    <App/>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)