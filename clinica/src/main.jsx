import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import react router

import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'


import './index.css'
import Login from './pages/Login/Login'
// import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
