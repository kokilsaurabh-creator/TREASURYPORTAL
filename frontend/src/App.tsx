import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Lazy loading pages for performance (simulated here with standard imports for simplicity)
import Dashboard from './pages/Dashboard'
import LoanWizard from './pages/LoanWizard'
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
            <Route path="/loan-wizard" element={<LoanWizard />} />
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
