
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

// Validation schema for sign in
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Validation schema for sign up
const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-z0-9_-]+$/, { message: "Username can only contain lowercase letters, numbers, underscores and dashes" }),
  accountType: z.enum(["client", "freelancer"], {
    required_error: "Please select an account type",
  }),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sign-in");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);
  
  // Sign in form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Sign up form
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      username: "",
      accountType: "client",
    },
  });
  
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      // Register the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            username: values.username,
            account_type: values.accountType,
          },
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      toast({
        title: "Account created!",
        description: "Welcome to Fiverrish. You will be redirected to your dashboard.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2342&auto=format&fit=crop')" }}>
        <div className="flex items-center justify-center h-full bg-black/30">
          <div className="text-white text-center max-w-lg p-8">
            <h1 className="text-4xl font-bold mb-4">Join our freelance marketplace</h1>
            <p className="text-lg">Connect with talented professionals or find clients for your services</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Fiverrish
              </span>
            </Link>
            <h2 className="text-2xl font-bold mt-6 mb-2">Welcome to Fiverrish</h2>
            <p className="text-muted-foreground">Your gateway to freelance services</p>
          </div>
          
          <Tabs defaultValue="sign-in" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Create Account</TabsTrigger>
            </TabsList>
            
            {/* Sign In Form */}
            <TabsContent value="sign-in">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="your@email.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">Don't have an account?{" "}
                  <button 
                    className="text-primary hover:underline font-medium" 
                    onClick={() => setActiveTab("sign-up")}
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </TabsContent>
            
            {/* Sign Up Form */}
            <TabsContent value="sign-up">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="your@email.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={signUpForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="John Doe" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signUpForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                              <Input placeholder="johndoe" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <Button
                            type="button"
                            variant={field.value === "client" ? "default" : "outline"}
                            className={field.value === "client" ? "" : "border-primary/20"}
                            onClick={() => signUpForm.setValue("accountType", "client")}
                          >
                            I'm a Client
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "freelancer" ? "default" : "outline"}
                            className={field.value === "freelancer" ? "" : "border-primary/20"}
                            onClick={() => signUpForm.setValue("accountType", "freelancer")}
                          >
                            I'm a Freelancer
                          </Button>
                        </div>
                        <FormDescription className="text-xs mt-2">
                          {field.value === "client" 
                            ? "Find and hire talented freelancers for your projects" 
                            : "Offer your services and find new clients"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">Already have an account?{" "}
                  <button 
                    className="text-primary hover:underline font-medium" 
                    onClick={() => setActiveTab("sign-in")}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to Fiverrish's</p>
            <div className="mt-1">
              <a href="#" className="hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
