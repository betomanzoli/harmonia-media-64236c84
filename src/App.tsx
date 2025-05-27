
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/toaster";
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminProjects from './pages/admin/AdminProjects';
import AdminClients from './pages/admin/AdminClients';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminMarketing from './pages/admin/AdminMarketing';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import AdminBriefingPage from './pages/admin/AdminBriefingPage';
import MusicPreviews from './pages/MusicPreviews';
import AdminAuthProvider from './components/admin/auth/AdminAuthProvider';
import ProtectedRoute from './components/admin/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Preview Routes */}
            <Route path="/preview/:previewId" element={<MusicPreviews />} />
            <Route path="/preview-music/:projectId" element={<MusicPreviews />} />
            
            {/* Admin Routes */}
            <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
            <Route path="/admin-j28s7d1k/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/briefings" element={
              <ProtectedRoute>
                <AdminBriefingPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/briefings/:briefingId" element={
              <ProtectedRoute>
                <AdminBriefingPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/previews" element={
              <ProtectedRoute>
                <AdminPreviews />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/previews/:projectId" element={
              <ProtectedRoute>
                <PreviewProjectPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/projects" element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/clients" element={
              <ProtectedRoute>
                <AdminClients />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/portfolio" element={
              <ProtectedRoute>
                <AdminPortfolio />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/invoices" element={
              <ProtectedRoute>
                <AdminInvoices />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/marketing" element={
              <ProtectedRoute>
                <AdminMarketing />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/settings" element={
              <ProtectedRoute>
                <AdminMarketing />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
          <SpeedInsights />
        </Router>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
