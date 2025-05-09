
import { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import BriefingPage from "./pages/BriefingPage";
import ContactPage from "./pages/ContactPage";
import LogoCreationPage from "./pages/LogoCreationPage";
import BrandingServicePage from "./pages/BrandingServicePage";
import PreviewPage from "./pages/PreviewPage";
import PreviewProjectPage from "./pages/PreviewProjectPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectManagement from "./pages/admin/AdminProjectManagement";
import AdminProtectedRoute from './components/admin/auth/ProtectedRoute';
import AdminPreviews from "./pages/admin/AdminPreviews";
import ProjectEditPage from "./pages/admin/ProjectEditPage";

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
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/logo-creation" element={<LogoCreationPage />} />
      <Route path="/services/branding" element={<BrandingServicePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/briefing" element={<BriefingPage />} />
      <Route path="/preview/:projectId" element={<PreviewPage />} />
      <Route path="/preview-project/:projectId" element={<PreviewProjectPage />} />

      {/* Admin Routes */}
      <Route path="/admin-j28s7d1k" element={<AdminLogin />} />
      <Route
        path="/admin-j28s7d1k/dashboard"
        element={<AdminProtectedRoute component={AdminDashboard} />}
      />
      <Route
        path="/admin-j28s7d1k/projects"
        element={<AdminProtectedRoute component={AdminProjects} />}
      />
      <Route
        path="/admin-j28s7d1k/projects/:projectId"
        element={<AdminProtectedRoute component={AdminProjectManagement} />}
      />
      <Route
        path="/admin-j28s7d1k/previews"
        element={<AdminProtectedRoute component={AdminPreviews} />}
      />
      <Route
        path="/admin-j28s7d1k/previews/:projectId"
        element={<AdminProtectedRoute component={PreviewProjectPage} />}
      />
      <Route
        path="/admin-j28s7d1k/previews/edit/:projectId"
        element={<AdminProtectedRoute component={ProjectEditPage} />}
      />
    </Routes>
  );
}

export default App;
