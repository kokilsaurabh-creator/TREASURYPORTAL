import React, { useState } from 'react'
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert,
  Building2,
  Info
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function LoginPad() {
  const { login } = useAuthStore()
  
  // Login Form States
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!userId.trim()) {
      setErrorMessage('Please enter your User ID.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const res = login(userId, password)
      setIsSubmitting(false)

      if (!res.success && res.message) {
        setErrorMessage(res.message)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden font-sans">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Professional Header & Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/30">
              <Building2 size={14} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-indigo-300 bg-clip-text text-transparent">
              Enterprise Treasury Suite
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            TREASURY MANAGEMENT SYSTEM
          </h1>
          
          {/* Executive Enterprise Subtitle */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Integrated Enterprise Suite for Liquidity, Debt Capital & Treasury Risk Operations
          </p>
        </div>

        {/* Main Login Pad Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl bg-slate-900/70 relative">
          
          {/* Form Title Banner */}
          <div className="mb-6 pb-4 border-b border-slate-800/70">
            <h2 className="text-lg font-bold text-slate-100 flex items-center justify-between">
              <span>Account Sign In</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                Secure Portal
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your assigned User ID and Password to access your session.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* User ID Field (Replaces Email) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>User ID</span>
                <span className="text-[11px] text-slate-500">Case Insensitive</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID (e.g. ADMIN, MAKER01)"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium uppercase"
                />
              </div>
            </div>

            {/* Password Field (No Forgot Password link as requested) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
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

            {/* Session Option */}
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
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-900/40 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating User...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Clean User Credentials Info Box */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
              <Info size={14} className="text-emerald-400" />
              <span>Default System User IDs & Passwords:</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400 font-mono">
              <div><strong className="text-slate-200">ADMIN:</strong> Admin@123</div>
              <div><strong className="text-slate-200">MAKER01:</strong> Maker@123</div>
              <div><strong className="text-slate-200">FINANCE01:</strong> Finance@123</div>
              <div><strong className="text-slate-200">AUTH01:</strong> Auth@123</div>
              <div><strong className="text-slate-200">AUDIT01:</strong> Audit@123</div>
            </div>
          </div>

        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-500/80" />
          <span>Enterprise Role-Based Authentication Engine</span>
        </div>

      </div>
    </div>
  )
}
