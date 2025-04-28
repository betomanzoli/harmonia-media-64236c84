
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import router from './routes';

// Helper components
import ScrollToTop from './components/ScrollToTop';
import ChatbotButton from './components/chatbot/ChatbotButton';

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
        {router.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      
      {showChatbot && <ChatbotButton />}
    </>
  );
};

export default App;
