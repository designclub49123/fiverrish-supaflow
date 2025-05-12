
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Heart, ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SavedService = {
  id: string;
  service_id: string;
  user_id: string;
  created_at: string;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    delivery_time: number;
    images: string[];
    freelancer_id: string;
    freelancer: {
      full_name: string;
      username: string;
      avatar_url: string | null;
    };
    rating: number;
    rating_count: number;
  };
};

export default function SavedServicesPage() {
  const [savedServices, setSavedServices] = useState<SavedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedServices();
  }, []);

  const fetchSavedServices = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be logged in to view saved services.",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('saved_services')
        .select(`
          id,
          service_id,
          user_id,
          created_at,
          service:services (
            id,
            title,
            description,
            price,
            category_id,
            delivery_time,
            images,
            freelancer_id,
            freelancer:profiles (
              full_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get ratings for each service
      const servicesWithRatings = await Promise.all((data || []).map(async (item) => {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('service_id', item.service_id);
          
        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
          return {
            ...item,
            service: {
              ...item.service,
              rating: 0,
              rating_count: 0,
              category: item.service.category_id || 'uncategorized' // Use category_id as category
            }
          };
        }
        
        const ratings = reviewsData.map(review => review.rating).filter(Boolean) as number[];
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0;
          
        return {
          ...item,
          service: {
            ...item.service,
            rating: avgRating,
            rating_count: ratings.length,
            category: item.service.category_id || 'uncategorized' // Use category_id as category
          }
        };
      }));
      
      setSavedServices(servicesWithRatings as SavedService[]);
      
    } catch (error) {
      console.error("Error fetching saved services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your saved services.",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSavedService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSavedServices(prev => prev.filter(service => service.id !== id));
      
      toast({
        title: "Service removed",
        description: "Service has been removed from your saved list.",
      });
      
    } catch (error) {
      console.error("Error removing saved service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove service from saved list.",
      });
    }
  };

  const filteredServices = savedServices.filter(item => 
    item.service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Saved Services</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Saved Services</CardTitle>
          <CardDescription>
            Services you've saved to review later
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved services</h3>
              <p className="text-muted-foreground mb-4">
                You haven't saved any services yet. Browse services and click the heart icon to save them.
              </p>
              <Button asChild>
                <Link to="/services">Browse Services</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredServices.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={item.service.images?.[0] || '/placeholder.svg'} 
                      alt={item.service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium mb-1 hover:text-primary transition-colors">
                          <Link to={`/services/${item.service.id}`}>
                            {item.service.title}
                          </Link>
                        </h3>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSavedService(item.id)}
                          >
                            <Heart className="h-5 w-5 fill-primary text-primary" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <Link to={`/freelancer/${item.service.freelancer_id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarImage src={item.service.freelancer.avatar_url || ""} />
                            <AvatarFallback>{item.service.freelancer.full_name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          {item.service.freelancer.full_name}
                        </Link>
                        
                        <div className="mx-2 text-muted-foreground">•</div>
                        
                        <span className="text-sm text-muted-foreground capitalize">
                          {item.service.category.replace(/-/g, ' ')}
                        </span>
                        
                        {item.service.rating > 0 && (
                          <>
                            <div className="mx-2 text-muted-foreground">•</div>
                            <div className="flex items-center">
                              <span className="text-sm text-amber-500">★</span>
                              <span className="text-sm ml-0.5">
                                {item.service.rating.toFixed(1)}
                              </span>
                              <span className="text-xs text-muted-foreground ml-0.5">
                                ({item.service.rating_count})
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {item.service.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold">${item.service.price}</span>
                        <span className="text-muted-foreground text-sm ml-1">
                          • {item.service.delivery_time} day{item.service.delivery_time !== 1 ? 's' : ''} delivery
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/services/${item.service.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
