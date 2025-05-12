
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ServiceGrid from '@/components/services/ServiceGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function CategoryPage() {
  const { category } = useParams();
  const formattedCategory = category ? category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('category_id', category);
        
      if (error) throw error;
      return data || [];
    },
  });

  const transformedServices = services?.map((service) => ({
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/services">
              <Button variant="ghost" size="sm" className="mb-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to all categories
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{formattedCategory}</h1>
            <p className="text-muted-foreground mt-2">
              Find the best {formattedCategory.toLowerCase()} services for your projects
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse">
                  <div className="bg-muted h-32 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : transformedServices && transformedServices.length > 0 ? (
            <ServiceGrid services={transformedServices} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No services found</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find any services in this category
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
