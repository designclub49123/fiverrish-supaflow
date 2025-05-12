
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  IndianRupee
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, children, className }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "nav-link",
        isActive && "text-foreground after:scale-x-100",
        className
      )}
    >
      {children}
    </Link>
  );
};

const categories = [
  { name: "Graphics & Design", path: "/services/graphics-design" },
  { name: "Digital Marketing", path: "/services/digital-marketing" },
  { name: "Writing & Translation", path: "/services/writing-translation" },
  { name: "Video & Animation", path: "/services/video-animation" },
  { name: "Music & Audio", path: "/services/music-audio" },
  { name: "Programming & Tech", path: "/services/programming-tech" },
  { name: "Business", path: "/services/business" },
  { name: "Lifestyle", path: "/services/lifestyle" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check for user session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription?.unsubscribe();
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-subtle border-border"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-2"
            aria-label="Grew up logo"
          >
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Grew up
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 nav-link">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 grid grid-cols-2 gap-1 p-2">
                {categories.map(category => (
                  <DropdownMenuItem key={category.path} asChild>
                    <Link to={category.path} className="cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <NavLink to="/services">Explore</NavLink>
            <NavLink to="/become-seller">Become a Seller</NavLink>
            
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-52 rounded-full text-sm bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </form>
          </nav>

          {/* Auth buttons or user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="hover:bg-secondary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" className="hover-effect">
                    Join
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/dashboard" className="mr-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                  <AvatarFallback>
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-12 py-2 rounded-full text-sm bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button 
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              Search
            </Button>
          </form>
          
          <nav className="flex flex-col space-y-3">
            <Link to="/services" className="py-2 px-3 rounded-md hover:bg-secondary">
              Explore
            </Link>
            <div className="py-2 px-3 flex justify-between items-center rounded-md hover:bg-secondary">
              <span>Categories</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="ml-4 flex flex-col space-y-2">
              {categories.map(category => (
                <Link key={category.path} to={category.path} className="py-1 px-2 text-sm text-muted-foreground hover:text-foreground">
                  {category.name}
                </Link>
              ))}
            </div>
            <Link to="/become-seller" className="py-2 px-3 rounded-md hover:bg-secondary">
              Become a Seller
            </Link>
          </nav>
          
          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/auth" className="w-full">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth" className="w-full">
                  <Button className="w-full">Join</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
