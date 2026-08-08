import React from 'react'
import { PieChart, BarChart3, Download, FileSpreadsheet, Layers, TrendingUp } from 'lucide-react'

export default function LoanReport() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight flex items-center gap-3">
            <BarChart3 size={30} className="text-indigo-400" />
            Loan Reports & Amortization Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate maturity profiles, interest liability schedules, and facility utilization reports.
          </p>
        </div>

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/30 cursor-pointer">
          <Download size={16} />
          <span>Export All Reports</span>
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs font-semibold text-slate-400">Total Sanctioned Limit</span>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">₹ 75,00,00,000</p>
          <span className="text-[11px] text-emerald-400 font-medium"> Across 3 House Banks</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs font-semibold text-slate-400">Current Outstanding Balance</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">₹ 50,35,00,000</p>
          <span className="text-[11px] text-slate-500 font-medium"> 67.1% Facility Utilization</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs font-semibold text-slate-400">YTD Interest Accrued</span>
          <p className="text-2xl font-extrabold text-blue-400 font-mono mt-1">₹ 4,12,50,000</p>
          <span className="text-[11px] text-blue-400/80 font-medium"> Actual/365 Day Count Basis</span>
        </div>
      </div>

      {/* Available Reports List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-emerald-400" />
          <span>Standard Treasury Reports</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportCard title="Amortization Schedule Register" desc="Line-by-line opening balance, principal repayment, and daily accrued interest." format="XLSX / PDF" />
          <ReportCard title="Bank Sanction Limit Utilization" desc="Sanction limits vs current drawdowns per House Bank and Account ID." format="XLSX" />
          <ReportCard title="Maturity Profile & Cash Outflow Forecast" desc="Consolidated principal and interest payment forecast grouped by maturity buckets." format="XLSX / PDF" />
          <ReportCard title="GL Accounting Postings Register" desc="Audit log of all SAP G/L voucher entries generated for principal and interest." format="CSV / XLSX" />
        </div>
      </div>

    </div>
  )
}

function ReportCard({ title, desc, format }: { title: string; desc: string; format: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/40 transition-all flex items-start justify-between gap-3 group">
      <div>
        <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">{title}</h3>
        <p className="text-xs text-slate-400 mt-1">{desc}</p>
        <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
          Format: {format}
        </span>
      </div>
      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0">
        <Download size={16} />
      </button>
    </div>
  )
}
