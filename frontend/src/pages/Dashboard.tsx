import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { TrendingUp, AlertCircle, Clock, DollarSign } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const utilizationData = [
  { name: 'HDFC', sanctioned: 100, utilized: 75 },
  { name: 'SBI', sanctioned: 150, utilized: 120 },
  { name: 'ICICI', sanctioned: 80, utilized: 30 },
  { name: 'AXIS', sanctioned: 120, utilized: 95 },
]

const outflowData = [
  { month: 'Jan', principal: 10, interest: 2 },
  { month: 'Feb', principal: 10, interest: 1.8 },
  { month: 'Mar', principal: 10, interest: 1.6 },
  { month: 'Apr', principal: 15, interest: 1.4 },
  { month: 'May', principal: 15, interest: 1.2 },
]

export default function Dashboard() {
  const { role } = useAuthStore()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Executive Dashboard</h1>
        <p className="text-slate-400 mt-1">Portfolio overview and risk exposure analysis.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Total Active Debt Exposure" 
          value="$452.8M" 
          change="+2.4%" 
          trend="up" 
          icon={<DollarSign className="text-emerald-500" size={24} />}
          color="emerald"
        />
        <KPICard 
          title="Remaining Sanction Limits" 
          value="$128.5M" 
          change="-1.2%" 
          trend="down" 
          icon={<AlertCircle className="text-amber-500" size={24} />}
          color="amber"
        />
        <KPICard 
          title="Next 30-Day Outflow" 
          value="$12.4M" 
          subtitle="Principal: $10M | Interest: $2.4M"
          icon={<Clock className="text-indigo-500" size={24} />}
          color="indigo"
        />
        <KPICard 
          title="Weighted Avg ROI" 
          value="8.42%" 
          change="-12bps" 
          trend="down" 
          icon={<TrendingUp className="text-rose-500" size={24} />}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Limit Utilization by Bank</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                <Tooltip 
                  cursor={{fill: '#1E293B', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px' }}
                />
                <Bar dataKey="sanctioned" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outflow Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Debt Service Obligations</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="principal" stroke="#6366F1" strokeWidth={3} dot={{r: 4, fill: '#6366F1'}} />
                <Line type="monotone" dataKey="interest" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, fill: '#F59E0B'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {role === 'Authoriser' && (
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <AlertCircle className="text-amber-500" size={20} /> Action Required
            </h3>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">3 Pending</span>
          </div>
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div>
                  <p className="font-semibold text-slate-200">Facility TR-{202400+i}</p>
                  <p className="text-sm text-slate-400">SBI Term Loan - $50M</p>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KPICard({ title, value, change, trend, icon, subtitle, color }: any) {
  const colorMap: any = {
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20',
    indigo: 'from-indigo-500/10 to-transparent border-indigo-500/20',
    rose: 'from-rose-500/10 to-transparent border-rose-500/20',
  }

  const textColorMap: any = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
  }

  return (
    <div className={`glass-panel rounded-2xl p-6 bg-gradient-to-br ${colorMap[color]} relative overflow-hidden group hover:border-${color}-500/50 transition-colors`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-slate-900 shadow-inner flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-900/50 ${textColorMap[trend]}`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-slate-50 tracking-tight font-mono">{value}</h4>
        {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  )
}
