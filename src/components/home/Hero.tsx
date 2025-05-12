
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const popularSearches = [
  "Website Design",
  "Logo Design",
  "AI Services",
  "Copywriting",
  "Video Editing",
];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  
  const backgroundImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2342&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2574&auto=format&fit=crop",
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsVisible(true);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality when integrated with backend
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="relative min-h-[600px] sm:min-h-[700px] flex items-center overflow-hidden">
      {/* Background images with transition */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              index === currentBackgroundIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 md:pt-16">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 bg-primary/10 border border-primary/20 rounded-full">
            <p className="text-sm font-medium text-primary">Trusted by over 3 million customers</p>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Find the perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">freelance services</span> for your business
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Connect with talented freelancers offering services across diverse categories to help grow your business.
          </p>
          
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  className="pl-12 pr-4 py-3 w-full rounded-l-full border-y border-l border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/auth">
                <Button 
                  type="button" 
                  className="rounded-r-full px-6 hover-effect"
                >
                  Search
                </Button>
              </Link>
            </div>
          </form>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {popularSearches.map((term, index) => (
              <Link
                key={index}
                to="/auth"
                className="px-3 py-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
