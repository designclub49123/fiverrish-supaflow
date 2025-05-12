import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit, Star, ArrowUpDown, DollarSign } from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  deliveryTime: number;
  reviewCount: number;
  imageUrl: string;
  sellerName: string;
  sellerAvatar: string;
  sellerLevel: string;
  isFeatured?: boolean;
}

export default function ServicesPage() {
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserServices();
  }, []);

  const fetchUserServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      const { data: servicesData, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles(username, full_name, avatar_url)
        `)
        .eq('freelancer_id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      const transformedServices: Service[] = servicesData.map((service: any) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        rating: 0,
        deliveryTime: service.delivery_time,
        reviewCount: 0,
        imageUrl: service.images && service.images.length > 0 
          ? service.images[0] 
          : 'https://via.placeholder.com/300',
        sellerName: service.profiles?.full_name || service.profiles?.username || 'Unknown',
        sellerAvatar: service.profiles?.avatar_url || 'https://via.placeholder.com/40',
        sellerLevel: 'Level 1',
        isFeatured: service.is_featured
      }));
      
      setUserServices(transformedServices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your services. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setUserServices(prev => prev.filter(service => service.id !== id));
      
      toast({
        title: "Service deleted",
        description: "Your service has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
    }
  };

  const handleEditService = (id: string) => {
    navigate(`/dashboard/services/edit/${id}`);
  };

  const sortedServices = () => {
    let sorted = [...userServices];
    
    if (searchQuery) {
      sorted = sorted.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (sortBy) {
      case 'newest':
        return sorted;
      case 'oldest':
        return sorted.reverse();
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      default:
        return sorted;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
        <Button onClick={() => navigate('/dashboard/services/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle>Manage Your Services</CardTitle>
              <CardDescription>
                View, edit or delete your services
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search services..." 
                  className="pl-9 w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse">
                  <div className="bg-muted h-32 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded mt-4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : userServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedServices().map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium truncate">{service.title}</h3>
                    <div className="flex items-center space-x-1 mt-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{service.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({service.reviewCount})</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Starting at ${service.price}</span>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditService(service.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">You haven't created any services yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first service to start offering your skills to clients
              </p>
              <Button onClick={() => navigate('/dashboard/services/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
