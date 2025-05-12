
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: "graphics-design",
    name: "Graphics & Design",
    icon: "📱",
    description: "Logos, websites, app design and more",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdyYXBoaWMlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: "📊",
    description: "Build your brand and grow your audience",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "writing-translation",
    name: "Writing & Translation",
    icon: "✍️",
    description: "Engaging content that connects with your audience",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "video-animation",
    name: "Video & Animation",
    icon: "🎬",
    description: "Bring your story to life with video",
    image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5pbWF0aW9ufGVufDB8fDB8fHww"
  },
  {
    id: "music-audio",
    name: "Music & Audio",
    icon: "🎵",
    description: "Original music and professional sound",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "programming-tech",
    name: "Programming & Tech",
    icon: "💻",
    description: "Custom solutions from expert developers",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "business",
    name: "Business",
    icon: "📈",
    description: "Take your business to the next level",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "🏝️",
    description: "Improving quality of life through expertise",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlmZXN0eWxlfGVufDB8fDB8fHww"
  }
];

export default function Categories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
    
    const scrollAmount = 300;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Popular Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find professional services to match every need, from graphic design to digital marketing
          </p>
        </div>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-subtle transition-opacity",
              showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Categories scroll container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide py-8 gap-5 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/services/${category.id}`}
                className="flex-shrink-0 w-[280px] group"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="relative overflow-hidden rounded-xl w-full h-56 shadow-subtle hover-effect">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                  </div>
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-2xl mb-1">{category.icon}</span>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {category.name}
                    </h3>
                    <p className={cn(
                      "text-sm text-white/80 transition-opacity duration-500",
                      hoveredCategory === category.id ? "opacity-100" : "opacity-0"
                    )}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-subtle transition-opacity",
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
