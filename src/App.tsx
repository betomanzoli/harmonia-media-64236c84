
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/chatbot/ChatbotButton';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPreviews from './pages/admin/AdminPreviews';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import AdminLogin from './pages/admin/AdminLogin';
import ResetPassword from './pages/admin/ResetPassword';

// Import router array for other routes
import additionalRoutes from './routes';

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
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
        <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
        <Route path="/admin-j28s7d1k/reset-password" element={<ResetPassword />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<PreviewProjectPage />} />
        
        {/* Add remaining routes from routes.tsx */}
        {additionalRoutes.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {showChatbot && <ChatbotButton />}
    </>
  );
};

export default App;
