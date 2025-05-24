import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

// ✅ IMPORTS DE PÁGINAS EXISTENTES
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

// ✅ BRIEFINGS ESPECÍFICOS
import BriefingEssencial from './pages/briefing/essencial';
import BriefingProfissional from './pages/briefing/profissional';
import BriefingPremium from './pages/briefing/premium';

// ✅ CONTRATOS
import ContractEssencial from './pages/contract/essencial';
import ContractProfissional from './pages/contract/profissional';
import ContractPremium from './pages/contract/premium';

// ✅ PAYMENT
import PaymentSuccess from './pages/payment/success';
import PaymentCancel from './pages/payment/cancel';

// ✅ ADMIN (apenas os que existem)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';

const App: React.FC = () => {
  const location = useLocation();
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);

  useEffect(() => {
    // Esconder Header/Footer em páginas específicas
    const hideHeaderFooterRoutes = [
      '/admin-j28s7d1k/login',
      '/admin-j28s7d1k/reset-password',
      '/admin-j28s7d1k/dashboard'
    ];
    
    const shouldHide = hideHeaderFooterRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    setShowHeaderFooter(!shouldHide);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      {/* ✅ HEADER */}
      {showHeaderFooter && <Header />}
      
      {/* ✅ MAIN CONTENT */}
      <main className={`flex-1 ${showHeaderFooter ? 'pt-20' : ''}`}>
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
          
          {/* ✅ CONTRATOS */}
          <Route path="/contract/essencial" element={<ContractEssencial />} />
          <Route path="/contract/profissional" element={<ContractProfissional />} />
          <Route path="/contract/premium" element={<ContractPremium />} />
          
          {/* ✅ PAYMENT */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* ✅ BRIEFINGS ESPECÍFICOS */}
          <Route path="/briefing/essencial" element={<BriefingEssencial />} />
          <Route path="/briefing/profissional" element={<BriefingProfissional />} />
          <Route path="/briefing/premium" element={<BriefingPremium />} />
          
          {/* ✅ PREVIEW */}
          <Route path="/preview/:projectId" element={<PreviewPage />} />
          
          {/* ✅ ADMIN */}
          <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
          <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
          <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
          
          {/* ✅ 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* ✅ FOOTER */}
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
