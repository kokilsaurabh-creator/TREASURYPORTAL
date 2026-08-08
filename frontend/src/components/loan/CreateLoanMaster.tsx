import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid Community Modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface LoanFormData {
  bukrs: string;
  zint_no: string;
  zint_item: string;
  zproject: string;
  zloan_no: string;
  hbkid: string;
  hktid: string;
  waers: string;
  kursf: number;
  zsan_lc: number;
  zsan_fc: number;
  zb_charg: number;
  zl_date: string;
  zroi: number;
  monat: number;
  ztdays: number;
  zdays: number;
  zm_date: string;
  bktxt: string;
  sgtxt: string;
}

const initialFormData: LoanFormData = {
  bukrs: '1000',
  zint_no: '',
  zint_item: '',
  zproject: '',
  zloan_no: '',
  hbkid: '',
  hktid: '',
  waers: 'INR',
  kursf: 1.0,
  zsan_lc: 0,
  zsan_fc: 0,
  zb_charg: 0,
  zl_date: new Date().toISOString().split('T')[0],
  zroi: 0,
  monat: 0,
  ztdays: 0,
  zdays: 365,
  zm_date: '',
  bktxt: '',
  sgtxt: '',
};

const CreateLoanMaster: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>(initialFormData);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Auto-calculate Maturity Date based on Loan Date and Tenure
  useEffect(() => {
    if (formData.zl_date && formData.monat !== undefined && formData.ztdays !== undefined) {
      const startDate = new Date(formData.zl_date);
      if (!isNaN(startDate.getTime())) {
        const matureDate = new Date(startDate);
        matureDate.setMonth(matureDate.getMonth() + Number(formData.monat));
        matureDate.setDate(matureDate.getDate() + Number(formData.ztdays));
        setFormData((prev) => ({ ...prev, zm_date: matureDate.toISOString().split('T')[0] }));
      }
    }
  }, [formData.zl_date, formData.monat, formData.ztdays]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value,
    }));
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/loan/calculate-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_amount: formData.zsan_lc, // Using LC amount for schedule by default
          roi: formData.zroi,
          loan_date: formData.zl_date,
          tenure_months: formData.monat || (formData.ztdays ? Math.ceil(formData.ztdays/30) : 1),
          days_in_year: formData.zdays,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        alert('Failed to calculate schedule. Check input parameters.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error calculating schedule.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.zloan_no}_${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('loan-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Insert Loan Master Data
      const { data: loanData, error: loanError } = await supabase
        .from('ztfi_loan_data')
        .insert({
          ...formData,
          status: 'PENDING_AUTH'
        })
        .select()
        .single();

      if (loanError) throw loanError;

      // 3. Insert Schedule lines if available
      if (schedule.length > 0 && loanData) {
        const lines = schedule.map(line => ({
          loan_id: loanData.id,
          line_item: line.line_item,
          date_from: line.date_from,
          date_to: line.date_to,
          days_count: line.days_count,
          roi: formData.zroi,
          opening_balance: line.opening_balance,
          principal_repay: line.principal_repay,
          interest_expense: line.interest_expense,
          zins_amt_lc: line.installment_amount,
          closing_balance: line.closing_balance,
        }));
        await supabase.from('ztfi_loan_ins').insert(lines);
      }

      // 4. Record attachment metadata
      if (loanData && uploadData) {
        await supabase.from('loan_attachments').insert({
          loan_id: loanData.id,
          doc_category: 'SANCTION_LETTER',
          file_name: file.name,
          storage_path: uploadData.path
        });
      }

      alert('Loan Master submitted for approval successfully!');
      setStep(1);
      setFormData(initialFormData);
      setSchedule([]);
      setFile(null);
    } catch (error: any) {
      console.error(error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const colDefs = useMemo(() => [
    { field: 'line_item', headerName: 'No.', width: 70 },
    { field: 'date_from', headerName: 'From Date', width: 120 },
    { field: 'date_to', headerName: 'To Date', width: 120 },
    { field: 'days_count', headerName: 'Days', width: 80 },
    { field: 'opening_balance', headerName: 'Opening Bal', valueFormatter: (p: any) => p.value.toFixed(2) },
    { field: 'principal_repay', headerName: 'Principal', valueFormatter: (p: any) => p.value.toFixed(2) },
    { field: 'interest_expense', headerName: 'Interest', valueFormatter: (p: any) => p.value.toFixed(2) },
    { field: 'installment_amount', headerName: 'Installment', valueFormatter: (p: any) => p.value.toFixed(2) },
    { field: 'closing_balance', headerName: 'Closing Bal', valueFormatter: (p: any) => p.value.toFixed(2) },
  ], []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Term Loan Master</h1>
          <p className="text-slate-400 mt-2">Initialize a new facility and schedule generation.</p>
        </div>

        {/* Wizard Progress */}
        <div className="flex space-x-2 mb-8 overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
          {['Header Details', 'Banking & Limits', 'Rates & Tenor', 'Preview & Attachments'].map((label, i) => (
            <div
              key={i}
              className={`flex-1 py-3.5 px-6 text-sm font-semibold transition-all rounded-lg ${
                step === i + 1
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30'
                  : step > i + 1
                  ? 'bg-slate-800/80 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              Step {i + 1}: {label}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8">
          
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="col-span-full text-xl font-semibold text-white mb-4 border-b border-slate-800 pb-2">Header Details</h2>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Company Code (BUKRS)</label>
                <input name="bukrs" value={formData.bukrs} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Internal No</label>
                <input name="zint_no" value={formData.zint_no} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Item No</label>
                <input name="zint_item" value={formData.zint_item} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Project ID</label>
                <input name="zproject" value={formData.zproject} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Loan Account No</label>
                <input name="zloan_no" value={formData.zloan_no} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              
              <div className="col-span-full mt-6 space-y-2">
                <label className="text-sm text-slate-400">Header Text</label>
                <input name="bktxt" value={formData.bktxt} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" maxLength={25} />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm text-slate-400">Narration</label>
                <textarea name="sgtxt" value={formData.sgtxt} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" rows={2} maxLength={50} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="col-span-full text-xl font-semibold text-white mb-4 border-b border-slate-800 pb-2">Banking & Limits</h2>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400">House Bank</label>
                <input name="hbkid" value={formData.hbkid} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 uppercase" maxLength={5} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Account ID</label>
                <input name="hktid" value={formData.hktid} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 uppercase" maxLength={5} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Currency</label>
                <input name="waers" value={formData.waers} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 uppercase" maxLength={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Exchange Rate</label>
                <input name="kursf" type="number" step="0.00001" value={formData.kursf} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Sanction Limit LC</label>
                <input name="zsan_lc" type="number" step="0.01" value={formData.zsan_lc} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Sanction Limit FC</label>
                <input name="zsan_fc" type="number" step="0.01" value={formData.zsan_fc} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Bank Charges</label>
                <input name="zb_charg" type="number" step="0.01" value={formData.zb_charg} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 font-mono" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="col-span-full text-xl font-semibold text-white mb-4 border-b border-slate-800 pb-2">Rates & Tenor</h2>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Loan Start Date</label>
                <input name="zl_date" type="date" value={formData.zl_date} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5 [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Rate of Interest (%)</label>
                <input name="zroi" type="number" step="0.01" value={formData.zroi} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Tenure (Months)</label>
                <input name="monat" type="number" value={formData.monat} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Tenure (Days Extension)</label>
                <input name="ztdays" type="number" value={formData.ztdays} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Days in Year Basis</label>
                <select name="zdays" value={formData.zdays} onChange={handleInputChange} className="w-full glass-input rounded-lg px-4 py-2.5">
                  <option value={365}>365 (Actual/365)</option>
                  <option value={366}>366 (Actual/366 Leap)</option>
                  <option value={360}>360 (Actual/360)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Maturity Date (Auto-calculated)</label>
                <input name="zm_date" type="date" value={formData.zm_date} readOnly className="w-full glass-input opacity-60 rounded-lg px-4 py-2.5 cursor-not-allowed [color-scheme:dark]" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Preview & Attachments</h2>
                <button
                  onClick={handlePreview}
                  disabled={previewLoading}
                  className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  {previewLoading ? 'Generating...' : 'Generate Schedule Preview'}
                </button>
              </div>

              {schedule.length > 0 && (
                <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-800">
                  <AgGridReact
                    rowData={schedule}
                    columnDefs={colDefs}
                    defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
                    rowSelection={{ mode: 'multiRow' }}
                    theme="legacy"
                  />
                </div>
              )}

              <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/50">
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Quality Gate: Upload Sanction Letter (PDF required)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full max-w-sm mx-auto text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-500 transition-all cursor-pointer"
                />
                {file && <p className="mt-4 text-emerald-400 text-sm">Selected: {file.name}</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`px-6 py-2.5 rounded-lg transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'btn-secondary'
              }`}
            >
              Back
            </button>
            
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(4, s + 1))}
                className="px-6 py-2.5 rounded-lg btn-primary"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || loading}
                className="px-8 py-2.5 rounded-lg btn-cta disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateLoanMaster;
