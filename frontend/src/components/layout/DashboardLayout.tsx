import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, FilePlus, Inbox, Database, Bell, UserPlus, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { LoginPad } from '@/components/auth/LoginPad'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { role, userProfile, isAuthenticated, logout } = useAuthStore()

  // Render LoginPad if user is not authenticated or has no active role
  if (!isAuthenticated || !role) {
    return <LoginPad />
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-800 p-6 flex flex-col gap-6 sticky top-0 md:h-screen z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-bold text-white tracking-tighter">AP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-50 tracking-tight leading-none">Apex Treasury</h1>
            <span className="text-[10px] text-slate-500 font-medium">Enterprise Management</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          {(role === 'Maker' || role === 'Admin') && (
            <NavLink to="/loan-wizard" icon={<FilePlus size={20} />} label="Loan Wizard" />
          )}
          
          {(role === 'Authoriser' || role === 'Admin') && (
            <NavLink to="/approval" icon={<Inbox size={20} />} label="Approvals" badge={3} />
          )}
          
          {(role === 'Finance Head' || role === 'Admin') && (
            <NavLink to="/master-data" icon={<Database size={20} />} label="Master Data" />
          )}

          {role === 'Admin' && (
            <NavLink to="/admin/provision" icon={<UserPlus size={20} />} label="User Provisioning" />
          )}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm shrink-0">
                {(userProfile?.name || role).charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userProfile?.name || role}
                </p>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-emerald-400 truncate">
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
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
        <header className="flex justify-between items-center mb-8 glass-panel rounded-2xl p-4">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search loans, facilities, GL mappings..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-200 placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{userProfile?.entryRole || 'User'} Session</span>
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

function NavLink({ to, icon, label, badge }: { to: string, icon: React.ReactNode, label: string, badge?: number }) {
  const isActive = window.location.pathname === to
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
        isActive 
          ? "bg-emerald-500/10 text-emerald-400" 
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
      )}
      <span className={cn("transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")}>
        {icon}
      </span>
      {label}
      {badge !== undefined && (
        <span className="ml-auto bg-rose-500/20 text-rose-400 py-0.5 px-2 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}
