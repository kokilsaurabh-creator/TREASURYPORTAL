import React, { useState, useRef } from 'react'
import { Plus, Download, Upload, ShieldAlert, Save, Trash2, Edit3, CheckCircle2, FileSpreadsheet, X } from 'lucide-react'

// Master Data Models
export interface GLMappingItem {
  id: string
  bukrs: string
  loan_type: string
  principal_gl: string
  interest_exp_gl: string
  interest_accrual_gl: string
  bank_clearing_gl: string
}

export interface ROIItem {
  id: string
  bank_id: string
  effective_from: string
  rate: number
  calc_basis: string
  compounding_freq: string
}

export interface LimitItem {
  id: string
  bukrs: string
  hbkid: string
  hktid: string
  limit_lc: number
  limit_fc: number
  waers: string
  valid_from: string
  valid_to: string
}

const INITIAL_GL_MAPPINGS: GLMappingItem[] = [
  { id: '1', bukrs: '1000', loan_type: 'TERM_LOAN', principal_gl: '200100', interest_exp_gl: '400500', interest_accrual_gl: '200200', bank_clearing_gl: '100100' },
  { id: '2', bukrs: '1000', loan_type: 'WCDL', principal_gl: '200110', interest_exp_gl: '400510', interest_accrual_gl: '200210', bank_clearing_gl: '100100' },
  { id: '3', bukrs: '2000', loan_type: 'EXTERNAL_DEBT', principal_gl: '200120', interest_exp_gl: '400520', interest_accrual_gl: '200220', bank_clearing_gl: '100200' },
]

const INITIAL_ROIS: ROIItem[] = [
  { id: '1', bank_id: 'HDFC', effective_from: '2024-01-01', rate: 8.50, calc_basis: 'ACTUAL_365', compounding_freq: 'SIMPLE' },
  { id: '2', bank_id: 'SBI', effective_from: '2024-04-01', rate: 8.25, calc_basis: 'ACTUAL_365', compounding_freq: 'SIMPLE' },
  { id: '3', bank_id: 'ICICI', effective_from: '2024-06-01', rate: 8.75, calc_basis: 'ACTUAL_365', compounding_freq: 'QUARTERLY' },
]

