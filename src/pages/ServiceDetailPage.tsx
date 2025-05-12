
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RazorpayButton } from "@/components/ui/RazorpayButton";
import { toast } from '@/components/ui/use-toast';
import { 
  Check, 
  Clock, 
  Calendar, 
  MessageSquare,
  Heart, 
  Share2, 
  Star, 
  IndianRupee,
  ChevronRight 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { format } from 'date-fns';

interface Service {
  id: string;
  freelancer_id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  revisions: number;
  images: string[];
  created_at: string;
  is_featured: boolean;
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles(username, full_name, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setService(data);
        checkIfServiceIsSaved(data.id);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load service details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id]);
  
  const checkIfServiceIsSaved = async (serviceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const { data, error } = await supabase
        .from('saved_services')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('service_id', serviceId)
        .maybeSingle();
      
      if (error) throw error;
      
      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved service:', error);
    }
  };
  
  const toggleSaveService = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save services.",
        });
        return;
      }
      
      if (!service) return;
      
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
          title: "Removed from saved",
          description: "Service has been removed from your saved items.",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_services')
          .insert({
            user_id: session.user.id,
            service_id: service.id
          });
        
        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Saved",
          description: "Service has been added to your saved items.",
        });
      }
    } catch (error) {
      console.error('Error toggling saved service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service. Please try again.",
      });
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.title || 'Check out this service',
        text: service?.description || 'I found this great service on Grew up',
        url: window.location.href,
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Service link has been copied to your clipboard.",
      });
    }
  };
  
  const handleContactSeller = () => {
    // Implementation would depend on your messaging system
    toast({
      title: "Contact initiated",
      description: "You can now chat with the seller in your messages.",
    });
  };
  
  // Package pricing tiers - in a real app, this would come from the database
  const packages = {
    basic: {
      name: 'Basic',
      price: service?.price || 0,
      deliveryTime: service?.delivery_time || 3,
      revisions: service?.revisions || 1,
      features: [
        'Standard quality service',
        'Delivery within the specified timeframe',
        'Basic revisions as specified'
      ]
    },
    standard: {
      name: 'Standard',
      price: (service?.price || 0) * 1.5,
      deliveryTime: Math.max(1, (service?.delivery_time || 3) - 1),
      revisions: (service?.revisions || 1) + 1,
      features: [
        'Higher quality service',
        'Faster delivery time',
        'More revision rounds',
        'Priority support'
      ]
    },
    premium: {
      name: 'Premium',
      price: (service?.price || 0) * 2.5,
      deliveryTime: Math.max(1, (service?.delivery_time || 3) - 2),
      revisions: (service?.revisions || 1) + 3,
      features: [
        'Premium quality service',
        'Express delivery',
        'Unlimited revisions',
        'Priority support',
        'Additional extras and customizations'
      ]
    }
  };
  
  const selectedPackageData = packages[selectedPackage as keyof typeof packages];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-72 w-full rounded-lg" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-72 w-full rounded-lg" />
              </div>
            </div>
          ) : service ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Service images */}
                <div className="rounded-lg overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={service.images[0]} 
                      alt={service.title}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="bg-muted h-72 flex items-center justify-center">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )}
                </div>
                
                {/* Service title and meta */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 items-center text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">0</span>
                      <span className="text-muted-foreground ml-1">(0 reviews)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>
                        {service.delivery_time} day{service.delivery_time !== 1 ? 's' : ''} delivery
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>
                        Since {format(new Date(service.created_at), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Seller info */}
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {service.profiles?.full_name?.[0] || service.profiles?.username?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">
                      {service.profiles?.full_name || service.profiles?.username || 'Unknown Seller'}
                    </h3>
                    <p className="text-sm text-muted-foreground">Level 1 Seller</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleContactSeller}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Seller
                    </Button>
                  </div>
                </div>
                
                {/* Service description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">About This Service</h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {service.description}
                  </div>
                </div>
                
                {/* What you'll get section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">What You'll Get</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>High-quality delivery tailored to your requirements</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{service.delivery_time} day delivery</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{service.revisions} revision{service.revisions !== 1 ? 's' : ''}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>100% satisfaction guarantee</span>
                    </li>
                  </ul>
                </div>
                
                {/* Reviews section - placeholder for now */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Reviews</h2>
                    <Button variant="outline" size="sm">
                      See All Reviews
                    </Button>
                  </div>
                  
                  <div className="text-center py-8 border rounded-lg">
                    <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-lg font-medium mb-1">No Reviews Yet</p>
                    <p className="text-muted-foreground">
                      This service doesn't have any reviews yet. Be the first to try it!
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Pricing sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="overflow-hidden">
                    <Tabs defaultValue="basic" value={selectedPackage} onValueChange={setSelectedPackage}>
                      <TabsList className="grid grid-cols-3 mb-0">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="standard">Standard</TabsTrigger>
                        <TabsTrigger value="premium">Premium</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value={selectedPackage} className="p-6 space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <IndianRupee className="h-5 w-5 mr-1" />
                            <span className="text-2xl font-bold">
                              {selectedPackageData.price.toFixed(0)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {selectedPackageData.name} Package
                          </p>
                        </div>
                        
                        <p className="text-sm">
                          {selectedPackageData.name === 'Basic' 
                            ? service.description.substring(0, 120) + (service.description.length > 120 ? '...' : '')
                            : selectedPackageData.name === 'Standard'
                              ? 'Enhanced version with faster delivery and more revisions.'
                              : 'Premium service with all features and highest priority.'}
                        </p>
                        
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>
                            {selectedPackageData.deliveryTime} day{selectedPackageData.deliveryTime !== 1 ? 's' : ''} delivery
                          </span>
                        </div>
                        
                        <ul className="space-y-2">
                          {selectedPackageData.features.map((feature, index) => (
                            <li key={index} className="flex text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="pt-4 space-y-3">
                          <RazorpayButton 
                            amount={selectedPackageData.price} 
                            productName={service.title}
                            productDescription={`${selectedPackageData.name} Package - ${service.title}`}
                            buttonText="Order Now"
                            className="w-full"
                          />
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              className="flex-1" 
                              onClick={toggleSaveService}
                            >
                              <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                              {isSaved ? 'Saved' : 'Save'}
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleShare}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The service you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.location.href = '/services'}>
                Browse Services
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
