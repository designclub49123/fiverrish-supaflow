
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Search, ArrowUpDown, DollarSign, Clock } from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function BrowseServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [deliveryTime, setDeliveryTime] = useState('any');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [selectedCategory, sortBy, priceRange, deliveryTime]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          profiles(username, full_name, avatar_url)
        `);
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      // Apply price range filter
      if (priceRange === 'under_25') {
        query = query.lt('price', 25);
      } else if (priceRange === '25_to_50') {
        query = query.gte('price', 25).lt('price', 50);
      } else if (priceRange === '50_to_100') {
        query = query.gte('price', 50).lt('price', 100);
      } else if (priceRange === 'over_100') {
        query = query.gte('price', 100);
      }
      
      // Apply delivery time filter
      if (deliveryTime === 'express_24h') {
        query = query.lte('delivery_time', 1);
      } else if (deliveryTime === 'up_to_3_days') {
        query = query.lte('delivery_time', 3);
      } else if (deliveryTime === 'up_to_7_days') {
        query = query.lte('delivery_time', 7);
      }
      
      // Apply sorting
      if (sortBy === 'price_low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price_high') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        // Default recommended sorting (we'd use a more complex algorithm in a real app)
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match the Service interface
      const transformedServices: Service[] = data.map((service: any) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        rating: 0, // Default value, would be calculated from reviews
        deliveryTime: service.delivery_time,
        reviewCount: 0, // Default value, would be calculated from reviews
        imageUrl: service.images && service.images.length > 0 
          ? service.images[0] 
          : 'https://via.placeholder.com/300',
        sellerName: service.profiles?.full_name || service.profiles?.username || 'Unknown',
        sellerAvatar: service.profiles?.avatar_url || 'https://via.placeholder.com/40',
        sellerLevel: 'Level 1', // Placeholder
        isFeatured: service.is_featured
      }));
      
      // Apply search filter client-side for flexibility
      const filteredServices = searchQuery 
        ? transformedServices.filter(service => 
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : transformedServices;
        
      setServices(filteredServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce would be implemented in a real app
    fetchServices();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Services</h1>
          <p className="text-muted-foreground mt-1">Explore services from our talented freelancers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under_25">Under $25</SelectItem>
                    <SelectItem value="25_to_50">$25 to $50</SelectItem>
                    <SelectItem value="50_to_100">$50 to $100</SelectItem>
                    <SelectItem value="over_100">Over $100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Delivery Time</h3>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="express_24h">Express 24 Hours</SelectItem>
                    <SelectItem value="up_to_3_days">Up to 3 Days</SelectItem>
                    <SelectItem value="up_to_7_days">Up to 7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search services..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-4 w-2/5" />
                      <Skeleton className="h-10 w-full mt-2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : services.length > 0 ? (
              <ServiceGrid services={services} />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-lg font-medium mb-2">No services found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
