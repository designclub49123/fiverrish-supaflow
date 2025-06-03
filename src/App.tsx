
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ServicesPage from "./pages/ServicesPage";
import OrdersPage from "./pages/OrdersPage";
import CreateServicePage from "./pages/CreateServicePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import SavedServicesPage from "./pages/SavedServicesPage";
import BrowseServicesPage from "./pages/BrowseServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import PortfolioPage from "./pages/PortfolioPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<BrowseServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/create" element={<CreateServicePage />} />
            <Route path="services/edit/:id" element={<CreateServicePage />} />
            <Route path="saved" element={<SavedServicesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="browse-services" element={<BrowseServicesPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
