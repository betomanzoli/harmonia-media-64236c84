
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PreviewPage from './pages/PreviewPage';
import MusicPreviewPage from './pages/MusicPreviewPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminSettings from './pages/admin/AdminSettings';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';

// Helper components
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/chatbot/ChatbotButton';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(true);
  
  // Check if current route is an admin route
  useEffect(() => {
    const isAdminRoute = location.pathname.includes('/admin-');
    setShowChatbot(!isAdminRoute);
  }, [location.pathname]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/music-preview/:projectId" element={<MusicPreviewPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-j28s7d1k/projects" element={<AdminProjects />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {showChatbot && <ChatbotButton />}
    </>
  );
};

export default App;
