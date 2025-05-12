
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Star, 
  DollarSign, 
  RefreshCw, 
  Calendar, 
  CheckCircle, 
  MessageSquare,
  Heart,
  Share,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  revisions: number;
  images: string[];
  is_featured: boolean;
  created_at: string;
  freelancer_id: string;
  freelancer: {
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
  };
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceDetails();
    checkAuthStatus();
  }, [id]);

  const fetchServiceDetails = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          freelancer:profiles(username, full_name, avatar_url, bio)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setService(data);
      
      // Check if the service is saved by the user
      checkIfSaved(data.id);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load service details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
    if (data.session) {
      setCurrentUserId(data.session.user.id);
    }
  };

  const checkIfSaved = async (serviceId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;
    
    const { data, error } = await supabase
      .from('saved_services')
      .select()
      .eq('user_id', session.user.id)
      .eq('service_id', serviceId);
    
    if (!error && data && data.length > 0) {
      setIsSaved(true);
    }
  };

  const handleSaveService = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save this service",
      });
      navigate('/auth');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !service) return;
    
    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_services')
          .delete()
          .eq('user_id', session.user.id)
          .eq('service_id', service.id);
        
        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Service removed",
          description: "This service has been removed from your saved list.",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_services')
          .insert({
            user_id: session.user.id,
            service_id: service.id,
          });
        
        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Service saved",
          description: "This service has been added to your saved list.",
        });
      }
    } catch (error) {
      console.error('Error saving/unsaving service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save/unsave service. Please try again.",
      });
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact the seller",
      });
      navigate('/auth');
      return;
    }
    
    if (!service || !currentUserId) return;
    
    try {
      // Check if conversation already exists
      const { data: existingChats, error: chatError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .or(`sender_id.eq.${service.freelancer_id},receiver_id.eq.${service.freelancer_id}`);
      
      if (chatError) throw chatError;
      
      // Create initial message to start the conversation
      if (!existingChats || existingChats.length === 0) {
        const { error: msgError } = await supabase
          .from('messages')
          .insert({
            content: `Hi, I'm interested in your service: ${service.title}`,
            sender_id: currentUserId,
            receiver_id: service.freelancer_id,
            is_read: false
          });
        
        if (msgError) throw msgError;
        
        toast({
          title: "Message sent",
          description: "You've started a conversation with the seller.",
        });
      }
      
      // Navigate to messages page
      navigate('/dashboard/messages');
    } catch (error) {
      console.error('Error initiating chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate chat with seller. Please try again.",
      });
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to order this service",
      });
      navigate('/auth');
      return;
    }
    
    if (!service || !currentUserId) return;
    
    try {
      // Create a new order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          service_id: service.id,
          client_id: currentUserId,
          price: service.price,
          status: 'pending',
          requirements: 'No specific requirements provided yet.'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create notification for seller
      await supabase
        .from('notifications')
        .insert({
          user_id: service.freelancer_id,
          title: 'New Order Received',
          content: `You have received a new order for "${service.title}"`
        });
      
      // Send initial message
      await supabase
        .from('messages')
        .insert({
          content: `Hi, I've placed an order for your service: ${service.title}. Order #${order.id}`,
          sender_id: currentUserId,
          receiver_id: service.freelancer_id,
          order_id: order.id,
          is_read: false
        });
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully.",
      });
      
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-16">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 pb-16">
          <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
            <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for may have been removed or doesn't exist.</p>
            <Button onClick={() => navigate('/services')}>Browse Services</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold">{service.title}</h1>
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={service.freelancer?.avatar_url || ''} alt={service.freelancer?.full_name} />
                  <AvatarFallback>
                    {service.freelancer?.full_name?.charAt(0) || service.freelancer?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{service.freelancer?.full_name || service.freelancer?.username}</p>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>5.0</span>
                    <span className="text-muted-foreground ml-1">(24 reviews)</span>
                  </div>
                </div>
              </div>
              
              {/* Service Images */}
              <div className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={service.images && service.images.length > 0 ? service.images[0] : 'https://via.placeholder.com/800x450'} 
                  alt={service.title} 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <Tabs defaultValue="description" className="mt-8">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="about-seller">About The Seller</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4 mt-4">
                  <h2 className="text-xl font-semibold">Service Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{service.description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{service.delivery_time} days delivery</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      <span>{service.revisions} revisions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Source files included</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>100% satisfaction guarantee</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about-seller" className="mt-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={service.freelancer?.avatar_url || ''} alt={service.freelancer?.full_name} />
                      <AvatarFallback className="text-lg">
                        {service.freelancer?.full_name?.charAt(0) || service.freelancer?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{service.freelancer?.full_name || service.freelancer?.username}</h2>
                      <p className="text-primary font-medium">Professional Freelancer</p>
                      <div className="flex items-center text-sm mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>5.0</span>
                        <span className="text-muted-foreground ml-1">(24 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">About Me</h3>
                    <p className="text-muted-foreground">{service.freelancer?.bio || "No bio available."}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-4 rounded-lg text-center flex-shrink-0">
                      <div className="text-4xl font-bold text-primary">5.0</div>
                      <div className="flex items-center justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">24 reviews</div>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      {["Communication", "Service Quality", "Value", "Expertise"].map((category) => (
                        <div key={category} className="flex items-center">
                          <span className="text-sm w-32">{category}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400" fill="#FBBF24" />
                            ))}
                            <span className="text-sm ml-2">5.0</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Reviews will appear here once clients provide feedback on this service.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Pricing & Order */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary mr-1" />
                      <span className="text-2xl font-bold">${service.price}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSaveService}
                        aria-label={isSaved ? "Remove from saved" : "Save service"}
                      >
                        <Heart className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Share">
                        <Share className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{service.description.substring(0, 100)}...</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-2" /> Delivery Time</span>
                      <span className="font-medium">{service.delivery_time} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center"><RefreshCw className="h-4 w-4 mr-2" /> Revisions</span>
                      <span className="font-medium">{service.revisions}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">What you'll get:</h3>
                    <ul className="space-y-1.5">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2" />
                        <span className="text-sm">Complete and ready-to-use deliverable</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2" />
                        <span className="text-sm">Source files included</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2" />
                        <span className="text-sm">Commercial use rights</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <Button className="w-full" onClick={handleOrderNow}>
                      Order Now
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-center text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    <span>Secure payment processed through our platform</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
