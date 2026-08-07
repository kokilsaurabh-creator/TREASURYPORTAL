import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from './components/layout/DashboardLayout'

import Dashboard from './pages/Dashboard'
import LoanWizard from './pages/LoanWizard'
import LoanTransaction from './pages/LoanTransaction'
import LoanReport from './pages/LoanReport'
import ApprovalInbox from './pages/ApprovalInbox'
import MasterData from './pages/MasterData'
import UserProvisioning from './pages/UserProvisioning'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Loan Module Tree Routes */}
            <Route path="/loan/master" element={<LoanWizard />} />
            <Route path="/loan/transaction" element={<LoanTransaction />} />
            <Route path="/loan/reports" element={<LoanReport />} />
            <Route path="/loan-wizard" element={<Navigate to="/loan/master" replace />} />
            
            <Route path="/approval" element={<ApprovalInbox />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/admin/provision" element={<UserProvisioning />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
