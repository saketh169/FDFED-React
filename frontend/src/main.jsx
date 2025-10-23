import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD

// import index.css here and can use globally
import '/index.css'
import App from './App.jsx'
import Layout from './Layout.jsx';
=======
// import './index.css'
import App from './App.jsx'

>>>>>>> origin/main

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
 
  </StrictMode>,
)
