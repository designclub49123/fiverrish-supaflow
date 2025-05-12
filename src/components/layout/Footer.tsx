
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ChevronUp,
  Globe
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const categories = [
    { name: "Graphics & Design", path: "/services/graphics-design" },
    { name: "Digital Marketing", path: "/services/digital-marketing" },
    { name: "Writing & Translation", path: "/services/writing-translation" },
    { name: "Video & Animation", path: "/services/video-animation" },
    { name: "Music & Audio", path: "/services/music-audio" },
    { name: "Programming & Tech", path: "/services/programming-tech" },
  ];

  const about = [
    { name: "Careers", path: "/careers" },
    { name: "Press & News", path: "/press" },
    { name: "Partnerships", path: "/partnerships" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const support = [
    { name: "Help & Support", path: "/help" },
    { name: "Trust & Safety", path: "/trust" },
    { name: "Selling on Fiverrish", path: "/selling" },
    { name: "Buying on Fiverrish", path: "/buying" },
  ];

  const community = [
    { name: "Community Standards", path: "/community" },
    { name: "Forum", path: "/forum" },
    { name: "Events", path: "/events" },
    { name: "Blog", path: "/blog" },
    { name: "Influencers", path: "/influencers" },
  ];

  return (
    <footer className="w-full bg-background border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1 xl:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Fiverrish
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm">
              Connecting talent with opportunities - your platform for freelance services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase">About</h3>
            <ul className="space-y-2">
              {about.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase">Support</h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase">Community</h3>
            <ul className="space-y-2">
              {community.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="flex items-center mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fiverrish. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>English</span>
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
