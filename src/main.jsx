import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: false,
  offset: 50,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
