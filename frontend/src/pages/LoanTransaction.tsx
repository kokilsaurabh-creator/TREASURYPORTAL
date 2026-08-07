import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, Filter, Plus, ShieldCheck } from 'lucide-react'

interface TransactionItem {
  id: string
  loanNo: string
  txnDate: string
  type: 'DISBURSEMENT' | 'REPAYMENT' | 'INTEREST_POSTING'
  amount: number
  currency: string
  bank: string
  status: 'POSTED' | 'PENDING_AUTHORISATION' | 'REJECTED'
  reference: string
}

const INITIAL_TXNS: TransactionItem[] = [
  { id: 'TXN-901', loanNo: 'TL-2026-001', txnDate: '2026-08-01', type: 'DISBURSEMENT', amount: 50000000, currency: 'INR', bank: 'HDFC Bank', status: 'POSTED', reference: 'SAP-800192' },
  { id: 'TXN-902', loanNo: 'TL-2026-001', txnDate: '2026-08-05', type: 'INTEREST_POSTING', amount: 350000, currency: 'INR', bank: 'HDFC Bank', status: 'POSTED', reference: 'SAP-800204' },
  { id: 'TXN-903', loanNo: 'TL-2026-002', txnDate: '2026-08-07', type: 'REPAYMENT', amount: 2500000, currency: 'USD', bank: 'SBI Bank', status: 'PENDING_AUTHORISATION', reference: 'REF-78901' },
]

export default function LoanTransaction() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TXNS)
  const [filterType, setFilterType] = useState<string>('ALL')

  const filtered = transactions.filter(t => filterType === 'ALL' || t.type === filterType)

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight flex items-center gap-3">
            <ArrowUpRight size={30} className="text-emerald-400" />
            Loan Transactions & Postings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Execute disbursements, principal repayments, and interest accrual postings.
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer">
          <Plus size={16} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        {['ALL', 'DISBURSEMENT', 'REPAYMENT', 'INTEREST_POSTING'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === type 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Transaction Register ({filtered.length})</span>
          <span className="text-[11px] text-slate-500">Real-time SAP FI-CO Synchronization</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Txn ID</th>
                <th className="px-4 py-3.5">Loan Account No</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Transaction Type</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Bank</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Doc Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white">{row.id}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{row.loanNo}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{row.txnDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.type === 'DISBURSEMENT' ? 'bg-indigo-500/20 text-indigo-300' :
                      row.type === 'REPAYMENT' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-100">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{row.bank}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                      row.status === 'POSTED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {row.status === 'POSTED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{row.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
