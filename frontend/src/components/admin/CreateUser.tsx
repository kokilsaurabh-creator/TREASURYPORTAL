import React, { useState } from 'react';

const CreateUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MAKER');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/admin/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'User provisioned successfully and assigned role.' });
        setEmail('');
        setRole('MAKER');
      } else {
        setStatus({ type: 'error', message: data.detail || 'An error occurred during provisioning.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error communicating with server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Provision New User</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Securely onboard a new team member and assign their system role.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Corporate Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="colleague@company.com"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
            System Role Designation
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="ADMIN">System Administrator (ADMIN)</option>
            <option value="FINANCE_HEAD">Head of Finance (FINANCE_HEAD)</option>
            <option value="MAKER">Data Maker (MAKER)</option>
            <option value="AUTHORISER">Data Authoriser (AUTHORISER)</option>
            <option value="AUDITOR">Compliance Auditor (AUDITOR)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? 'Provisioning...' : 'Provision User'}
        </button>

        {status.type && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm border ${
              status.type === 'success'
                ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400'
                : 'bg-red-900/30 border-red-800 text-red-400'
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
