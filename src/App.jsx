import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Guests from './pages/Guests'
import RSVPs from './pages/RSVPs'
import { useState, useEffect } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/guests"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Guests />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/rsvps"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <RSVPs />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

