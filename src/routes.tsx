import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { Pricing } from "@/pages/Pricing";
import { Contact } from "@/pages/Contact";
import { About } from "@/pages/About";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { NotFound } from "@/pages/NotFound";
import { Faq } from "@/pages/Faq";
import { Services } from "@/pages/Services";
import { Examples } from "@/pages/Examples";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBriefings from "@/pages/admin/AdminBriefings";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminClients from "@/pages/admin/AdminClients";
import AdminInvoices from "@/pages/admin/AdminInvoices";
import AdminStorage from "@/pages/admin/AdminStorage";
import AdminStatistics from "@/pages/admin/AdminStatistics";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminIntegrations from "@/pages/admin/AdminIntegrations";
import AdminGuides from "@/pages/admin/AdminGuides";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { HelmetProvider } from "react-helmet-async";
import Descobrir from "./pages/Descobrir";
import AdminMarketingLeads from "./pages/admin/AdminMarketingLeads";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminPreviews from "./pages/admin/AdminPreviews";

const router = createBrowserRouter([
  {
    element: <HelmetProvider><MainLayout /></HelmetProvider>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/precos",
        element: <Pricing />,
      },
      {
        path: "/contato",
        element: <Contact />,
      },
      {
        path: "/sobre",
        element: <About />,
      },
      {
        path: "/termos",
        element: <Terms />,
      },
      {
        path: "/privacidade",
        element: <Privacy />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/servicos",
        element: <Services />,
      },
      {
        path: "/exemplos",
        element: <Examples />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/descobrir",
        element: <Descobrir />
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin-j28s7d1k/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin-j28s7d1k/briefings",
        element: <AdminBriefings />,
      },
      {
        path: "/admin-j28s7d1k/projects",
        element: <AdminProjects />,
      },
      {
        path: "/admin-j28s7d1k/portfolio",
        element: <AdminPortfolio />,
      },
      {
        path: "/admin-j28s7d1k/clients",
        element: <AdminClients />,
      },
      {
        path: "/admin-j28s7d1k/invoices",
        element: <AdminInvoices />,
      },
      {
        path: "/admin-j28s7d1k/storage",
        element: <AdminStorage />,
      },
      {
        path: "/admin-j28s7d1k/statistics",
        element: <AdminStatistics />,
      },
      {
        path: "/admin-j28s7d1k/settings",
        element: <AdminSettings />,
      },
      {
        path: "/admin-j28s7d1k/integrations",
        element: <AdminIntegrations />,
      },
      {
        path: "/admin-j28s7d1k/guides",
        element: <AdminGuides />,
      },
      {
        path: "/admin-j28s7d1k/marketing/leads",
        element: <AdminMarketingLeads />
      },
      {
        path: "/admin-j28s7d1k/marketing",
        element: <AdminMarketing />
      },
      {
        path: "/admin-j28s7d1k/previews",
        element: <AdminPreviews />
      },
    ],
  },
]);

export default router;
