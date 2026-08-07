import { useState } from 'react'
import { Check, X, Eye, FileText, Activity } from 'lucide-react'

export default function ApprovalInbox() {
  const [selectedLoan, setSelectedLoan] = useState<number | null>(1)

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Pending Approvals</h1>
        <p className="text-slate-400 mt-1">Review, authorize, or reject facility originations.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Inbox List */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-slate-200">Action Queue (3)</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[1,2,3].map(i => (
              <button 
                key={i}
                onClick={() => setSelectedLoan(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedLoan === i 
                    ? 'bg-slate-800 border-emerald-500/30' 
                    : 'bg-transparent border-transparent hover:bg-slate-800/50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-200">TR-{202400 + i}</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                </div>
                <p className="text-sm text-slate-400">SBI Term Loan • $50M</p>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                  <ClockIcon size={12} /> Submitted 2h ago by Maker
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details Pane */}
        <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden">
          {selectedLoan ? (
            <>
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                <div>
                  <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Facility TR-{202400 + selectedLoan}</h2>
                  <p className="text-slate-400 text-sm mt-1">State Bank of India • Account TL01</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-medium transition-colors flex items-center gap-2">
                    <X size={18} /> Reject
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Check size={18} /> Authorize
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <SummaryCard label="Sanction Amount" value="$50,000,000" />
                  <SummaryCard label="Tenor" value="60 Months" />
                  <SummaryCard label="ROI (Actual/365)" value="8.50%" />
                </div>

                {/* Risk Gauge */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" /> Limit Utilization Impact
                  </h3>
                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Current Utilized: $120M</span>
                      <span className="text-slate-400">Total Sanction Limit: $200M</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-500 w-[60%]"></div>
                      <div className="h-full bg-emerald-500 w-[25%] relative group cursor-help">
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-4 right-0 bg-slate-800 px-2 py-1 rounded text-xs whitespace-nowrap text-slate-200 transition-opacity">
                          +$50M (This facility)
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 text-right">Post-approval utilization: 85%</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-emerald-400" /> Quality Gates
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-rose-400">PDF</div>
                        <div>
                          <p className="font-medium text-slate-200">Sanction_Letter_Signed.pdf</p>
                          <p className="text-xs text-slate-500">Uploaded by Maker • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium">
                        <Eye size={16} /> View
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-rose-400">PDF</div>
                        <div>
                          <p className="font-medium text-slate-200">Internal_Note_Sheet.pdf</p>
                          <p className="text-xs text-slate-500">Uploaded by Maker • 1.1 MB</p>
                        </div>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium">
                        <Eye size={16} /> View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a facility to review
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SummaryCard({ label, value }: any) {
  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-xl font-bold text-slate-100 font-mono">{value}</span>
    </div>
  )
}
