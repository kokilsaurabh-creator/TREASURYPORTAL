import React, { useState } from 'react'
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  Building2, 
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  Sparkles
} from 'lucide-react'
import { useAuthStore, type UserRole, type EntryRole } from '@/store/authStore'

interface DemoUser {
  email: string
  role: UserRole
  entryRole: EntryRole
  label: string
  dept: string
}

const DEMO_ACCOUNTS: DemoUser[] = [
  { email: 'admin@treasury.com', role: 'Admin', entryRole: 'Admin', label: 'Admin Portal', dept: 'System Oversight' },
  { email: 'finance.head@treasury.com', role: 'Finance Head', entryRole: 'User', label: 'Finance Head', dept: 'Corporate Finance' },
  { email: 'maker@treasury.com', role: 'Maker', entryRole: 'User', label: 'Maker (Initiator)', dept: 'Treasury Ops' },
  { email: 'authoriser@treasury.com', role: 'Authoriser', entryRole: 'User', label: 'Authoriser', dept: 'Risk & Approvals' },
  { email: 'auditor@treasury.com', role: 'Auditor', entryRole: 'User', label: 'Auditor', dept: 'Compliance' },
]

export function LoginPad() {
  const { login } = useAuthStore()
  
  // Login Form States
  const [entryRole, setEntryRole] = useState<EntryRole>('User')
  const [email, setEmail] = useState('maker@treasury.com')
  const [password, setPassword] = useState('••••••••••••')
  const [selectedRole, setSelectedRole] = useState<UserRole>('Maker')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle entry role switch (User vs Admin)
  const handleEntryRoleChange = (roleMode: EntryRole) => {
    setEntryRole(roleMode)
    setErrorMessage('')
    if (roleMode === 'Admin') {
      setEmail('admin@treasury.com')
      setSelectedRole('Admin')
    } else {
      setEmail('maker@treasury.com')
      setSelectedRole('Maker')
    }
  }

  // Quick fill demo user
  const handleQuickFill = (acc: DemoUser) => {
    setEntryRole(acc.entryRole)
    setEmail(acc.email)
    setSelectedRole(acc.role)
    setPassword('TreasurySecure2026!')
    setErrorMessage('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      login(email, selectedRole || (entryRole === 'Admin' ? 'Admin' : 'Maker'), undefined, entryRole)
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden font-sans">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-6">
        
        {/* Professional Header & Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/30">
              AP
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-indigo-300 bg-clip-text text-transparent">
              Treasury Management System
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            APEX TREASURY PORTAL
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Secure, Audit-Compliant Financial Amortization & Role-Based Control Platform
          </p>
        </div>

        {/* Main Login Pad Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl bg-slate-900/70 relative">
          
          {/* Segmented Entry Role Switcher (User vs Admin) */}
          <div className="mb-6 p-1 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleEntryRoleChange('User')}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                entryRole === 'User'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <UserCheck size={16} />
              <span>User Entry</span>
            </button>

            <button
              type="button"
              onClick={() => handleEntryRoleChange('Admin')}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                entryRole === 'Admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Admin Entry</span>
            </button>
          </div>

          {/* Form Banner Info */}
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-800/70">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {entryRole === 'Admin' ? 'Administrator Login Pad' : 'Corporate User Login Pad'}
              </h2>
              <p className="text-xs text-slate-400">
                {entryRole === 'Admin' 
                  ? 'Access provisioning, system configurations & global audit logs' 
                  : 'Sign in with your enterprise credentials to access financial modules'}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              entryRole === 'Admin' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {entryRole} Mode
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Work Email Address</span>
                <span className="text-[11px] text-slate-500">SSO Enabled</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered work email.') }} className="text-xs text-emerald-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection Dropdown (For switching active operational role) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Assigned Operational Role
              </label>
              <select
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              >
                {entryRole === 'Admin' ? (
                  <option value="Admin">Administrator (Full Access)</option>
                ) : (
                  <>
                    <option value="Finance Head">Finance Head (Master Data & Override)</option>
                    <option value="Maker">Maker (Loan Creation & Schedules)</option>
                    <option value="Authoriser">Authoriser (Approval Workflow)</option>
                    <option value="Auditor">Auditor (Read-Only Audit Logs)</option>
                  </>
                )}
              </select>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
                />
                <span className="text-xs text-slate-400">Keep session active for 12 hours</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                entryRole === 'Admin'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-900/40'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-900/40'
              } disabled:opacity-50 cursor-pointer`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating Session...
                </span>
              ) : (
                <>
                  <span>Sign In to {entryRole === 'Admin' ? 'Admin Portal' : 'Treasury Portal'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Users Section */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Quick Demo Presets:
              </span>
              <span className="text-[11px] text-slate-500">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                    email === acc.email
                      ? 'bg-slate-800 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-[11px] truncate text-slate-200">{acc.label}</span>
                    {email === acc.email && <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate">{acc.dept}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Audit Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500/80" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyRound size={14} className="text-indigo-400/80" />
            <span>Role-Based Access Control</span>
          </div>
        </div>

      </div>
    </div>
  )
}
