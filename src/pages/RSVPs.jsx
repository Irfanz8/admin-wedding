import { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, MessageSquare, Filter } from 'lucide-react'
import api from '../config/api'

export default function RSVPs() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchRSVPs()
  }, [])

  const fetchRSVPs = async () => {
    try {
      setLoading(true)
      const data = await api.getRSVPs()
      const rsvpsData = data.data || data || []
      setRsvps(Array.isArray(rsvpsData) ? rsvpsData : [])
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
      setRsvps([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateRSVP(id, { status: newStatus })
      fetchRSVPs()
    } catch (error) {
      alert('Gagal mengupdate status: ' + error.message)
    }
  }

  const filteredRSVPs = rsvps.filter((rsvp) => {
    const matchesSearch = JSON.stringify(rsvp).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      rsvp.status === filterStatus || 
      (filterStatus === 'confirmed' && (rsvp.status === 'yes' || rsvp.status === 'confirmed')) ||
      (filterStatus === 'declined' && (rsvp.status === 'no' || rsvp.status === 'declined'))
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter((r) => r.status === 'confirmed' || r.status === 'yes').length,
    declined: rsvps.filter((r) => r.status === 'declined' || r.status === 'no').length,
    pending: rsvps.filter((r) => !r.status || (r.status !== 'confirmed' && r.status !== 'yes' && r.status !== 'declined' && r.status !== 'no')).length,
  }

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            RSVPs
          </h1>
          <p className="text-gray-500 mt-1">Kelola konfirmasi kehadiran tamu</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600 mb-1">Declined</p>
          <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari RSVP berdasarkan nama, email, atau pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-48 pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Pesan</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRSVPs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">Tidak ada data RSVP</p>
                      {(searchTerm || filterStatus !== 'all') && (
                        <p className="text-sm text-gray-400">Coba ubah filter atau kata kunci pencarian</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRSVPs.map((rsvp) => {
                  const status = rsvp.status || 'pending'
                  const isConfirmed = status === 'confirmed' || status === 'yes'
                  const isDeclined = status === 'declined' || status === 'no'
                  
                  return (
                    <tr 
                      key={rsvp.id || rsvp._id} 
                      className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${
                            isConfirmed ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                            isDeclined ? 'bg-gradient-to-br from-red-500 to-rose-500' :
                            'bg-gradient-to-br from-yellow-500 to-orange-500'
                          }`}>
                            {(rsvp.name || rsvp.nama || rsvp.guestName || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{rsvp.name || rsvp.nama || rsvp.guestName || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{rsvp.email || rsvp.guestEmail || '-'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            isConfirmed
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : isDeclined
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}
                        >
                          {isConfirmed ? '✓ Confirmed' : isDeclined ? '✗ Declined' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="text-gray-600 text-sm truncate" title={rsvp.message || rsvp.pesan || '-'}>
                            {rsvp.message || rsvp.pesan || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {!isConfirmed && (
                            <button
                              onClick={() => handleUpdateStatus(rsvp.id || rsvp._id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Mark as Confirmed"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {!isDeclined && (
                            <button
                              onClick={() => handleUpdateStatus(rsvp.id || rsvp._id, 'declined')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Mark as Declined"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
