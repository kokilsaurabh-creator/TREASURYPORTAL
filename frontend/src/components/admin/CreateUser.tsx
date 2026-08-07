import React, { useState } from 'react'
import { 
  UserPlus, 
  KeyRound, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Search,
  Building2,
  Lock
} from 'lucide-react'
import { useAuthStore, type UserRole, type UserAccount } from '@/store/authStore'

export default function UserProvisioningAdmin() {
  const { userDirectory, addUser, resetPassword, toggleUserStatus } = useAuthStore()

  // Form State
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('Maker')
  const [department, setDepartment] = useState('Treasury Operations')

  // UI States
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [searchTerm, setSearchTerm] = useState('')
  
  // Password Reset Modal/State
  const [resetModalUser, setResetModalUser] = useState<UserAccount | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage({ type: null, message: '' })

    if (!userId.trim() || !password || !fullName.trim()) {
      setStatusMessage({ type: 'error', message: 'Please fill in all required fields.' })
      return
    }

    const res = addUser({
      userId,
      passwordHash: password,
      fullName,
      role,
      department
    })

    if (res.success) {
      setStatusMessage({ type: 'success', message: res.message })
      setUserId('')
      setPassword('')
      setFullName('')
    } else {
      setStatusMessage({ type: 'error', message: res.message })
    }
  }

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetModalUser || !newPassword) return

    const res = resetPassword(resetModalUser.userId, newPassword)
    if (res.success) {
      setStatusMessage({ type: 'success', message: res.message })
      setResetModalUser(null)
      setNewPassword('')
    } else {
      setStatusMessage({ type: 'error', message: res.message })
    }
  }

  const filteredUsers = userDirectory.filter(u => 
    u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Page Title & Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight flex items-center gap-3">
            <ShieldCheck size={28} className="text-indigo-400" />
            User Provisioning & Password Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Create new User IDs, assign operational roles, and manage password resets across the organization.
          </p>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMessage.type && (
        <div className={`p-4 rounded-xl text-sm border flex items-center justify-between ${
          statusMessage.type === 'success'
            ? 'bg-emerald-900/30 border-emerald-800 text-emerald-300'
            : 'bg-rose-900/30 border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{statusMessage.message}</span>
          </div>
          <button onClick={() => setStatusMessage({ type: null, message: '' })} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create / Provision User Form */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-5 h-fit">
          <div className="flex items-center gap-2 text-indigo-400 pb-2 border-b border-slate-800">
            <UserPlus size={20} />
            <h2 className="text-lg font-bold text-white">Provision New User ID</h2>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                User ID (System Login ID) *
              </label>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. MAKER02, ADMIN02"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set initial password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Employee Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                System Role Designation
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admin">Administrator (ADMIN)</option>
                <option value="Finance Head">Head of Finance (FINANCE HEAD)</option>
                <option value="Maker">Data Maker (MAKER)</option>
                <option value="Authoriser">Data Authoriser (AUTHORISER)</option>
                <option value="Auditor">Compliance Auditor (AUDITOR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Corporate Treasury"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus size={16} />
              <span>Create User Account</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Registered Users Table & Password Reset */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <Users size={20} />
              <h2 className="text-lg font-bold text-white">Registered User Directory ({userDirectory.length})</h2>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search User ID, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {user.userId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">{user.fullName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'Admin' 
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.department}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleUserStatus(user.userId)}
                        title="Click to toggle account active status"
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                          user.isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setResetModalUser(user)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg font-medium transition-colors inline-flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <KeyRound size={12} />
                        <span>Reset Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 p-6 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400">
                <Lock size={20} />
                <h3 className="font-bold text-white text-base">Reset Password for {resetModalUser.userId}</h3>
              </div>
              <button onClick={() => setResetModalUser(null)} className="text-slate-500 hover:text-white text-lg">
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter a new password for <strong className="text-slate-200">{resetModalUser.fullName}</strong> ({resetModalUser.userId}).
            </p>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/40"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
