
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/toaster";
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import FAQ from './pages/FAQ';
import BriefingPage from './pages/BriefingPage';
import PortfolioPage from './pages/PortfolioPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBriefingsPage from './pages/admin/AdminBriefingsPage';
import AdminPreviewsPage from './pages/admin/AdminPreviewsPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminClientsPage from './pages/admin/AdminClientsPage';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage';
import AdminMarketingPage from './pages/admin/AdminMarketingPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import BriefingDetailPage from './pages/admin/BriefingDetailPage';
import AdminBriefingPage from './pages/admin/AdminBriefingPage';
import PreviewMusicPage from './pages/PreviewMusicPage';
import AdminAuthProvider from './components/admin/auth/AdminAuthProvider';
import ProtectedRoute from './components/admin/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/briefing" element={<BriefingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          
          {/* Preview Routes */}
          <Route path="/preview/:previewId" element={<PreviewMusicPage />} />
          <Route path="/preview-music/:projectId" element={<PreviewMusicPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin-j28s7d1k/login" element={<AdminLoginPage />} />
          <Route path="/admin-j28s7d1k/" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/briefings" element={
            <ProtectedRoute>
              <AdminBriefingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/briefings/:briefingId" element={
            <ProtectedRoute>
              <BriefingDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/previews" element={
            <ProtectedRoute>
              <AdminPreviewsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/previews/:projectId" element={
            <ProtectedRoute>
              <PreviewProjectPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/projects" element={
            <ProtectedRoute>
              <AdminProjectsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/clients" element={
            <ProtectedRoute>
              <AdminClientsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/portfolio" element={
            <ProtectedRoute>
              <AdminPortfolioPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/invoices" element={
            <ProtectedRoute>
              <AdminInvoicesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/marketing" element={
            <ProtectedRoute>
              <AdminMarketingPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-j28s7d1k/settings" element={
            <ProtectedRoute>
              <AdminSettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
        <SpeedInsights />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
