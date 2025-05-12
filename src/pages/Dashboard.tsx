import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, TrendingUp, Clock, DollarSign, ShoppingBag, Star, ArrowRight, BarChart4, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import FreelancerOnboarding from '@/components/onboarding/FreelancerOnboarding';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  is_freelancer: boolean;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  price: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingMessages: 0,
    serviceCount: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        setProfile(profileData);
        
        if (profileData.is_freelancer) {
          let progress = 0;
          
          if (profileData.full_name && profileData.bio) progress += 33;
          
          const { count: skillCount } = await supabase
            .from('freelancer_skills')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', session.user.id);
            
          if (skillCount && skillCount > 0) progress += 33;
          
          const { count: paymentCount } = await supabase
            .from('payment_methods')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);
            
          if (paymentCount && paymentCount > 0) progress += 34;
          
          setOnboardingProgress(progress);
          
          if (progress < 100) {
            setShowOnboarding(true);
          }
          
          const { count: serviceCount } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('freelancer_id', session.user.id);
            
          const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('client_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(5);
            
          setRecentOrders(ordersData || []);
          
          const { data: activeOrdersData, count: activeOrdersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('status', 'active');
            
          const { data: completedOrdersData, count: completedOrdersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('status', 'completed');
            
          const { data: earningsData } = await supabase
            .from('orders')
            .select('price')
            .eq('status', 'completed');
            
          const totalEarnings = earningsData?.reduce((sum, order) => sum + (parseFloat(order.price.toString()) || 0), 0) || 0;
          
          const { data: ratingsData } = await supabase
            .from('reviews')
            .select('rating');
            
          const averageRating = ratingsData?.length 
            ? ratingsData.reduce((sum, review) => sum + (review.rating || 0), 0) / ratingsData.length
            : 0;
            
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', session.user.id)
            .eq('is_read', false);
            
          setStats({
            activeOrders: activeOrdersCount || 0,
            completedOrders: completedOrdersCount || 0,
            totalEarnings,
            averageRating,
            pendingMessages: unreadCount || 0,
            serviceCount: serviceCount || 0
          });
        } else {
          const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('client_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(5);
            
          setRecentOrders(ordersData || []);
          
          const { count: activeOrdersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', session.user.id)
            .eq('status', 'active');
            
          const { count: completedOrdersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', session.user.id)
            .eq('status', 'completed');
            
          const { data: spentData } = await supabase
            .from('orders')
            .select('price')
            .eq('client_id', session.user.id);
            
          const totalSpent = spentData?.reduce((sum, order) => sum + (parseFloat(order.price.toString()) || 0), 0) || 0;
          
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', session.user.id)
            .eq('is_read', false);
            
          const { count: savedCount } = await supabase
            .from('saved_services')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);
            
          setStats({
            activeOrders: activeOrdersCount || 0,
            completedOrders: completedOrdersCount || 0,
            totalEarnings: totalSpent,
            averageRating: 0,
            pendingMessages: unreadCount || 0,
            serviceCount: savedCount || 0
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (showOnboarding && profile?.is_freelancer) {
    return <FreelancerOnboarding />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your {profile?.is_freelancer ? 'freelance services' : 'activity'}
          </p>
        </div>
        
        {profile?.is_freelancer ? (
          <Link to="/dashboard/services/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Service
            </Button>
          </Link>
        ) : (
          <Link to="/services">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Services
            </Button>
          </Link>
        )}
      </div>
      
      {profile?.is_freelancer && onboardingProgress < 100 && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Complete your profile to start selling</h2>
                <p className="text-sm text-muted-foreground">
                  Your profile is {onboardingProgress}% complete. Finish the remaining steps to start selling.
                </p>
                <Progress value={onboardingProgress} className="h-2 w-full md:w-60" />
              </div>
              <Button onClick={() => setShowOnboarding(true)}>
                Continue Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeOrders > 0 
                ? `${stats.activeOrders} order${stats.activeOrders > 1 ? 's' : ''} in progress` 
                : 'No active orders'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.is_freelancer ? 'Orders delivered' : 'Purchases made'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {profile?.is_freelancer ? 'Total Earnings' : 'Total Spent'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.is_freelancer 
                ? 'Your lifetime earnings' 
                : 'Total amount spent on services'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {profile?.is_freelancer ? 'Average Rating' : 'Saved Services'}
            </CardTitle>
            {profile?.is_freelancer 
              ? <Star className="h-4 w-4 text-muted-foreground" />
              : <BarChart4 className="h-4 w-4 text-muted-foreground" />
            }
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.is_freelancer 
                ? stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'
                : stats.serviceCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.is_freelancer 
                ? stats.averageRating > 0 ? 'Based on client reviews' : 'No reviews yet'
                : `${stats.serviceCount} service${stats.serviceCount !== 1 ? 's' : ''} saved`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-start gap-4 py-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm font-medium">${parseFloat(order.price.toString()).toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : order.status === 'active'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">No orders yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.is_freelancer 
                    ? 'Create services to start receiving orders.' 
                    : 'Browse services to place your first order.'}
                </p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/orders')}>
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile?.is_freelancer ? (
                <>
                  <Link to="/dashboard/services/create">
                    <Button variant="outline" className="w-full justify-start">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Service
                    </Button>
                  </Link>
                  <Link to="/dashboard/orders">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      Manage Orders
                    </Button>
                  </Link>
                  <Link to="/dashboard/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Check Messages
                    </Button>
                  </Link>
                  <Link to="/dashboard/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/services">
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Browse Services
                    </Button>
                  </Link>
                  <Link to="/dashboard/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Check Messages
                    </Button>
                  </Link>
                  <Link to="/dashboard/orders">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      Track Orders
                    </Button>
                  </Link>
                  <Link to="/dashboard/saved">
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="mr-2 h-4 w-4" />
                      Saved Services
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
