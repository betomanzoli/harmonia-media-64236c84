
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Portfolio from '@/pages/Portfolio';
import Qualification from '@/pages/Qualification';
import Payment from '@/pages/Payment';
import ThankYou from '@/pages/ThankYou';
import Briefing from '@/pages/Briefing';
import PreviewPage from '@/pages/PreviewPage';
import MusicPreviewPage from '@/pages/MusicPreviewPage';
import PreviewDebugPage from '@/pages/PreviewDebugPage';
import OrderTracking from '@/pages/OrderTracking';
import CreditRefundRequest from '@/pages/CreditRefundRequest';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import Calculator from '@/pages/Calculator';
import PaymentReturn from '@/pages/PaymentReturn';
import AudioDatabase from '@/pages/AudioDatabase';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPortfolio from '@/pages/admin/AdminPortfolio';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminStorage from '@/pages/admin/AdminStorage';
import AdminPreviews from '@/pages/admin/AdminPreviews';
import AdminGuides from '@/pages/admin/AdminGuides';
import PreviewProjectPage from '@/pages/admin/PreviewProjectPage';
import ResetPassword from '@/pages/admin/ResetPassword';
import AdminIntegrations from '@/pages/admin/AdminIntegrations';
import AdminInvoices from '@/pages/admin/AdminInvoices';
import PublicLayout from '@/layouts/PublicLayout';
import { ProtectedRoute } from '@/components/admin/auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="servicos" element={<ServicesPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="qualificacao" element={<Qualification />} />
        <Route path="payment" element={<Payment />} />
        <Route path="payment-return/:status" element={<PaymentReturn />} />
        <Route path="checkout" element={<Payment />} />
        <Route path="obrigado" element={<ThankYou />} />
        <Route path="briefing/:id" element={<Briefing />} />
        <Route path="pedido" element={<OrderTracking />} />
        <Route path="reembolso" element={<CreditRefundRequest />} />
        <Route path="calculadora" element={<Calculator />} />
        <Route path="privacidade" element={<PrivacyPolicy />} />
        <Route path="termos" element={<Terms />} />
      </Route>
      
      {/* Rotas de prévia de música */}
      <Route path="/preview/:projectId" element={<PreviewPage />} />
      <Route path="/preview-debug/:projectId" element={<PreviewDebugPage />} />
      <Route path="/preview-project/:previewId" element={<MusicPreviewPage />} />
      
      {/* Rotas administrativas */}
      <Route path="/admin-j28s7d1k">
        <Route path="login" element={<AdminLogin />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="audio-database" element={<AudioDatabase />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="storage" element={<AdminStorage />} />
          <Route path="previews" element={<AdminPreviews />} />
          <Route path="previews/:projectId" element={<PreviewProjectPage />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="integrations" element={<AdminIntegrations />} />
          <Route path="invoices" element={<AdminInvoices />} />
        </Route>
      </Route>
      
      {/* Página 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
