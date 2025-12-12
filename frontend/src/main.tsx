import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SignUp from '../src/pages/SignUp'
import SignIn from '../src/pages/signIn'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <App/>
  </StrictMode>
  </BrowserRouter>
)
