import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/chatbot/ChatbotButton';
import GlobalBandcampPlayer from './components/GlobalBandcampPlayer';
import applyDOMPatches from './utils/domPatches';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
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
import MusicPreviewAuth from './pages/MusicPreviewAuth';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';
import MusicPreviews from './pages/MusicPreviews';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import QualificacaoPage from './pages/Qualificacao';
import BriefingSuccess from './pages/BriefingSuccess';
import BriefingComplete from './pages/BriefingComplete';
import FinalDeliveryPage from './pages/FinalDeliveryPage';
import FAQ from './pages/FAQ';

// Import new admin pages
import NewAdminLogin from './pages/admin/NewAdminLogin';
import NewAdminDashboard from './pages/admin/NewAdminDashboard';
import NewAdminClients from './pages/admin/NewAdminClients';
import NewAdminProjects from './pages/admin/NewAdminProjects';
import ProjectDetailsPage from './pages/admin/ProjectDetailsPage';
import ClientPreview from '@/pages/ClientPreview';

// Import ProtectedRoute
import ProtectedRoute from './components/admin/layout/ProtectedRoute';

const App: React.FC = () => {
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(true);
  const [showBandcampPlayer, setShowBandcampPlayer] = useState(true);

  // ✅ APLICAR PATCHES DOM PARA PREVENIR TELA PRETA:
  useEffect(() => {
    try {
      applyDOMPatches();
      console.log('[App] DOM patches aplicados com sucesso');
    } catch (error) {
      console.warn('[App] Erro ao aplicar DOM patches:', error);
    }
  }, []); // ✅ EXECUTAR APENAS UMA VEZ

  // Check if current route is an admin route
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    setShowChatbot(!isAdminRoute);
    setShowBandcampPlayer(!isAdminRoute);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/briefing-success" element={<BriefingSuccess />} />
        <Route path="/briefing-complete" element={<BriefingComplete />} />
        <Route path="/calculadora" element={<Calculator />} />
        <Route path="/qualificacao" element={<QualificacaoPage />} />
        <Route path="/pacotes" element={<Packages />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/pagamento/:packageId" element={<Payment />} />
        <Route path="/pagamento/express" element={<Payment />} />
        <Route path="/pagamento/essencial" element={<Payment />} />
        <Route path="/pagamento/profissional" element={<Payment />} />
        <Route path="/pagamento/premium" element={<Payment />} />
        <Route path="/pagamento-retorno" element={<PaymentReturn />} />
        <Route path="/acompanhar-pedido" element={<OrderTracking />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/deliveries/:projectId" element={<FinalDeliveryPage />} />
        <Route path="/auth/preview/:projectId" element={<MusicPreviewAuth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/preview/:previewId" element={<MusicPreviews />} />
        <Route path="/feedback-confirmacao" element={<FeedbackConfirmation />} />
        <Route path="/como-funciona" element={<ServicesPage />} />
        <Route path="/client-preview/:previewCode" element={<ClientPreview />} />

        {/* Admin Login Route (Public) */}
        <Route path="/admin/login" element={<NewAdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<NewAdminDashboard />} />
          <Route path="/admin/clients" element={<NewAdminClients />} />
          <Route path="/admin/projects" element={<NewAdminProjects />} />
          <Route path="/admin/projects/:projectId" element={<ProjectDetailsPage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showChatbot && <ChatbotButton />}
      {showBandcampPlayer && <GlobalBandcampPlayer />}
    </div>
  );
};

export default App;
