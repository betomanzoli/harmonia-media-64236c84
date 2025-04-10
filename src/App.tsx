
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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/briefing" element={<BriefingForm />} />
        <Route path="/preview-library" element={<PreviewLibrary />} />
        <Route path="/credit-refund-request" element={<CreditRefundRequest />} />
        <Route path="/acompanhar-pedido" element={<OrderTracking />} />
        
        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
        <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<Dashboard />} />
        <Route path="/admin-j28s7d1k/storage" element={<AdminStorage />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/orders" element={<AdminOrders />} />
        <Route path="/admin-j28s7d1k/invoices" element={<AdminInvoices />} />
        <Route path="/admin-j28s7d1k/customers" element={<AdminCustomers />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        <Route path="/admin-j28s7d1k/audio-database" element={<AudioDatabase />} />
        <Route path="/admin-j28s7d1k/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin-j28s7d1k/integrations" element={<AdminIntegrations />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
