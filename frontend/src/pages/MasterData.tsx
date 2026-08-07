import { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { Plus, Download, Upload, ShieldAlert } from 'lucide-react'

// Register AG Grid Community modules globally
ModuleRegistry.registerModules([AllCommunityModule])

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('GL_MAPPING')

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Master Data Portal</h1>
        <p className="text-slate-400 mt-1">Configure G/L mappings, ROIs, and Sanction Limits securely.</p>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
        <TabButton active={activeTab === 'GL_MAPPING'} onClick={() => setActiveTab('GL_MAPPING')}>GL Mapping (ZTFI_LOAN_GL)</TabButton>
        <TabButton active={activeTab === 'ROI'} onClick={() => setActiveTab('ROI')}>Interest Rates (ZTFI_LOAN_ROI)</TabButton>
        <TabButton active={activeTab === 'LIMITS'} onClick={() => setActiveTab('LIMITS')}>Sanction Limits</TabButton>
      </div>

      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
            <ShieldAlert size={16} /> Restricted TMG Access
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Upload size={16} /> Import
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Download size={16} /> Export
            </button>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20">
              <Plus size={16} /> Add Entry
            </button>
          </div>
        </div>

        <div className="flex-1 w-full bg-slate-950 p-2">
          {activeTab === 'GL_MAPPING' && <GLMappingGrid />}
          {activeTab === 'ROI' && <ROIGrid />}
          {activeTab === 'LIMITS' && <LimitsGrid />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
        active 
          ? 'text-emerald-400 border-emerald-400' 
          : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function GLMappingGrid() {
  const rowData = [
    { bukrs: '1000', loan_type: 'TERM_LOAN', principal_gl: '200100', interest_exp_gl: '400500', interest_accrual_gl: '200200', bank_clearing_gl: '100100' },
    { bukrs: '1000', loan_type: 'WCDL', principal_gl: '200110', interest_exp_gl: '400510', interest_accrual_gl: '200210', bank_clearing_gl: '100100' },
  ]
  const colDefs = [
    { field: 'bukrs', headerName: 'Company (BUKRS)' },
    { field: 'loan_type', headerName: 'Loan Type' },
    { field: 'principal_gl', headerName: 'Principal G/L', editable: true },
    { field: 'interest_exp_gl', headerName: 'Int. Exp G/L', editable: true },
    { field: 'interest_accrual_gl', headerName: 'Int. Accrual G/L', editable: true },
    { field: 'bank_clearing_gl', headerName: 'Bank Clr G/L', editable: true },
  ]
  return (
    <AgGridReact 
      rowData={rowData} 
      columnDefs={colDefs} 
      defaultColDef={{ flex: 1, resizable: true }} 
      rowSelection={{ mode: 'multiRow' }} 
      theme="legacy"
    />
  )
}

function ROIGrid() {
  const rowData = [
    { bank_id: 'HDFC', effective_from: '2024-01-01', rate: 8.50, calc_basis: 'ACTUAL_365' },
    { bank_id: 'SBI', effective_from: '2024-04-01', rate: 8.25, calc_basis: 'ACTUAL_365' },
  ]
  const colDefs = [
    { field: 'bank_id', headerName: 'Bank ID' },
    { field: 'effective_from', headerName: 'Effective From', editable: true },
    { field: 'rate', headerName: 'ROI %', editable: true },
    { field: 'calc_basis', headerName: 'Calc Basis', editable: true },
  ]
  return (
    <AgGridReact 
      rowData={rowData} 
      columnDefs={colDefs} 
      defaultColDef={{ flex: 1, resizable: true }} 
      theme="legacy"
    />
  )
}

function LimitsGrid() {
  const rowData = [
    { bukrs: '1000', hbkid: 'HDFC', hktid: 'TL01', limit: 25000000, waers: 'USD', valid_from: '2024-01-01', valid_to: '2025-12-31' },
    { bukrs: '1000', hbkid: 'SBI', hktid: 'TL01', limit: 50000000, waers: 'USD', valid_from: '2024-01-01', valid_to: '2025-12-31' },
  ]
  const colDefs = [
    { field: 'bukrs', headerName: 'CoCode' },
    { field: 'hbkid', headerName: 'Bank ID' },
    { field: 'hktid', headerName: 'Acct ID' },
    { field: 'limit', headerName: 'Sanction Limit', editable: true, valueFormatter: (p:any) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(p.value) },
    { field: 'waers', headerName: 'Curr' },
    { field: 'valid_from', headerName: 'Valid From', editable: true },
    { field: 'valid_to', headerName: 'Valid To', editable: true },
  ]
  return (
    <AgGridReact 
      rowData={rowData} 
      columnDefs={colDefs} 
      defaultColDef={{ flex: 1, resizable: true }} 
      theme="legacy"
    />
  )
}
