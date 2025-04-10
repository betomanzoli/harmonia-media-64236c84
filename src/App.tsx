import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStorage from './pages/admin/AdminStorage';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import Login from './pages/admin/Login';
import ResetPassword from './pages/admin/ResetPassword';
import Header from './components/Header';
import Footer from './components/Footer';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Contact from './components/Contact';
import BriefingForm from './components/BriefingForm';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import AudioDatabase from './pages/admin/AudioDatabase';
import PreviewLibrary from './pages/PreviewLibrary';

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

        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/login" element={<Login />} />
        <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-j28s7d1k/storage" element={<AdminStorage />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
        <Route path="/admin-j28s7d1k/orders" element={<AdminOrders />} />
        <Route path="/admin-j28s7d1k/invoices" element={<AdminInvoices />} />
        <Route path="/admin-j28s7d1k/customers" element={<AdminCustomers />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        <Route path="/admin-j28s7d1k/audio-database" element={<AudioDatabase />} />
        <Route path="/preview-library" element={<PreviewLibrary />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
