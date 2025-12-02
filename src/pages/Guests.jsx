import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, Users, Mail, Phone } from 'lucide-react'
import api from '../config/api'

export default function Guests() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGuest, setEditingGuest] = useState(null)

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      setLoading(true)
      const data = await api.getGuests()
      const guestsData = data.data || data || []
      setGuests(Array.isArray(guestsData) ? guestsData : [])
    } catch (error) {
      console.error('Error fetching guests:', error)
      setGuests([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus guest ini?')) {
      try {
        await api.deleteGuest(id)
        fetchGuests()
      } catch (error) {
        alert('Gagal menghapus guest: ' + error.message)
      }
    }
  }

  const handleSave = async (guestData) => {
    try {
      if (editingGuest) {
        await api.updateGuest(editingGuest.id || editingGuest._id, guestData)
      }
      setEditingGuest(null)
      fetchGuests()
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message)
    }
  }

  const filteredGuests = guests.filter((guest) =>
    JSON.stringify(guest).toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            Guests
          </h1>
          <p className="text-gray-500 mt-1">Kelola daftar tamu undangan</p>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
          Total: <span className="font-semibold text-indigo-600">{guests.length}</span> guests
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari guest berdasarkan nama, email, atau phone..."
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
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Phone</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">Tidak ada data guest</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-400">Coba cari dengan kata kunci lain</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest, index) => (
                  <tr 
                    key={guest.id || guest._id} 
                    className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                          {(guest.name || guest.nama || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{guest.name || guest.nama || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span>{guest.email || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <span>{guest.phone || guest.telepon || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id || guest._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function EditGuestModal({ guest, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: guest.name || guest.nama || '',
    email: guest.email || '',
    phone: guest.phone || guest.telepon || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edit Guest
          </h2>
          <p className="text-sm text-gray-500 mt-1">Update informasi guest</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
