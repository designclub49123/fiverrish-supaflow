
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ui/ServiceCard';
import { cn } from '@/lib/utils';

// Mock data - would come from API in real implementation
const featuredServices = [
  {
    id: "1",
    title: "I will design a modern and professional logo for your business",
    description: "Get a premium logo design that will make your brand stand out and look professional.",
    price: 85,
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
    price: 250,
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
    price: 120,
    rating: 4.7,
    reviewCount: 156,
    sellerName: "SocialGenius",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    sellerLevel: "Level 1",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D",
    deliveryTime: 4,
    isFeatured: true
  },
  {
    id: "4",
    title: "I will write SEO-optimized blog content for your website",
    description: "Get professionally written, keyword-rich articles that rank well in search engines.",
    price: 75,
    rating: 4.9,
    reviewCount: 203,
    sellerName: "ContentPro",
    sellerAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww",
    sellerLevel: "Top Rated",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D",
    deliveryTime: 2,
    isFeatured: true
  },
  {
    id: "5",
    title: "I will design a professional UI/UX for your mobile app",
    description: "Create intuitive, user-friendly interfaces that delight your users and enhance user experience.",
    price: 350,
    rating: 4.8,
    reviewCount: 128,
    sellerName: "UXMaster",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    sellerLevel: "Level 2",
    imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dWl8ZW58MHx8MHx8fDA%3D",
    deliveryTime: 10,
    isFeatured: true
  },
  {
    id: "6",
    title: "I will produce professional voiceovers for your videos",
    description: "Get high-quality, studio-recorded voiceovers for commercials, explainers, and more.",
    price: 95,
    rating: 4.9,
    reviewCount: 176,
    sellerName: "VoiceArtist",
    sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    sellerLevel: "Top Rated",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dm9pY2VvdmVyfGVufDB8fDB8fHww",
    deliveryTime: 1,
    isFeatured: true
  }
];

export default function FeaturedServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 600;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

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
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide py-4 gap-6 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredServices.map((service) => (
              <div key={service.id} className="flex-shrink-0 w-[300px]">
                <ServiceCard {...service} />
              </div>
            ))}
          </div>

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
