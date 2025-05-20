
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/chatbot/ChatbotButton';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPreviews from './pages/admin/AdminPreviews';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';
import PortfolioPage from './pages/Portfolio';
import Briefing from './pages/Briefing';
import Calculator from './pages/Calculator';
import Packages from './pages/Packages';
import Payment from './pages/Payment';
import PaymentReturn from './pages/PaymentReturn';
import OrderTracking from './pages/OrderTracking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import PreviewPage from './pages/PreviewPage';
import MusicPreviews from './pages/MusicPreviews';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import QualificacaoPage from './pages/Qualificacao';

// Import admin pages
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminClients from './pages/admin/AdminClients';
import AdminSettings from './pages/admin/AdminSettings';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminStorage from './pages/admin/AdminStorage';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminGuides from './pages/admin/AdminGuides';

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(true);
  
  // Check if current route is an admin route
  useEffect(() => {
    const isAdminRoute = location.pathname.includes('/admin-');
    setShowChatbot(!isAdminRoute);
  }, [location.pathname]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/calculadora" element={<Calculator />} />
        <Route path="/qualificacao" element={<QualificacaoPage />} />
        <Route path="/pacotes" element={<Packages />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/pagamento/:packageId" element={<Payment />} />
        <Route path="/pagamento-retorno" element={<PaymentReturn />} />
        <Route path="/acompanhar-pedido" element={<OrderTracking />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/preview/:previewId" element={<MusicPreviews />} />
        <Route path="/feedback-confirmacao" element={<FeedbackConfirmation />} />
        <Route path="/como-funciona" element={<ServicesPage />} />
        
        {/* Admin routes */}
        <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
        <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
        <Route path="/admin-j28s7d1k/projects" element={<AdminProjects />} />
        <Route path="/admin-j28s7d1k/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin-j28s7d1k/clients" element={<AdminClients />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        <Route path="/admin-j28s7d1k/orders" element={<AdminProjects />} />
        <Route path="/admin-j28s7d1k/payments" element={<AdminInvoices />} />
        <Route path="/admin-j28s7d1k/analytics" element={<AdminStatistics />} />
        <Route path="/admin-j28s7d1k/statistics" element={<AdminStatistics />} />
        <Route path="/admin-j28s7d1k/guides" element={<AdminGuides />} />
        <Route path="/admin-j28s7d1k/documentation" element={<AdminGuides />} />
        <Route path="/admin-j28s7d1k/integrations" element={<AdminIntegrations />} />
        <Route path="/admin-j28s7d1k/invoices" element={<AdminInvoices />} />
        <Route path="/admin-j28s7d1k/storage" element={<AdminStorage />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {showChatbot && <ChatbotButton />}
    </>
  );
};

export default App;
