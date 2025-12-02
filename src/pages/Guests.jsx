import { useState, useEffect } from 'react'
import { Search, Users, CalendarDays, MapPin, Mail } from 'lucide-react'
import api from '../config/api'

export default function Guests() {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      setLoading(true)
      const response = await api.getInvitations()
      const invitationsData = response.data?.invitations || response.invitations || response.data || []
      const paginationData = response.data?.pagination || response.pagination || null
      setInvitations(Array.isArray(invitationsData) ? invitationsData : [])
      setPagination(paginationData)
    } catch (error) {
      console.error('Error fetching invitations:', error)
      setInvitations([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvitations = invitations.filter((inv) => {
    const searchPayload = JSON.stringify({
      invitation_code: inv.invitation_code,
      groom_name: inv.groom_name,
      bride_name: inv.bride_name,
      location: inv.location,
      ceremony_date: inv.ceremony_date,
      ceremony_time: inv.ceremony_time,
      owner_name: inv.users?.name,
      owner_email: inv.users?.email,
    }).toLowerCase()

    return searchPayload.includes(searchTerm.toLowerCase())
  })

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
            Invitations
          </h1>
          <p className="text-gray-500 mt-1">Kelola daftar undangan per wedding event</p>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
          Total: <span className="font-semibold text-indigo-600">{invitations.length}</span> invitations
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
              placeholder="Cari undangan berdasarkan kode, nama pasangan, lokasi, atau owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Invitation</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Couple</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Schedule</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Location</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">Tidak ada data undangan</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-400">Coba cari dengan kata kunci lain</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((invitation) => (
                  <tr 
                    key={invitation.id} 
                    className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                          {(invitation.invitation_code || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{invitation.invitation_code}</p>
                          <p className="text-xs text-gray-400">Max guests: {invitation.max_guests}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">
                        <p className="font-semibold">
                          {invitation.bride_name || '-'} & {invitation.groom_name || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <CalendarDays size={16} className="text-gray-400" />
                        <div>
                          <p>{invitation.ceremony_date}</p>
                          <p className="text-xs text-gray-400">{invitation.ceremony_time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{invitation.location || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {(invitation.users?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {invitation.users?.name || '-'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail size={12} />
                            <span>{invitation.users?.email || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 text-sm text-gray-500 border-t border-gray-100">
          <p>
            Showing page <span className="font-semibold text-gray-700">{pagination.page}</span> of{' '}
            <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
          </p>
          <p>
            Total invitations:{' '}
            <span className="font-semibold text-gray-700">{pagination.total}</span>
          </p>
        </div>
      )}
    </div>
  )
}
