
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/components/admin/auth/AdminAuthProvider';
import ScrollToTop from '@/components/ScrollToTop';

// Páginas principais
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Portfolio from '@/pages/Portfolio';
import Contact from '@/pages/Contact';
import ThankYou from '@/pages/ThankYou';
import Qualificacao from '@/pages/Qualificacao';
import Briefing from '@/pages/Briefing';
import OrderTracking from '@/pages/OrderTracking';
import Payment from '@/pages/Payment';
import PaymentReturn from '@/pages/PaymentReturn';
import Calculator from '@/pages/Calculator';
import MusicPreviews from '@/pages/MusicPreviews';
import PreviewPage from '@/pages/PreviewPage';
import ClientPreview from '@/pages/ClientPreview';

// Páginas admin
import NewAdminLogin from '@/pages/admin/NewAdminLogin';
import NewAdminDashboard from '@/pages/admin/NewAdminDashboard';
import NewAdminProjects from '@/pages/admin/NewAdminProjects';
import NewAdminClients from '@/pages/admin/NewAdminClients';
import ProjectDetailsPage from '@/components/admin/projects/ProjectDetailsPage';
import PreviewProjectPage from '@/pages/admin/PreviewProjectPage';

// Componente de proteção de rotas admin
import ProtectedRoute from '@/components/admin/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/obrigado" element={<ThankYou />} />
                <Route path="/qualificacao" element={<Qualificacao />} />
                <Route path="/briefing" element={<Briefing />} />
                <Route path="/acompanhar-pedido" element={<OrderTracking />} />
                <Route path="/pagamento" element={<Payment />} />
                <Route path="/pagamento/retorno" element={<PaymentReturn />} />
                <Route path="/calculadora" element={<Calculator />} />
                
                {/* Rotas de preview */}
                <Route path="/preview/:previewId" element={<MusicPreviews />} />
                <Route path="/preview/:projectId" element={<PreviewPage />} />
                <Route path="/client-preview/:previewCode" element={<ClientPreview />} />
                
                {/* Rotas admin */}
                <Route path="/admin/login" element={<NewAdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <NewAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <NewAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                  <ProtectedRoute>
                    <NewAdminProjects />
                  </ProtectedRoute>
                } />
                <Route path="/admin/clients" element={
                  <ProtectedRoute>
                    <NewAdminClients />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects/:projectId" element={
                  <ProtectedRoute>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/preview/:projectId" element={
                  <ProtectedRoute>
                    <PreviewProjectPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </AdminAuthProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
