
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ui/ServiceCard';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function FeaturedServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Fetch actual services from Supabase
  const { data: featuredServices, isLoading } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('is_featured', true)
        .limit(10);
        
      if (error) throw error;
      
      return data?.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        rating: 0, // Default value, would be calculated from reviews
        reviewCount: 0, // Default value, would be calculated from reviews
        deliveryTime: service.delivery_time,
        sellerName: service.profiles?.full_name || service.profiles?.username || 'Unknown',
        sellerAvatar: service.profiles?.avatar_url || 'https://via.placeholder.com/40',
        sellerLevel: 'Level 1', // Placeholder
        imageUrl: service.images && service.images.length > 0 
          ? service.images[0] 
          : 'https://via.placeholder.com/300',
        isFeatured: service.is_featured
      })) || [];
    }
  });

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [featuredServices]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 600;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };
  
  // If no featured services are available, use fallback data
  const fallbackServices = [
    {
      id: "1",
      title: "I will design a modern and professional logo for your business",
      description: "Get a premium logo design that will make your brand stand out and look professional.",
      price: 2500,
      rating: 4.9,
      reviewCount: 342,
      sellerName: "LogoMaster",
      sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
      sellerLevel: "Top Rated",
      imageUrl: "https://images.unsplash.com/photo-1530572767853-84ebaa57c2cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBkZXNpZ258ZW58MHx8MHx8fDA%3D",
      deliveryTime: 3,
      isFeatured: true
    },
    {
      id: "2",
      title: "I will build a responsive website with modern design",
      description: "Get a stunning, mobile-friendly website with the latest web technologies and SEO optimization.",
      price: 12500,
      rating: 4.8,
      reviewCount: 189,
      sellerName: "WebWizard",
      sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
      sellerLevel: "Level 2",
      imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2Vic2l0ZXxlbnwwfHwwfHx8MA%3D%3D",
      deliveryTime: 7,
      isFeatured: true
    },
    {
      id: "3",
      title: "I will create engaging social media content for your brand",
      description: "Boost your social media presence with creative, on-brand content that drives engagement.",
      price: 6000,
      rating: 4.7,
      reviewCount: 156,
      sellerName: "SocialGenius",
      sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
      sellerLevel: "Level 1",
      imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D",
      deliveryTime: 4,
      isFeatured: true
    }
  ];
  
  // Determine which services to display
  const servicesToDisplay = featuredServices?.length ? featuredServices : fallbackServices;

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-3">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl">
              Hand-picked, high-quality services from top-rated professionals.
            </p>
          </div>
          <Link to="/services" className="md:mt-0 mt-4">
            <Button variant="outline" className="hover-effect">
              View All Services
            </Button>
          </Link>
        </div>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              "absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-subtle transition-opacity",
              showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Services container */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide py-4 gap-6 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {servicesToDisplay.map((service) => (
                <div key={service.id} className="flex-shrink-0 w-[300px]">
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          )}

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className={cn(
              "absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-subtle transition-opacity",
              showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
