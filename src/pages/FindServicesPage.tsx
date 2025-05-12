
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ServiceGrid from '@/components/services/ServiceGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  { id: "graphics-design", name: "Graphics & Design" },
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "writing-translation", name: "Writing & Translation" },
  { id: "video-animation", name: "Video & Animation" },
  { id: "music-audio", name: "Music & Audio" },
  { id: "programming-tech", name: "Programming & Tech" },
];

export default function FindServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select('*, profiles(username, full_name, avatar_url)');
        
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const filteredServices = services
    ? services
        .filter(service => 
          searchQuery 
            ? service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              service.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        )
        .map(service => ({
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
        }))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Find the perfect service for your needs</h1>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for services..."
                className="pl-10 pr-4 py-6 rounded-full text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Button type="submit" className="absolute right-1 top-1 rounded-full">
                Search
              </Button>
            </form>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-8 flex flex-wrap h-auto p-1">
              <TabsTrigger value="all" className="mb-1">All Categories</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => navigate(`/services/${category.id}`)}
                  className="mb-1"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
                  ))}
                </div>
              ) : filteredServices.length > 0 ? (
                <ServiceGrid services={filteredServices} />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or browse categories
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
