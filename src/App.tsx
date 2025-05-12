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
import BlogPage from "./pages/BlogPage";
import EventsPage from "./pages/EventsPage";
import ForumPage from "./pages/ForumPage";
import InfluencersPage from "./pages/InfluencersPage";
import CommunityStandardsPage from "./pages/CommunityStandardsPage";
import CategoryPage from "./pages/CategoryPage";
import FindServicesPage from "./pages/FindServicesPage";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<BrowseServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/services/:category" element={<CategoryPage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/find-services" element={<FindServicesPage />} />

          {/* Community Pages */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/influencers" element={<InfluencersPage />} />
          <Route path="/community" element={<CommunityStandardsPage />} />
          
          {/* Other Static Pages */}
          <Route path="/careers" element={<HelpPage title="Careers" />} />
          <Route path="/press" element={<HelpPage title="Press & News" />} />
          <Route path="/partnerships" element={<HelpPage title="Partnerships" />} />
          <Route path="/privacy" element={<HelpPage title="Privacy Policy" />} />
          <Route path="/terms" element={<HelpPage title="Terms of Service" />} />
          <Route path="/help" element={<HelpPage title="Help & Support" />} />
          <Route path="/trust" element={<HelpPage title="Trust & Safety" />} />
          <Route path="/selling" element={<HelpPage title="Selling on Grew up" />} />
          <Route path="/buying" element={<HelpPage title="Buying on Grew up" />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
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
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
