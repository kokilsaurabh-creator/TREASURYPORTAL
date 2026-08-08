import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Inbox, 
  Database, 
  Bell, 
  UserPlus, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight,
  Landmark,
  CreditCard,
  BarChart2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { LoginPad } from '@/components/auth/LoginPad'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { role, userProfile, isAuthenticated, logout } = useAuthStore()
  const location = useLocation()

  // State for Tree Collapsible Navigation
  const [isLoansExpanded, setIsLoansExpanded] = useState(true)

  // Render LoginPad if user is not authenticated or has no active role
  if (!isAuthenticated || !role) {
    return <LoginPad />
  }

  const isLoanActive = location.pathname.startsWith('/loan') || location.pathname === '/loan-wizard'

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-card p-5 flex flex-col gap-6 sticky top-0 md:h-screen z-10 font-sans border-r-0 rounded-r-3xl my-2 ml-2">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white tracking-tighter">TM</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-50 tracking-tight leading-none">Apex Treasury</h1>
            <span className="text-[10px] text-slate-500 font-medium">Enterprise Suite</span>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          
          {/* Dashboard */}
          <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          
          {/* Loan Module Tree Section */}
          {(role === 'Maker' || role === 'Admin' || role === 'Finance Head' || role === 'Authoriser') && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsLoansExpanded(!isLoansExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer group",
                  isLoanActive 
                    ? "bg-slate-900/90 text-slate-100 border border-slate-800/80" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Landmark size={18} className={cn("transition-colors", isLoanActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                  <span>Loans</span>
                </div>
                {isLoansExpanded ? (
                  <ChevronDown size={16} className="text-slate-500" />
                ) : (
                  <ChevronRight size={16} className="text-slate-500" />
                )}
              </button>

              {/* Tree Child Nodes */}
              {isLoansExpanded && (
                <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 pt-1">
                  <NavLink 
                    to="/loan/master" 
                    icon={<FileText size={16} />} 
                    label="Master" 
                    isTreeChild
                  />
                  <NavLink 
                    to="/loan/transaction" 
                    icon={<CreditCard size={16} />} 
                    label="Transaction" 
                    isTreeChild
                  />
                  <NavLink 
                    to="/loan/reports" 
                    icon={<BarChart2 size={16} />} 
                    label="Report" 
                    isTreeChild
                  />
                </div>
              )}
            </div>
          )}

          {/* Approvals */}
          {(role === 'Authoriser' || role === 'Admin') && (
            <NavLink to="/approval" icon={<Inbox size={18} />} label="Approvals" badge={3} />
          )}
          
          {/* Master Data */}
          {(role === 'Finance Head' || role === 'Admin') && (
            <NavLink to="/master-data" icon={<Database size={18} />} label="Master Data" />
          )}

          {/* User Provisioning */}
          {role === 'Admin' && (
            <NavLink to="/admin/provision" icon={<UserPlus size={18} />} label="User Provisioning" />
          )}

        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                {(userProfile?.fullName || userProfile?.userId || role).charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userProfile?.fullName || userProfile?.userId || role}
                </p>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-blue-400 truncate">
                    {role}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={logout} 
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
        <header className="flex justify-between items-center mb-8 glass-header rounded-2xl p-4">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search loans, transactions, reports, GL mappings..." 
              className="w-full glass-input rounded-lg pl-4 pr-10 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>{role} Session</span>
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

function NavLink({ to, icon, label, badge, isTreeChild }: { to: string; icon: React.ReactNode; label: string; badge?: number; isTreeChild?: boolean }) {
  const location = useLocation()
  
  // Reactive Active Path Check using React Router useLocation
  const isActive = location.pathname === to || (to === '/loan/master' && location.pathname === '/loan-wizard')

  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
        isTreeChild && "py-2 text-xs font-semibold",
        isActive 
          ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20" 
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      )}
      <span className={cn("transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")}>
        {icon}
      </span>
      <span>{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-rose-500/20 text-rose-400 py-0.5 px-2 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}
