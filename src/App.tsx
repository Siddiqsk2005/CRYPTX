import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TraceAuthProvider } from "@/trace/auth";
import { About, AdminAuditLogs, AdminDashboard, AdminUsers, AdminVasps, CaseInvestigation, CaseList, ComplaintForm, GraphPage, InvestigatorDashboard, TraceLogin, VictimDashboard, WalletInvestigation } from "@/pages/trace/TracePages";

const App = () => <TraceAuthProvider><BrowserRouter><Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<TraceLogin />} />
  <Route path="/about" element={<About />} />
  <Route path="/investigator/dashboard" element={<InvestigatorDashboard />} />
  <Route path="/investigator/cases" element={<CaseList />} />
  <Route path="/investigator/cases/:id" element={<CaseInvestigation />} />
  <Route path="/investigator/wallet-investigation" element={<WalletInvestigation />} />
  <Route path="/investigator/wallet/:address" element={<WalletInvestigation />} />
  <Route path="/investigator/graph" element={<GraphPage />} />
  <Route path="/investigator/reports" element={<CaseList />} />
  <Route path="/investigator/analytics" element={<InvestigatorDashboard />} />
  <Route path="/victim/dashboard" element={<VictimDashboard />} />
  <Route path="/victim/complaint/new" element={<ComplaintForm />} />
  <Route path="/victim/complaints" element={<VictimDashboard />} />
  <Route path="/victim/complaints/:id" element={<VictimDashboard />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/users" element={<AdminUsers />} />
  <Route path="/admin/vasps" element={<AdminVasps />} />
  <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes></BrowserRouter></TraceAuthProvider>;
export default App;
