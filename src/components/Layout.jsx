import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children, setIsAuthenticated }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('admin_token')
      setIsAuthenticated(false)
    }
  }

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/guests', icon: Users, label: 'Guests' },
    { path: '/rsvps', icon: MessageSquare, label: 'RSVPs' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-white shadow-2xl transition-all duration-300 z-30 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Admin Wedding
                    </h1>
                    <p className="text-xs text-gray-500">Dashboard</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                      : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'} />
                  {sidebarOpen && (
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
            >
              <LogOut size={20} className="text-gray-500 group-hover:text-red-600" />
              {sidebarOpen && (
                <span className="font-medium group-hover:text-red-600">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

