
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, XCircle, MessageSquare, DollarSign } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Order {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'revision';
  price: number;
  created_at: string;
  delivery_date: string | null;
  requirements: string | null;
  client_id: string;
  service: {
    id: string;
    title: string;
    description: string;
    delivery_time: number;
    freelancer_id: string;
  };
  package: {
    id: string;
    name: string;
    description: string;
  } | null;
  client: {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
  freelancer: {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }
    
    setCurrentUserId(session.user.id);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_freelancer')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user data. Please try again.",
      });
      return;
    }
    
    const userIsFreelancer = profile?.is_freelancer || false;
    setIsFreelancer(userIsFreelancer);
    
    fetchOrders(session.user.id, userIsFreelancer);
  };

  const fetchOrders = async (userId: string, userIsFreelancer: boolean) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          service:services(
            id,
            title,
            description,
            delivery_time,
            freelancer_id
          ),
          package:service_packages(
            id,
            name,
            description
          ),
          client:profiles!orders_client_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `);
      
      if (userIsFreelancer) {
        // For freelancers, get orders where they own the service
        const { data: servicesData } = await supabase
          .from('services')
          .select('id')
          .eq('freelancer_id', userId);
        
        if (servicesData && servicesData.length > 0) {
          const serviceIds = servicesData.map(s => s.id);
          query = query.in('service_id', serviceIds);
        } else {
          // No services, so no orders
          setOrders([]);
          setLoading(false);
          return;
        }
      } else {
        // For clients, get orders they placed
        query = query.eq('client_id', userId);
      }
      
      const { data: ordersData, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      // Get freelancer details for each order
      const ordersWithFreelancers = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (order.service?.freelancer_id) {
            const { data: freelancerData } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', order.service.freelancer_id)
              .single();
            
            return {
              ...order,
              freelancer: freelancerData || {
                id: order.service.freelancer_id,
                username: 'Unknown',
                full_name: null,
                avatar_url: null
              }
            };
          }
          return {
            ...order,
            freelancer: {
              id: 'unknown',
              username: 'Unknown',
              full_name: null,
              avatar_url: null
            }
          };
        })
      );
      
      setOrders(ordersWithFreelancers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders. Please try again.",
      });
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any } 
            : order
        )
      );
      
      // Send notification
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (orderToUpdate && currentUserId) {
        const recipientId = isFreelancer ? orderToUpdate.client_id : orderToUpdate.service.freelancer_id;
        const title = `Order status updated to ${newStatus.replace('_', ' ')}`;
        const content = `Order for "${orderToUpdate.service.title}" has been ${newStatus.replace('_', ' ')}.`;
        
        await supabase.from('notifications').insert({
          user_id: recipientId,
          title,
          content,
          is_read: false
        });
      }
      
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  };

  const handleContactButtonClick = (userId: string) => {
    navigate('/dashboard/messages', { state: { contactId: userId } });
  };

  const filterOrdersByStatus = (status: string) => {
    switch (status) {
      case 'active':
        return orders.filter(order => 
          ['pending', 'in_progress', 'revision'].includes(order.status)
        );
      case 'completed':
        return orders.filter(order => order.status === 'completed');
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled');
      default:
        return orders;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'in_progress':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'revision':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'revision':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {isFreelancer ? 'Manage Orders' : 'Your Orders'}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {filterOrdersByStatus('active').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {filterOrdersByStatus('completed').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            <Badge variant="secondary" className="ml-2">
              {filterOrdersByStatus('cancelled').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['active', 'completed', 'cancelled'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabValue === 'active' ? 'Active Orders' : 
                   tabValue === 'completed' ? 'Completed Orders' : 'Cancelled Orders'}
                </CardTitle>
                <CardDescription>
                  {tabValue === 'active' ? 'Orders that are pending, in progress, or in revision' : 
                   tabValue === 'completed' ? 'Successfully delivered orders' : 'Orders that were cancelled'}
                </CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-2" : ""}>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="flex justify-between">
                          <div className="w-1/2">
                            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="h-8 w-24 bg-muted rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filterOrdersByStatus(tabValue).length > 0 ? (
                  <div className="space-y-4">
                    {filterOrdersByStatus(tabValue).map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className={`p-4 ${isMobile ? 'p-3' : 'p-6'}`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <h3 className="font-medium text-lg">{order.service?.title || "Untitled Service"}</h3>
                                <Badge variant={getStatusVariant(order.status)}>
                                  <div className="flex items-center">
                                    {getStatusIcon(order.status)}
                                    <span>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {order.package?.name || "Standard"} Package
                              </p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                                <span className="font-medium">${order.price}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                                <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage 
                                  src={isFreelancer ? order.client?.avatar_url || '' : order.freelancer?.avatar_url || ''} 
                                  alt={isFreelancer ? order.client?.username : order.freelancer?.username} 
                                />
                                <AvatarFallback>
                                  {isFreelancer 
                                    ? (order.client?.full_name?.[0] || order.client?.username?.[0] || 'C').toUpperCase()
                                    : (order.freelancer?.full_name?.[0] || order.freelancer?.username?.[0] || 'F').toUpperCase()
                                  }
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {isFreelancer 
                                    ? (order.client?.full_name || order.client?.username || 'Client')
                                    : (order.freelancer?.full_name || order.freelancer?.username || 'Freelancer')
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {isFreelancer ? 'Client' : 'Freelancer'}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} space-y-2 md:space-y-0 space-x-0 md:space-x-2 items-${isMobile ? 'stretch' : 'center'}`}>
                              <Button 
                                variant="outline" 
                                size={isMobile ? "sm" : "default"}
                                onClick={() => handleContactButtonClick(
                                  isFreelancer ? order.client?.id : order.freelancer?.id || ''
                                )}
                                className="w-full md:w-auto"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                              
                              {/* Action buttons based on role and status */}
                              {isFreelancer ? (
                                order.status === 'pending' ? (
                                  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} space-y-2 md:space-y-0 space-x-0 md:space-x-2`}>
                                    <Button 
                                      size={isMobile ? "sm" : "default"}
                                      onClick={() => updateOrderStatus(order.id, 'in_progress')}
                                      className="w-full md:w-auto"
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size={isMobile ? "sm" : "default"}
                                      variant="outline" 
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      className="w-full md:w-auto"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                ) : order.status === 'in_progress' ? (
                                  <Button 
                                    size={isMobile ? "sm" : "default"}
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="w-full md:w-auto"
                                  >
                                    Mark as Delivered
                                  </Button>
                                ) : order.status === 'revision' ? (
                                  <Button 
                                    size={isMobile ? "sm" : "default"}
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="w-full md:w-auto"
                                  >
                                    Submit Revision
                                  </Button>
                                ) : null
                              ) : (
                                order.status === 'in_progress' ? (
                                  <Button 
                                    size={isMobile ? "sm" : "default"}
                                    variant="outline" 
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="w-full md:w-auto"
                                  >
                                    Cancel Order
                                  </Button>
                                ) : order.status === 'completed' ? (
                                  <Button 
                                    size={isMobile ? "sm" : "default"}
                                    onClick={() => updateOrderStatus(order.id, 'revision')}
                                    className="w-full md:w-auto"
                                  >
                                    Request Revision
                                  </Button>
                                ) : null
                              )}
                            </div>
                          </div>
                          
                          {order.requirements && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Requirements:</h4>
                              <p className="text-sm">{order.requirements}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No {tabValue} orders found</h3>
                    <p className="text-muted-foreground">
                      {tabValue === 'active' 
                        ? "You don't have any active orders at the moment" 
                        : tabValue === 'completed'
                        ? "You don't have any completed orders yet"
                        : "You don't have any cancelled orders"
                      }
                    </p>
                    {!isFreelancer && tabValue === 'active' && (
                      <Button
                        className="mt-4"
                        onClick={() => navigate('/services')}
                      >
                        Browse Services
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
