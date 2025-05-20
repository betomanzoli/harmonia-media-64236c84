import { createBrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBriefings from "./pages/admin/AdminBriefings";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminClients from "./pages/admin/AdminClients";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminStorage from "./pages/admin/AdminStorage";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminMarketingLeads from "./pages/admin/AdminMarketingLeads";
import AdminPreviews from "./pages/admin/AdminPreviews";
import Descobrir from "./pages/Descobrir";
import HomePage from "./pages/HomePage";

// Create placeholder components for missing pages until they are implemented
const MainLayout = ({ children }) => <div>{children}</div>;
const AuthLayout = ({ children }) => <div>{children}</div>;
const NotFound = () => <div>Page Not Found</div>;
const Pricing = () => <div>Pricing Page</div>;
const Contact = () => <div>Contact Page</div>;
const About = () => <div>About Page</div>;
const Terms = () => <div>Terms Page</div>;
const Privacy = () => <div>Privacy Page</div>;
const Faq = () => <div>FAQ Page</div>;
const Services = () => <div>Services Page</div>;
const Examples = () => <div>Examples Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const ResetPassword = () => <div>Reset Password Page</div>;
const AdminMarketing = () => <div>Admin Marketing Page</div>;

const router = createBrowserRouter([
  {
    element: <HelmetProvider><MainLayout>Main Layout Content</MainLayout></HelmetProvider>,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
    element: <AuthLayout>Auth Layout Content</AuthLayout>,
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
    element: <AdminLayout>Admin Layout Content</AdminLayout>,
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
