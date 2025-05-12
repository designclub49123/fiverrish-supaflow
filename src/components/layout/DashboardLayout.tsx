
import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  Bell,
  Home,
  LogOut,
  Mail,
  Settings,
  User,
  FileText,
  PlusCircle,
  BarChart,
  ListOrdered,
  Briefcase,
  HelpCircle,
  Search,
  Menu,
  X
} from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  role: 'client' | 'freelancer';
  is_freelancer: boolean;
}

export default function DashboardLayout() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/signin');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile. Please try again.",
        });
        setLoading(false);
        return;
      }
      
      setProfile(data);
      setLoading(false);
    };
    
    fetchProfile();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth/signin');
      }
      if (event === 'SIGNED_IN' && !profile) {
        fetchProfile();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };
  
  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-[300px]">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-4 w-4/5 rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // If no profile, redirect to auth
  if (!profile) {
    navigate('/auth/signin');
    return null;
  }
  
  // Different menu items based on user role
  const getDashboardMenuItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Mail, label: 'Messages', path: '/dashboard/messages' },
      { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' }
    ];
    
    const clientItems = [
      { icon: Search, label: 'Find Services', path: '/services' },
      { icon: ListOrdered, label: 'My Orders', path: '/dashboard/orders' },
      { icon: Briefcase, label: 'Saved Services', path: '/dashboard/saved' }
    ];
    
    const freelancerItems = [
      { icon: FileText, label: 'My Services', path: '/dashboard/services' },
      { icon: ListOrdered, label: 'Orders', path: '/dashboard/orders' },
      { icon: PlusCircle, label: 'Create Service', path: '/dashboard/services/create' },
      { icon: BarChart, label: 'Analytics', path: '/dashboard/analytics' }
    ];
    
    return [
      ...commonItems,
      ...(profile.is_freelancer ? freelancerItems : clientItems)
    ];
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Dashboard Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="px-6 py-5 flex flex-col items-center text-center border-b border-border">
            <Link to="/" className="mb-5">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Fiverrish
              </span>
            </Link>
            
            <div className="w-full">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                <AvatarFallback className="text-lg">
                  {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="font-medium text-foreground">{profile.full_name}</h3>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                  {profile.is_freelancer ? 'Freelancer' : 'Client'}
                </span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-6">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {getDashboardMenuItems().map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path} className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/settings">
                        <Settings className="h-5 w-5 mr-3" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/help">
                        <HelpCircle className="h-5 w-5 mr-3" />
                        <span>Help & Support</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={handleSignOut}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="px-6 py-4 text-xs text-center text-muted-foreground border-t border-border">
            <p>© {new Date().getFullYear()} Fiverrish</p>
            <p className="mt-1">Version 1.0.0</p>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top navbar for mobile */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden px-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Fiverrish
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg z-40">
                <nav className="p-4">
                  <div className="flex flex-col space-y-3">
                    {getDashboardMenuItems().map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.path}
                        className="flex items-center py-2 px-3 rounded-md hover:bg-secondary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t border-border pt-3 mt-3">
                      <Link 
                        to="/dashboard/settings"
                        className="flex items-center py-2 px-3 rounded-md hover:bg-secondary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        <span>Settings</span>
                      </Link>
                      <Link 
                        to="/dashboard/help"
                        className="flex items-center py-2 px-3 rounded-md hover:bg-secondary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <HelpCircle className="h-5 w-5 mr-3" />
                        <span>Help & Support</span>
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full text-left text-destructive"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </header>
          
          <main className="flex-1 p-6">
            <SidebarTrigger className="hidden lg:block float-left mr-4 mb-4" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