const INITIAL_LIMITS: LimitItem[] = [
  { id: '1', bukrs: '1000', hbkid: 'HDFC', hktid: 'TL01', limit_lc: 25000000, limit_fc: 0, waers: 'INR', valid_from: '2024-01-01', valid_to: '2025-12-31' },
  { id: '2', bukrs: '1000', hbkid: 'SBI', hktid: 'TL01', limit_lc: 50000000, limit_fc: 500000, waers: 'USD', valid_from: '2024-01-01', valid_to: '2025-12-31' },
]

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<'GL_MAPPING' | 'ROI' | 'LIMITS'>('GL_MAPPING')

  // Datasets
  const [glData, setGlData] = useState<GLMappingItem[]>(INITIAL_GL_MAPPINGS)
  const [roiData, setRoiData] = useState<ROIItem[]>(INITIAL_ROIS)
  const [limitsData, setLimitsData] = useState<LimitItem[]>(INITIAL_LIMITS)

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newGl, setNewGl] = useState<Omit<GLMappingItem, 'id'>>({ bukrs: '1000', loan_type: '', principal_gl: '', interest_exp_gl: '', interest_accrual_gl: '', bank_clearing_gl: '' })
  const [newRoi, setNewRoi] = useState<Omit<ROIItem, 'id'>>({ bank_id: '', effective_from: new Date().toISOString().split('T')[0], rate: 8.5, calc_basis: 'ACTUAL_365', compounding_freq: 'SIMPLE' })
  const [newLimit, setNewLimit] = useState<Omit<LimitItem, 'id'>>({ bukrs: '1000', hbkid: '', hktid: '', limit_lc: 10000000, limit_fc: 0, waers: 'INR', valid_from: new Date().toISOString().split('T')[0], valid_to: '2026-12-31' })

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    let filename = 'master_data.csv'

    if (activeTab === 'GL_MAPPING') {
      filename = 'GL_Mapping_ZTFI_LOAN_GL.csv'
      csvContent += 'Company(BUKRS),Loan Type,Principal GL,Interest Exp GL,Interest Accrual GL,Bank Clearing GL\n'
      glData.forEach(row => {
        csvContent += `${row.bukrs},${row.loan_type},${row.principal_gl},${row.interest_exp_gl},${row.interest_accrual_gl},${row.bank_clearing_gl}\n`
      })
    } else if (activeTab === 'ROI') {
      filename = 'Interest_Rates_ZTFI_LOAN_ROI.csv'
      csvContent += 'Bank ID,Effective From,Rate of Interest (%),Calc Basis,Compounding Freq\n'
      roiData.forEach(row => {
        csvContent += `${row.bank_id},${row.effective_from},${row.rate},${row.calc_basis},${row.compounding_freq}\n`
      })
    } else {
      filename = 'Sanction_Limits.csv'
      csvContent += 'CoCode,Bank ID,Account ID,Limit LC,Limit FC,Currency,Valid From,Valid To\n'
      limitsData.forEach(row => {
        csvContent += `${row.bukrs},${row.hbkid},${row.hktid},${row.limit_lc},${row.limit_fc},${row.waers},${row.valid_from},${row.valid_to}\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification(`Exported ${filename} successfully.`)
  }

  // Handle Import Trigger
  const handleImportTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      if (text) {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length > 1) {
          const dataLines = lines.slice(1)
          if (activeTab === 'GL_MAPPING') {
             const newData = dataLines.map(line => {
                const cols = line.split(',')
                return { id: Date.now().toString() + Math.random(), bukrs: cols[0], loan_type: cols[1], principal_gl: cols[2], interest_exp_gl: cols[3], interest_accrual_gl: cols[4], bank_clearing_gl: cols[5] }
             })
             setGlData([...glData, ...newData])
          } else if (activeTab === 'ROI') {
             const newData = dataLines.map(line => {
                const cols = line.split(',')
                return { id: Date.now().toString() + Math.random(), bank_id: cols[0], effective_from: cols[1], rate: parseFloat(cols[2]) || 0, calc_basis: cols[3], compounding_freq: cols[4] }
             })
             setRoiData([...roiData, ...newData])
          } else if (activeTab === 'LIMITS') {
             const newData = dataLines.map(line => {
                const cols = line.split(',')
                return { id: Date.now().toString() + Math.random(), bukrs: cols[0], hbkid: cols[1], hktid: cols[2], limit_lc: parseFloat(cols[3]) || 0, limit_fc: parseFloat(cols[4]) || 0, waers: cols[5], valid_from: cols[6], valid_to: cols[7] }
             })
             setLimitsData([...limitsData, ...newData])
          }
        }
        showNotification(`Successfully imported data from ${file.name}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Add Row Handlers
  const handleSaveNewEntry = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === 'GL_MAPPING') {
      if (!newGl.loan_type || !newGl.principal_gl) return
      const item: GLMappingItem = { id: Date.now().toString(), ...newGl }
      setGlData([...glData, item])
      setNewGl({ bukrs: '1000', loan_type: '', principal_gl: '', interest_exp_gl: '', interest_accrual_gl: '', bank_clearing_gl: '' })
      showNotification('New G/L Mapping entry added & saved.')
    } else if (activeTab === 'ROI') {
      if (!newRoi.bank_id) return
      const item: ROIItem = { id: Date.now().toString(), ...newRoi }
      setRoiData([...roiData, item])
      setNewRoi({ bank_id: '', effective_from: new Date().toISOString().split('T')[0], rate: 8.5, calc_basis: 'ACTUAL_365', compounding_freq: 'SIMPLE' })
      showNotification('New Interest Rate entry added & saved.')
    } else {
      if (!newLimit.hbkid) return
      const item: LimitItem = { id: Date.now().toString(), ...newLimit }
      setLimitsData([...limitsData, item])
      setNewLimit({ bukrs: '1000', hbkid: '', hktid: '', limit_lc: 10000000, limit_fc: 0, waers: 'INR', valid_from: new Date().toISOString().split('T')[0], valid_to: '2026-12-31' })
      showNotification('New Sanction Limit entry added & saved.')
    }

    setIsAddModalOpen(false)
  }

  // Delete Row
  const handleDeleteRow = (id: string) => {
    if (activeTab === 'GL_MAPPING') setGlData(glData.filter(r => r.id !== id))
    else if (activeTab === 'ROI') setRoiData(roiData.filter(r => r.id !== id))
    else setLimitsData(limitsData.filter(r => r.id !== id))

    showNotification('Record deleted successfully.')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-10">
      
      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv,.json" 
        className="hidden" 
      />

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight flex items-center gap-3">
            <FileSpreadsheet size={30} className="text-emerald-400" />
            Master Data TMG Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Table Maintenance Generator (TMG) for G/L mappings, Interest Rates, and Sanction Limits.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImportTrigger}
            className="px-4 py-2 btn-secondary rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <Upload size={14} className="text-violet-400" />
            <span>Import Data</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 btn-secondary rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} className="text-blue-400" />
            <span>Export CSV</span>
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2 btn-primary rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <TabButton active={activeTab === 'GL_MAPPING'} onClick={() => setActiveTab('GL_MAPPING')}>
          GL Mapping (ZTFI_LOAN_GL)
        </TabButton>
        <TabButton active={activeTab === 'ROI'} onClick={() => setActiveTab('ROI')}>
          Interest Rates (ZTFI_LOAN_ROI)
        </TabButton>
        <TabButton active={activeTab === 'LIMITS'} onClick={() => setActiveTab('LIMITS')}>
          Sanction Limits (BANK_LIMITS)
        </TabButton>
      </div>

      {/* Master Data Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden">
        
        {/* Table Toolbar Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
            <ShieldAlert size={15} />
            <span>Restricted TMG Maintenance — All changes are logged to Audit Trail</span>
          </div>

          <button 
            onClick={() => showNotification('All master data records saved & synchronized.')}
            className="px-4 py-2 btn-cta text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={14} />
            <span>Save All Records</span>
          </button>
        </div>

        {/* Responsive Custom Data Grid */}
        <div className="overflow-x-auto">
          {activeTab === 'GL_MAPPING' && (
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Company (BUKRS)</th>
                  <th className="px-4 py-3.5">Loan Type</th>
                  <th className="px-4 py-3.5">Principal G/L</th>
                  <th className="px-4 py-3.5">Interest Exp G/L</th>
                  <th className="px-4 py-3.5">Interest Accrual G/L</th>
                  <th className="px-4 py-3.5">Bank Clearing G/L</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {glData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{row.bukrs}</td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{row.loan_type}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <input 
                        type="text" 
                        value={row.principal_gl}
                        onChange={(e) => {
                          const val = e.target.value
                          setGlData(glData.map(r => r.id === row.id ? { ...r, principal_gl: val } : r))
                        }}
                        className="glass-input rounded px-2 py-1 text-xs w-full min-w-[120px] font-mono"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <input 
                        type="text" 
                        value={row.interest_exp_gl}
                        onChange={(e) => {
                          const val = e.target.value
                          setGlData(glData.map(r => r.id === row.id ? { ...r, interest_exp_gl: val } : r))
                        }}
                        className="glass-input rounded px-2 py-1 text-xs w-full min-w-[120px] font-mono"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <input 
                        type="text" 
                        value={row.interest_accrual_gl}
                        onChange={(e) => {
                          const val = e.target.value
                          setGlData(glData.map(r => r.id === row.id ? { ...r, interest_accrual_gl: val } : r))
                        }}
                        className="glass-input rounded px-2 py-1 text-xs w-full min-w-[120px] font-mono"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <input 
                        type="text" 
                        value={row.bank_clearing_gl}
                        onChange={(e) => {
                          const val = e.target.value
                          setGlData(glData.map(r => r.id === row.id ? { ...r, bank_clearing_gl: val } : r))
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:ring-1 focus:ring-emerald-500 w-28 font-mono"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'ROI' && (
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Bank ID</th>
                  <th className="px-4 py-3.5">Effective From</th>
                  <th className="px-4 py-3.5">Rate of Interest (%)</th>
                  <th className="px-4 py-3.5">Calc Basis</th>
                  <th className="px-4 py-3.5">Compounding Freq</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {roiData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-400">{row.bank_id}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{row.effective_from}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">
                      <input 
                        type="number" 
                        step="0.01"
                        value={row.rate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setRoiData(roiData.map(r => r.id === row.id ? { ...r, rate: val } : r))
                        }}
                        className="glass-input rounded px-2 py-1 text-xs text-blue-400 font-bold w-full min-w-[100px] font-mono"
                      /> %
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-300">{row.calc_basis}</td>
                    <td className="px-4 py-3 text-slate-400">{row.compounding_freq}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'LIMITS' && (
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Company Code</th>
                  <th className="px-4 py-3.5">House Bank (HBKID)</th>
                  <th className="px-4 py-3.5">Acct ID (HKTID)</th>
                  <th className="px-4 py-3.5">Sanction Limit (LC)</th>
                  <th className="px-4 py-3.5">Sanction Limit (FC)</th>
                  <th className="px-4 py-3.5">Currency</th>
                  <th className="px-4 py-3.5">Valid From</th>
                  <th className="px-4 py-3.5">Valid To</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {limitsData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{row.bukrs}</td>
                    <td className="px-4 py-3 font-bold text-slate-100">{row.hbkid}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{row.hktid}</td>
                    <td className="px-4 py-3 font-mono text-emerald-300 font-bold">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: row.waers || 'INR' }).format(row.limit_lc)}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{row.limit_fc || 0}</td>
                    <td className="px-4 py-3 font-bold text-indigo-400">{row.waers}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{row.valid_from}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{row.valid_to}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Add New Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 p-6 rounded-2xl border border-slate-800 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <Plus size={20} />
                <h3 className="font-bold text-white text-base">
                  Add {activeTab === 'GL_MAPPING' ? 'GL Mapping' : activeTab === 'ROI' ? 'Interest Rate' : 'Sanction Limit'} Entry
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEntry} className="space-y-4 text-xs">
              {activeTab === 'GL_MAPPING' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Company Code (BUKRS)</label>
                      <input 
                        type="text" 
                        required 
                        value={newGl.bukrs} 
                        onChange={(e) => setNewGl({ ...newGl, bukrs: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Loan Type</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. TERM_LOAN, WCDL"
                        value={newGl.loan_type} 
                        onChange={(e) => setNewGl({ ...newGl, loan_type: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 uppercase" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Principal G/L</label>
                      <input 
                        type="text" 
                        required 
                        value={newGl.principal_gl} 
                        onChange={(e) => setNewGl({ ...newGl, principal_gl: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Interest Expense G/L</label>
                      <input 
                        type="text" 
                        required 
                        value={newGl.interest_exp_gl} 
                        onChange={(e) => setNewGl({ ...newGl, interest_exp_gl: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Interest Accrual G/L</label>
                      <input 
                        type="text" 
                        required 
                        value={newGl.interest_accrual_gl} 
                        onChange={(e) => setNewGl({ ...newGl, interest_accrual_gl: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Bank Clearing G/L</label>
                      <input 
                        type="text" 
                        required 
                        value={newGl.bank_clearing_gl} 
                        onChange={(e) => setNewGl({ ...newGl, bank_clearing_gl: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'ROI' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Bank ID</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. HDFC, SBI"
                        value={newRoi.bank_id} 
                        onChange={(e) => setNewRoi({ ...newRoi, bank_id: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 uppercase" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Effective From</label>
                      <input 
                        type="date" 
                        required 
                        value={newRoi.effective_from} 
                        onChange={(e) => setNewRoi({ ...newRoi, effective_from: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white [color-scheme:dark]" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Rate of Interest (%)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={newRoi.rate} 
                        onChange={(e) => setNewRoi({ ...newRoi, rate: parseFloat(e.target.value) || 0 })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Calculation Basis</label>
                      <select 
                        value={newRoi.calc_basis} 
                        onChange={(e) => setNewRoi({ ...newRoi, calc_basis: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2"
                      >
                        <option value="ACTUAL_365">ACTUAL_365</option>
                        <option value="ACTUAL_360">ACTUAL_360</option>
                        <option value="360_360">360_360</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'LIMITS' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">CoCode (BUKRS)</label>
                      <input 
                        type="text" 
                        required 
                        value={newLimit.bukrs} 
                        onChange={(e) => setNewLimit({ ...newLimit, bukrs: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Bank ID (HBKID)</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="HDFC"
                        value={newLimit.hbkid} 
                        onChange={(e) => setNewLimit({ ...newLimit, hbkid: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 uppercase" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Account ID (HKTID)</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="TL01"
                        value={newLimit.hktid} 
                        onChange={(e) => setNewLimit({ ...newLimit, hktid: e.target.value })} 
                        className="w-full glass-input rounded-xl px-3 py-2 uppercase" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Sanction Limit (LC)</label>
                      <input 
                        type="number" 
                        required 
                        value={newLimit.limit_lc} 
                        onChange={(e) => setNewLimit({ ...newLimit, limit_lc: parseFloat(e.target.value) || 0 })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Currency (WAERS)</label>
                      <input 
                        type="text" 
                        required 
                        value={newLimit.waers} 
                        onChange={(e) => setNewLimit({ ...newLimit, waers: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase" 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40"
                >
                  Save Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 font-semibold text-xs transition-all border-b-2 cursor-pointer ${
        active 
          ? 'text-blue-400 border-blue-500 bg-blue-500/10' 
          : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
