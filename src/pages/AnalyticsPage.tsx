
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, ShoppingCart, TrendingUp, Star, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageRating: number;
  totalReviews: number;
  totalServices: number;
  totalClients: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user is freelancer
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setIsFreelancer(profile.is_freelancer);
        await fetchAnalyticsData(session.user.id, profile.is_freelancer);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (userId: string, userIsFreelancer: boolean) => {
    try {
      if (userIsFreelancer) {
        // Fetch freelancer analytics
        const [ordersData, servicesData, reviewsData] = await Promise.all([
          supabase
            .from('orders')
            .select(`
              *,
              service:services!inner(freelancer_id)
            `)
            .eq('service.freelancer_id', userId),
          
          supabase
            .from('services')
            .select('*')
            .eq('freelancer_id', userId),
            
          supabase
            .from('reviews')
            .select(`
              *,
              service:services!inner(freelancer_id)
            `)
            .eq('service.freelancer_id', userId)
        ]);

        const orders = ordersData.data || [];
        const services = servicesData.data || [];
        const reviews = reviewsData.data || [];

        const totalRevenue = orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.price || 0), 0);

        const completedOrders = orders.filter(order => order.status === 'completed').length;
        const pendingOrders = orders.filter(order => ['pending', 'in_progress'].includes(order.status)).length;

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
          : 0;

        // Get unique clients
        const uniqueClients = new Set(orders.map(order => order.client_id));

        setAnalytics({
          totalRevenue,
          totalOrders: orders.length,
          completedOrders,
          pendingOrders,
          averageRating,
          totalReviews: reviews.length,
          totalServices: services.length,
          totalClients: uniqueClients.size
        });

      } else {
        // Fetch client analytics
        const [ordersData, reviewsData] = await Promise.all([
          supabase
            .from('orders')
            .select('*')
            .eq('client_id', userId),
            
          supabase
            .from('reviews')
            .select('*')
            .eq('client_id', userId)
        ]);

        const orders = ordersData.data || [];
        const reviews = reviewsData.data || [];

        const totalSpent = orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.price || 0), 0);

        const completedOrders = orders.filter(order => order.status === 'completed').length;
        const pendingOrders = orders.filter(order => ['pending', 'in_progress'].includes(order.status)).length;

        setAnalytics({
          totalRevenue: totalSpent,
          totalOrders: orders.length,
          completedOrders,
          pendingOrders,
          averageRating: 0,
          totalReviews: reviews.length,
          totalServices: 0,
          totalClients: 0
        });
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFreelancer ? 'Total Revenue' : 'Total Spent'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {isFreelancer ? 'From completed orders' : 'On completed orders'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completedOrders || 0} completed, {analytics?.pendingOrders || 0} pending
            </p>
          </CardContent>
        </Card>

        {isFreelancer && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.averageRating ? analytics.averageRating.toFixed(1) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {analytics?.totalReviews || 0} reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across {analytics?.totalServices || 0} services
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {!isFreelancer && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalReviews || 0}</div>
              <p className="text-xs text-muted-foreground">
                Reviews provided to freelancers
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
