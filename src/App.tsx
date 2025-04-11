
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Contact from './components/Contact';
import BriefingForm from './components/BriefingForm';
import PreviewLibrary from './pages/PreviewLibrary';
import Dashboard from './pages/admin/Dashboard';
import AdminStorage from './pages/admin/AdminStorage';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import AudioDatabase from './pages/AudioDatabase';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import CreditRefundRequest from './pages/CreditRefundRequest';
import OrderTracking from './pages/OrderTracking';
import MusicPreviewPage from './pages/MusicPreviewPage';
import Calculator from './pages/Calculator';
import Qualification from './pages/Qualification';
import Payment from './pages/Payment';
import PaymentProcessing from './pages/PaymentProcessing';
import PaymentReturn from './pages/PaymentReturn';
import PortfolioPage from './pages/Portfolio';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Home />
          <Footer />
        </>} />
        
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<>
          <Header />
          <Services />
          <Footer />
        </>} />
        <Route path="/contact" element={<>
          <Header />
          <Contact />
          <Footer />
        </>} />
        <Route path="/briefing" element={<>
          <Header />
          <BriefingForm />
          <Footer />
        </>} />
        <Route path="/preview-library" element={<PreviewLibrary />} />
        <Route path="/credit-refund-request" element={<CreditRefundRequest />} />
        <Route path="/acompanhar-pedido" element={<OrderTracking />} />
        <Route path="/preview/:projectId" element={<MusicPreviewPage />} />
        <Route path="/calculadora" element={<Calculator />} />
        <Route path="/qualificacao" element={<Qualification />} />
        <Route path="/pagamento/:packageId" element={<Payment />} />
        <Route path="/pagamento-processando" element={<PaymentProcessing />} />
        <Route path="/pagamento-retorno" element={<PaymentReturn />} />
        
        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
        <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<Dashboard />} />
        <Route path="/admin-j28s7d1k/storage" element={<AdminStorage />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
        <Route path="/admin-j28s7d1k/orders" element={<AdminOrders />} />
        <Route path="/admin-j28s7d1k/invoices" element={<AdminInvoices />} />
        <Route path="/admin-j28s7d1k/customers" element={<AdminCustomers />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        <Route path="/admin-j28s7d1k/audio-database" element={<AudioDatabase />} />
        <Route path="/admin-j28s7d1k/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin-j28s7d1k/integrations" element={<AdminIntegrations />} />
        
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;
