
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedServices from '@/components/home/FeaturedServices';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Clock, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Tech Innovators",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    quote: "Fiverrish connected us with amazing talent that transformed our brand identity. The quality of work exceeded our expectations."
  },
  {
    name: "Michael Chen",
    company: "Startup Foundry",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    quote: "As a startup founder, Fiverrish has been invaluable. We've found reliable freelancers for everything from our logo to our app development."
  },
  {
    name: "Priya Patel",
    company: "Creative Solutions",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    quote: "The platform is intuitive, and the freelancers are top-notch. Our projects are completed on time and with excellent results."
  }
];

const benefits = [
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Quality Work",
    description: "Access top talent and get high-quality results on every project"
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Secure Payments",
    description: "Your payment is secure until you approve the delivered work"
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Quick Delivery",
    description: "Find the right service with delivery times that meet your needs"
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: "Verified Sellers",
    description: "Work with trusted professionals vetted by our platform"
  }
];

export default function Index() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <Categories />

        {/* Featured Services Section */}
        <FeaturedServices />

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Fiverrish</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform connects businesses with talented freelancers from around the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border border-border hover:border-primary/30 bg-background hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from businesses that have found success with Fiverrish
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-background rounded-xl p-8 shadow-subtle border border-border animate-float"
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_70%)]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow with top freelance talent?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that are scaling with Fiverrish. Find talent for any skill in just minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="hover-effect w-full sm:w-auto button-pulse"
                  >
                    Find Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-white hover:bg-white/10 w-full sm:w-auto hover-effect"
                  >
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
