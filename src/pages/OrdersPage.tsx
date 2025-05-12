import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, Clock, MessageSquare, ShoppingBag, ArrowUpDown, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  client_id: string;
  service_id: string;
  package_id: string | null;
  delivery_date: string | null;
  price: number;
  created_at: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'revision';
  requirements: string | null;
  client?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  service?: {
    title: string;
    images: string[] | null;
  };
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }
        
        setUser(session.user);
        
        // Get user profile to determine if they're a freelancer
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_freelancer')
          .eq('id', session.user.id)
          .single();
        
        setIsFreelancer(profileData?.is_freelancer || false);
        
        // Now fetch orders based on user role
        await fetchOrders(session.user.id, profileData?.is_freelancer || false);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
    setupRealtimeSubscription();
  }, []);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Refresh orders when any changes occur
          const { data: { session } } = supabase.auth.getSession();
          if (session) {
            fetchOrders(session.user.id, isFreelancer);
          }
        }
      )
      .subscribe();
    
    // Reconnection logic
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    
    const reconnect = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(`Attempting to reconnect realtime subscription (${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
          channel.subscribe();
          reconnectAttempts++;
        }, 3000 * Math.pow(2, reconnectAttempts)); // Exponential backoff
      }
    };
    
    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchOrders = async (userId: string, isFreelancer: boolean) => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          client:profiles!client_id(*),
          service:services(*)
        `);
      
      // If user is a freelancer, get orders for services they provide
      // Otherwise, get orders they've placed as a client
      if (isFreelancer) {
        const { data: userServices } = await supabase
          .from('services')
          .select('id')
          .eq('freelancer_id', userId);
        
        if (userServices && userServices.length > 0) {
          const serviceIds = userServices.map(s => s.id);
          query = query.in('service_id', serviceIds);
        } else {
          setOrders([]);
          setFilteredOrders([]);
          setLoading(false);
          return;
        }
      } else {
        query = query.eq('client_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders when dependencies change
  useEffect(() => {
    let result = [...orders];
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.service?.title.toLowerCase().includes(lowerCaseQuery) ||
        order.id.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by status
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }
    
    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredOrders(result);
  }, [orders, searchQuery, activeTab, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSortToggle = () => {
    setSortBy(sortBy === 'newest' ? 'oldest' : 'newest');
  };

  const renderOrderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      case 'revision':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Revision Requested</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isFreelancer ? 'Manage Orders' : 'Your Orders'}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>
              {isFreelancer ? 'Client Orders' : 'Your Purchases'}
            </CardTitle>
            <CardDescription>
              {isFreelancer 
                ? 'View and manage orders from clients' 
                : 'Track and manage your service purchases'}
            </CardDescription>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search orders..." 
                className="pl-9 m-d:w-[200px]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <Button variant="outline" size="icon" onClick={handleSortToggle} title={`Sort by ${sortBy === 'newest' ? 'oldest' : 'newest'} first`}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="revision">Revision</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {loading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-4 p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/5 h-32 md:h-auto bg-muted">
                            <img 
                              src={order.service?.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                              alt={order.service?.title || 'Service'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="p-4 md:p-6 flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  {renderOrderStatus(order.status)}
                                  <span className="text-xs text-muted-foreground">
                                    Order #{order.id.substring(0, 8)}
                                  </span>
                                </div>
                                
                                <h3 className="font-medium mb-1 line-clamp-2">
                                  {order.service?.title || 'Untitled Service'}
                                </h3>
                                
                                <div className="flex items-center gap-2 my-2">
                                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="font-medium">₹{order.price}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    <span>Ordered: {format(new Date(order.created_at), 'MMM d, yyyy')}</span>
                                  </div>
                                  
                                  {order.delivery_date && (
                                    <div className="flex items-center text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      <span>Due: {format(new Date(order.delivery_date), 'MMM d, yyyy')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                {isFreelancer && order.client && (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                      <AvatarImage src={order.client.avatar_url || undefined} />
                                      <AvatarFallback>{order.client.full_name?.[0] || order.client.username?.[0] || 'C'}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{order.client.full_name || order.client.username}</span>
                                  </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm">
                                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                                    <span>Order Details</span>
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                    <span>Message</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {activeTab !== 'all'
                      ? `You don't have any ${activeTab} orders at the moment.`
                      : searchQuery
                        ? 'No orders match your search criteria.'
                        : isFreelancer
                          ? 'You have not received any orders yet. Share your services to attract clients.'
                          : "You haven't placed any orders yet. Browse services to find what you need."}
                  </p>
                  {!isFreelancer && !searchQuery && activeTab === 'all' && (
                    <Button className="mt-4" onClick={() => window.location.href = '/services'}>
                      Browse Services
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
