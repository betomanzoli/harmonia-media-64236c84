import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas principais
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PortfolioPage from './pages/Portfolio';
import Briefing from './pages/Briefing';
import Payment from './pages/Payment';

// Contratos
import ContractEssencial from './pages/contract/essencial';
import ContractProfissional from './pages/contract/profissional';
import ContractPremium from './pages/contract/premium';

// Payment
import PaymentSuccess from './pages/payment/success';
import PaymentCancel from './pages/payment/cancel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/payment" element={<Payment />} />
          
          <Route path="/contract/essencial" element={<ContractEssencial />} />
          <Route path="/contract/profissional" element={<ContractProfissional />} />
          <Route path="/contract/premium" element={<ContractPremium />} />
          
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
