
import { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import HowItWorks from "./pages/HowItWorks";
import PreviewPage from "./pages/PreviewPage";
import PreviewProjectPage from "./pages/PreviewProjectPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectManagement from "./pages/admin/AdminProjectManagement";
import AdminProtectedRoute from './components/admin/auth/ProtectedRoute';
import AdminPreviews from "./pages/admin/AdminPreviews";
import ProjectEditPage from "./pages/admin/ProjectEditPage";
import Payment from "./pages/Payment";
import Packages from "./pages/Packages";
import PaymentProcessing from "./pages/PaymentProcessing";
import Portfolio from "./pages/Portfolio";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Briefing from "./pages/Briefing";
import OrderTracking from "./pages/OrderTracking";

import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/como-funciona" element={<HowItWorks />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/servicos" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/pacotes" element={<Packages />} />
      <Route path="/pagamento" element={<Payment />} />
      <Route path="/pagamento/:packageId" element={<Payment />} />
      <Route path="/pagamento-processando" element={<PaymentProcessing />} />
      <Route path="/preview/:projectId" element={<PreviewPage />} />
      <Route path="/preview-project/:projectId" element={<PreviewProjectPage />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/termos" element={<Terms />} />
      <Route path="/briefing" element={<Briefing />} />
      <Route path="/acompanhar-pedido" element={<OrderTracking />} />

      {/* Admin Routes */}
      <Route path="/admin-j28s7d1k" element={<AdminLogin />} />
      <Route
        path="/admin-j28s7d1k/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-j28s7d1k/projects"
        element={
          <AdminProtectedRoute>
            <AdminProjects />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-j28s7d1k/projects/:projectId"
        element={
          <AdminProtectedRoute>
            <AdminProjectManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-j28s7d1k/previews"
        element={
          <AdminProtectedRoute>
            <AdminPreviews />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-j28s7d1k/previews/:projectId"
        element={
          <AdminProtectedRoute>
            <PreviewProjectPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-j28s7d1k/previews/edit/:projectId"
        element={
          <AdminProtectedRoute>
            <ProjectEditPage />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
