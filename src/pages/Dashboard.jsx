import { useState, useEffect } from 'react'
import { Users, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import api from '../config/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRSVPs: 0,
    confirmed: 0,
    declined: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Try to get stats from API
      try {
        const statsData = await api.getStats()
        setStats(statsData)
      } catch (err) {
        // Fallback: calculate from guests and RSVPs
        const [guests, rsvps] = await Promise.all([
          api.getGuests().catch(() => ({ data: [] })),
          api.getRSVPs().catch(() => ({ data: [] })),
        ])

        const guestsData = guests.data || guests || []
        const rsvpsData = rsvps.data || rsvps || []

        setStats({
          totalGuests: guestsData.length,
          totalRSVPs: rsvpsData.length,
          confirmed: rsvpsData.filter((r) => r.status === 'confirmed' || r.status === 'yes').length,
          declined: rsvpsData.filter((r) => r.status === 'declined' || r.status === 'no').length,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Guests',
      value: stats.totalGuests,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total RSVPs',
      value: stats.totalRSVPs,
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Declined',
      value: stats.declined,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50',
      textColor: 'text-red-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Overview statistik wedding Anda</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${card.textColor} mb-1`}>{card.title}</p>
                  <p className="text-4xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
              
              {/* Decorative element */}
              <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-5 rounded-tl-full`}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

