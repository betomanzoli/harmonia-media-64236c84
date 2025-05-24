import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas principais
import HomePage from './pages/HomePage';
import BriefingChatbot from './pages/briefing/BriefingChatbot';
import BriefingEssencial from './pages/briefing/BriefingEssencial';
import BriefingProfissional from './pages/briefing/BriefingProfissional';
import BriefingPremium from './pages/briefing/BriefingPremium';
import Payment from './pages/Payment';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPreviews from './pages/admin/AdminPreviews';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1 pt-16">
        <Routes>
          {/* Fluxo Principal */}
          <Route path="/" element={<HomePage />} />
          <Route path="/briefing" element={<BriefingChatbot />} />
          
          {/* Briefings Pós-Pagamento */}
          <Route path="/briefing/essencial" element={<BriefingEssencial />} />
          <Route path="/briefing/profissional" element={<BriefingProfissional />} />
          <Route path="/briefing/premium" element={<BriefingPremium />} />
          
          {/* Pagamento */}
          <Route path="/payment" element={<Payment />} />
          
          {/* Admin */}
          <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
          <Route path="/admin-j28s7d1k/projects" element={<AdminProjects />} />
          <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
