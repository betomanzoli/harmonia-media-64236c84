
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/components/admin/auth/AdminAuthProvider';
import ScrollToTop from '@/components/ScrollToTop';

// Páginas principais
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Portfolio from '@/pages/Portfolio';
import ContactUs from '@/pages/ContactUs';
import ThankYou from '@/pages/ThankYou';
import AudioDatabase from '@/pages/AudioDatabase';
import QualificationForm from '@/pages/QualificationForm';
import BriefingForm from '@/pages/BriefingForm';
import OrderTracking from '@/pages/OrderTracking';
import PaymentPage from '@/pages/PaymentPage';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentError from '@/pages/PaymentError';
import PaymentPending from '@/pages/PaymentPending';
import Calculator from '@/pages/Calculator';
import MusicPreviews from '@/pages/MusicPreviews';
import PreviewPage from '@/pages/PreviewPage';
import ClientPreview from '@/pages/ClientPreview';

// Páginas admin
import AdminLogin from '@/pages/admin/AdminLogin';
import NewAdminDashboard from '@/pages/admin/NewAdminDashboard';
import NewAdminProjects from '@/pages/admin/NewAdminProjects';
import NewAdminClients from '@/pages/admin/NewAdminClients';
import ProjectDetailsPage from '@/components/admin/projects/ProjectDetailsPage';
import PreviewProjectPage from '@/pages/admin/PreviewProjectPage';

// Componente de proteção de rotas admin
import ProtectedRoute from '@/components/admin/auth/ProtectedRoute';

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contato" element={<ContactUs />} />
                <Route path="/obrigado" element={<ThankYou />} />
                <Route path="/qualificacao" element={<QualificationForm />} />
                <Route path="/briefing" element={<BriefingForm />} />
                <Route path="/acompanhar-pedido" element={<OrderTracking />} />
                <Route path="/pagamento" element={<PaymentPage />} />
                <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
                <Route path="/pagamento/erro" element={<PaymentError />} />
                <Route path="/pagamento/pendente" element={<PaymentPending />} />
                <Route path="/calculadora" element={<Calculator />} />
                <Route path="/audio-database" element={<AudioDatabase />} />
                
                {/* Rotas de preview */}
                <Route path="/preview/:previewId" element={<MusicPreviews />} />
                <Route path="/preview/:projectId" element={<PreviewPage />} />
                <Route path="/client-preview/:previewCode" element={<ClientPreview />} />
                
                {/* Rotas admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
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
    </AuthContextProvider>
  );
}

export default App;
