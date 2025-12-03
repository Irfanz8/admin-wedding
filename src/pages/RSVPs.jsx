import { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, MessageSquare, Filter, QrCode, Phone, Mail, X } from 'lucide-react'
import api from '../config/api'

export default function RSVPs() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState(null)
  const [selectedQRCode, setSelectedQRCode] = useState(null)

  useEffect(() => {
    fetchRSVPs()
  }, [])

  const fetchRSVPs = async () => {
    try {
      setLoading(true)
      const response = await api.getRSVPs()
      const confirmations = response.data?.confirmations || response.confirmations || response.data || []
      const paginationData = response.data?.pagination || response.pagination || null
      setRsvps(Array.isArray(confirmations) ? confirmations : [])
      setPagination(paginationData)
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
      setRsvps([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, isConfirmed) => {
    try {
      await api.updateRSVP(id, { confirmed: isConfirmed })
      fetchRSVPs()
    } catch (error) {
      alert('Gagal mengupdate status: ' + error.message)
    }
  }

  const getStatusInfo = (rsvp) => {
    if (rsvp.confirmed === true) {
      return {
        label: 'Confirmed',
        badge: 'bg-green-100 text-green-800 border border-green-200',
        chip: 'bg-gradient-to-br from-green-500 to-emerald-500',
      }
    }

    if (rsvp.confirmed === false) {
      return {
        label: 'Declined',
        badge: 'bg-red-100 text-red-800 border border-red-200',
        chip: 'bg-gradient-to-br from-red-500 to-rose-500',
      }
    }

    return {
      label: 'Pending',
      badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      chip: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    }
  }

  const filteredRSVPs = rsvps.filter((rsvp) => {
    const searchPayload = JSON.stringify({
      guest_name: rsvp.guest_name,
      guest_email: rsvp.guest_email,
      phone: rsvp.phone,
      confirmation_code: rsvp.confirmation_code,
      invitation_code: rsvp.invitations?.invitation_code,
      dietary_restrictions: rsvp.dietary_restrictions,
    })
      .toLowerCase()

    const matchesSearch = searchPayload.includes(searchTerm.toLowerCase())

    const status = rsvp.confirmed === true
      ? 'confirmed'
      : rsvp.confirmed === false
      ? 'declined'
      : 'pending'

    const matchesFilter =
      filterStatus === 'all' ||
      filterStatus === status

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter((r) => r.confirmed === true).length,
    declined: rsvps.filter((r) => r.confirmed === false).length,
    pending: rsvps.filter((r) => r.confirmed === null || typeof r.confirmed === 'undefined').length,
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
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Guest</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Invitation</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Preferences</th>
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
                  const statusInfo = getStatusInfo(rsvp)
                  
                  return (
                    <tr 
                      key={rsvp.id || rsvp._id} 
                      className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${statusInfo.chip}`}>
                              {(rsvp.guest_name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{rsvp.guest_name || '-'}</p>
                              <p className="text-xs text-gray-400">Code: {rsvp.confirmation_code || '-'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span>{rsvp.guest_email || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>{rsvp.phone || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-gray-800">{rsvp.invitations?.invitation_code || '-'}</p>
                          <p className="text-gray-500 text-xs">
                            {rsvp.invitations?.bride_name || '-'} & {rsvp.invitations?.groom_name || '-'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Owner: {rsvp.invitations?.users?.name || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold gap-1 ${statusInfo.badge}`}
                        >
                          {statusInfo.label}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {rsvp.is_checked_in ? (
                            <span className="text-green-600">Checked-in</span>
                          ) : (
                            <span>Belum check-in</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-500">Plus One:</span>{' '}
                            <span className="font-medium">{rsvp.plus_one ? 'Yes' : 'No'}</span>
                          </p>
                          <p className="text-gray-600">
                            <span className="text-gray-500">Dietary:</span>{' '}
                            {rsvp.dietary_restrictions || '-'}
                          </p>
                          {rsvp.qr_code_data && (
                            <button
                              onClick={() => setSelectedQRCode({
                                qrCodeData: rsvp.qr_code_data,
                                guestName: rsvp.guest_name,
                                confirmationCode: rsvp.confirmation_code
                              })}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-xs font-semibold gap-1 transition-colors"
                            >
                              <QrCode size={14} />
                              QR Code
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {rsvp.confirmed !== true && (
                            <button
                              onClick={() => handleUpdateStatus(rsvp.id || rsvp._id, true)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Mark as Confirmed"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {rsvp.confirmed !== false && (
                            <button
                              onClick={() => handleUpdateStatus(rsvp.id || rsvp._id, false)}
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
        {pagination && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 text-sm text-gray-500 border-t border-gray-100">
            <p>
              Showing page <span className="font-semibold text-gray-700">{pagination.page}</span> of{' '}
              <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
            </p>
            <p>
              Total confirmations:{' '}
              <span className="font-semibold text-gray-700">{pagination.total}</span>
            </p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQRCode && (
        <QRCodeModal
          qrCodeData={selectedQRCode.qrCodeData}
          guestName={selectedQRCode.guestName}
          confirmationCode={selectedQRCode.confirmationCode}
          onClose={() => setSelectedQRCode(null)}
        />
      )}
    </div>
  )
}

function QRCodeModal({ qrCodeData, guestName, confirmationCode, onClose }) {
  const [qrImageUrl, setQrImageUrl] = useState(null)
  const [qrData, setQrData] = useState(null)
  const [generatedQRUrl, setGeneratedQRUrl] = useState(null)

  useEffect(() => {
    // Parse QR code data
    if (qrCodeData) {
      if (qrCodeData.startsWith('data:text/plain;base64,')) {
        // Decode base64 JSON data
        try {
          const base64Data = qrCodeData.split(',')[1]
          const decodedData = JSON.parse(atob(base64Data))
          setQrData(decodedData)
          
          // Generate QR code from JSON data using API
          const jsonString = JSON.stringify(decodedData)
          const encodedData = encodeURIComponent(jsonString)
          // Use QR code API to generate visual QR code
          const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
          setGeneratedQRUrl(qrApiUrl)
        } catch (error) {
          console.error('Error decoding QR code data:', error)
        }
      } else if (qrCodeData.startsWith('data:image')) {
        // Direct image data URL
        setQrImageUrl(qrCodeData)
      } else {
        // Assume it's a URL or other format
        setQrData({ raw: qrCodeData })
        // Generate QR code from raw data
        const encodedData = encodeURIComponent(qrCodeData)
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
        setGeneratedQRUrl(qrApiUrl)
      }
    }
  }, [qrCodeData])

  const handleDownload = () => {
    const imageUrl = qrImageUrl || generatedQRUrl
    if (imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `qr-code-${confirmationCode || 'guest'}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QR Code
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {guestName || 'Guest'} - {confirmationCode || 'Confirmation'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* QR Code Content */}
        <div className="p-6">
          {(qrImageUrl || generatedQRUrl) ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-lg border-4 border-gray-100">
                <img 
                  src={qrImageUrl || generatedQRUrl} 
                  alt="QR Code" 
                  className="w-64 h-64"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-64 h-64 hidden items-center justify-center">
                  <QrCode className="text-gray-400" size={48} />
                </div>
              </div>
              {qrData && (
                <div className="w-full bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Confirmation Code:</p>
                  <p className="text-sm font-mono text-indigo-600">{qrData.confirmation_code || confirmationCode}</p>
                </div>
              )}
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </button>
            </div>
          ) : qrData ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">QR Code Data:</p>
                <pre className="text-xs text-gray-600 overflow-auto max-h-48 bg-white p-3 rounded border">
                  {JSON.stringify(qrData, null, 2)}
                </pre>
              </div>
              <p className="text-sm text-gray-500 text-center">
                QR code image tidak tersedia. Data di atas dapat digunakan untuk generate QR code.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                <QrCode className="text-gray-400" size={48} />
              </div>
              <p className="text-gray-500">QR code data tidak tersedia</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
