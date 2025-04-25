
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import PortfolioPage from './pages/Portfolio';
import Calculator from './pages/Calculator';
import MusicPreviews from './pages/MusicPreviews';
import PreviewPage from './pages/PreviewPage';
import MusicPreviewPage from './pages/MusicPreviewPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBriefingsPage from './pages/admin/AdminBriefingsPage';
import AdminPreviewsPage from './pages/admin/AdminPreviewsPage';
import AdminBriefingPage from './pages/admin/BriefingPage';
import AdminPreviewProjectPage from './pages/admin/PreviewProjectPage';
import FeedbackConfirmation from './components/previews/feedback/FeedbackConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/calculadora" element={<Calculator />} />
        <Route path="/previa/:previewId" element={<MusicPreviews />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/music-preview/:projectId" element={<MusicPreviewPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/login" element={<AdminLoginPage />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefingsPage />} />
        <Route path="/admin-j28s7d1k/briefing/:briefingId" element={<AdminBriefingPage />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviewsPage />} />
        <Route path="/admin-j28s7d1k/preview/:projectId" element={<AdminPreviewProjectPage />} />
        
        {/* Feedback Confirmation Route */}
        <Route path="/feedback-confirmacao" element={<FeedbackConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
