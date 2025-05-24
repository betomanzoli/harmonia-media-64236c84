
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/toaster';

// ✅ PÁGINAS PRINCIPAIS
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PortfolioPage from './pages/Portfolio';
import Briefing from './pages/Briefing';
import Packages from './pages/Packages';
import Payment from './pages/Payment';
import PaymentReturn from './pages/PaymentReturn';
import OrderTracking from './pages/OrderTracking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import PreviewPage from './pages/PreviewPage';
import BriefingSuccess from './pages/BriefingSuccess';

// ✅ BRIEFINGS ESPECÍFICOS (NOMES CORRETOS)
import BriefingEssencial from './pages/briefing/BriefingEssencial';
import BriefingProfissional from './pages/briefing/BriefingProfissional';
import BriefingPremium from './pages/briefing/BriefingPremium';

// ✅ CONTRATOS
import ContractEssencial from './pages/contract/essencial';
import ContractProfissional from './pages/contract/profissional';
import ContractPremium from './pages/contract/premium';

// ✅ PAYMENT
import PaymentSuccess from './pages/payment/success';
import PaymentCancel from './pages/payment/cancel';

// ✅ ADMIN
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminClients from './pages/admin/AdminClients';
import AdminPayments from './pages/admin/AdminPayments';
import AdminStorage from './pages/admin/AdminStorage';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminGuides from './pages/admin/AdminGuides';
import AdminSettings from './pages/admin/AdminSettings';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1 pt-16">
        <Routes>
          {/* ✅ ROTAS PRINCIPAIS */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/briefing-success" element={<BriefingSuccess />} />
          <Route path="/pacotes" element={<Packages />} />
          <Route path="/pagamento" element={<Payment />} />
          <Route path="/pagamento/:packageId" element={<Payment />} />
          <Route path="/pagamento-retorno" element={<PaymentReturn />} />
          <Route path="/acompanhar-pedido" element={<OrderTracking />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<Terms />} />
          
          {/* ✅ BRIEFINGS ESPECÍFICOS PÓS-PAGAMENTO */}
          <Route path="/briefing/essencial" element={<BriefingEssencial />} />
          <Route path="/briefing/profissional" element={<BriefingProfissional />} />
          <Route path="/briefing/premium" element={<BriefingPremium />} />
          
          {/* ✅ CONTRATOS */}
          <Route path="/contract/essencial" element={<ContractEssencial />} />
          <Route path="/contract/profissional" element={<ContractProfissional />} />
          <Route path="/contract/premium" element={<ContractPremium />} />
          
          {/* ✅ PAYMENT */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* ✅ PREVIEW - Simplified to single route */}
          <Route path="/preview/:projectId" element={<PreviewPage />} />
          
          {/* ✅ ADMIN COMPLETO */}
          <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
          <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
          <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
          <Route path="/admin-j28s7d1k/projects" element={<AdminProjects />} />
          <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
          <Route path="/admin-j28s7d1k/previews/:projectId" element={<AdminPreviews />} />
          <Route path="/admin-j28s7d1k/clients" element={<AdminClients />} />
          <Route path="/admin-j28s7d1k/payments" element={<AdminPayments />} />
          <Route path="/admin-j28s7d1k/storage" element={<AdminStorage />} />
          <Route path="/admin-j28s7d1k/statistics" element={<AdminStatistics />} />
          <Route path="/admin-j28s7d1k/portfolio" element={<AdminPortfolio />} />
          <Route path="/admin-j28s7d1k/integrations" element={<AdminIntegrations />} />
          <Route path="/admin-j28s7d1k/guides" element={<AdminGuides />} />
          <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
          
          {/* ✅ 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
