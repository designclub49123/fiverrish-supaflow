import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function BecomeSellerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBecomeSeller = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to become a seller",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_freelancer: true })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You are now a seller. Let's set up your profile.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error becoming a seller:', error);
      toast({
        title: "Error",
        description: "There was an error setting up your seller account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Set your own rates and work on your terms",
    "Work from anywhere in the world",
    "Build a portfolio and grow your reputation",
    "Access to millions of potential clients",
    "Get paid securely and on time",
    "Join a community of talented freelancers"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Your Skills With The World</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of freelancers and start selling your services to clients around the globe
            </p>
            <Button size="lg" onClick={handleBecomeSeller} disabled={isLoading}>
              {isLoading ? "Processing..." : "Become a Seller"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Become a Seller?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Turn your skills into earnings with our platform that connects you with clients worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Freedom and Flexibility</CardTitle>
                <CardDescription>Work on your own schedule from anywhere in the world</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Set your own hours and work when you want</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Choose projects that align with your skills</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Be your own boss and make your own decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Global Opportunities</CardTitle>
                <CardDescription>Connect with clients from around the world</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access a diverse range of clients and projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Expand your professional network internationally</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Grow your business beyond local constraints</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Growth</CardTitle>
                <CardDescription>Earn income doing what you love</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Set your own rates based on your experience</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Create multiple income streams with different services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Scale your business as you gain more clients</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">Set up your seller profile and showcase your skills and experience</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Services</h3>
                <p className="text-muted-foreground">List the services you offer with detailed descriptions and pricing</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Earning</h3>
                <p className="text-muted-foreground">Receive orders, deliver great work, and build your reputation</p>
              </div>
            </div>
            
            <Button size="lg" className="mt-12" onClick={handleBecomeSeller} disabled={isLoading}>
              {isLoading ? "Processing..." : "Start Selling Today"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
