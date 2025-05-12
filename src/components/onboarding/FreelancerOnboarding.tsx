
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, Upload } from 'lucide-react';

export default function FreelancerOnboarding() {
  const [activeStep, setActiveStep] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    location: '',
    hourlyRate: '',
    skills: [] as string[],
    avatarFile: null as File | null,
    avatarUrl: '',
    website: ''
  });
  
  const [completedSteps, setCompletedSteps] = useState({
    profile: false,
    skills: false,
    payments: false
  });
  
  const [paymentData, setPaymentData] = useState({
    paypalEmail: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: ''
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Avatar image must be less than 5MB."
        });
        return;
      }
      
      setProfileData({
        ...profileData,
        avatarFile: file,
        avatarUrl: URL.createObjectURL(file)
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleProfileSubmit = async () => {
    if (!profileData.fullName || !profileData.bio || !profileData.location) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all required fields."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please sign in to continue."
        });
        navigate('/auth');
        return;
      }
      
      let avatarUrl = profileData.avatarUrl;
      
      // Upload avatar if provided
      if (profileData.avatarFile) {
        const fileExt = profileData.avatarFile.name.split('.').pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('avatars')
          .upload(fileName, profileData.avatarFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullName,
          bio: profileData.bio,
          location: profileData.location,
          hourly_rate: profileData.hourlyRate ? parseFloat(profileData.hourlyRate) : null,
          is_freelancer: true,
          role: 'freelancer',
          website: profileData.website,
          avatar_url: avatarUrl || null,
        })
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      setCompletedSteps(prev => ({ ...prev, profile: true }));
      setActiveStep('skills');
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved."
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast({
        variant: "destructive",
        title: "No skills selected",
        description: "Please add at least one skill."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please sign in to continue."
        });
        navigate('/auth');
        return;
      }
      
      // First check if skills exist, otherwise create them
      for (const skillName of selectedSkills) {
        // Check if skill exists
        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();
          
        let skillId;
        
        if (!existingSkill) {
          // Create new skill
          const { data: newSkill, error: newSkillError } = await supabase
            .from('skills')
            .insert({ name: skillName })
            .select('id')
            .single();
            
          if (newSkillError) throw newSkillError;
          skillId = newSkill.id;
        } else {
          skillId = existingSkill.id;
        }
        
        // Add skill to freelancer's profile
        const { error: skillLinkError } = await supabase
          .from('freelancer_skills')
          .insert({
            profile_id: session.user.id,
            skill_id: skillId,
            level: 'Intermediate' // Default level
          });
          
        if (skillLinkError) throw skillLinkError;
      }
      
      setCompletedSteps(prev => ({ ...prev, skills: true }));
      setActiveStep('payments');
      
      toast({
        title: "Skills updated",
        description: "Your skills have been saved."
      });
      
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update skills. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentsSubmit = async () => {
    if (!paymentData.paypalEmail && !paymentData.bankName) {
      toast({
        variant: "destructive",
        title: "Missing payment information",
        description: "Please provide at least one payment method."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please sign in to continue."
        });
        navigate('/auth');
        return;
      }
      
      // Check if payment method exists
      const { data: existingPayment } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
        
      if (existingPayment) {
        // Update existing payment method
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({
            paypal_email: paymentData.paypalEmail,
            bank_name: paymentData.bankName,
            account_number: paymentData.accountNumber,
            routing_number: paymentData.routingNumber,
            account_holder_name: paymentData.accountHolderName
          })
          .eq('id', existingPayment.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new payment method
        const { error: insertError } = await supabase
          .from('payment_methods')
          .insert({
            user_id: session.user.id,
            paypal_email: paymentData.paypalEmail,
            bank_name: paymentData.bankName,
            account_number: paymentData.accountNumber,
            routing_number: paymentData.routingNumber,
            account_holder_name: paymentData.accountHolderName
          });
          
        if (insertError) throw insertError;
      }
      
      setCompletedSteps(prev => ({ ...prev, payments: true }));
      
      toast({
        title: "Setup complete!",
        description: "Your freelancer account is now set up. You can start creating services."
      });
      
      // Navigate to dashboard
      navigate('/dashboard/services/create');
      
    } catch (error) {
      console.error("Error updating payment information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment information. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Freelancer Profile</CardTitle>
          <CardDescription>
            Set up your profile to start offering services
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile" disabled={loading} className="relative">
                <span className="flex items-center">
                  {completedSteps.profile && (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  Profile Details
                </span>
              </TabsTrigger>
              <TabsTrigger value="skills" disabled={loading || !completedSteps.profile} className="relative">
                <span className="flex items-center">
                  {completedSteps.skills && (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  Your Skills
                </span>
              </TabsTrigger>
              <TabsTrigger value="payments" disabled={loading || !completedSteps.skills} className="relative">
                <span className="flex items-center">
                  {completedSteps.payments && (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  Payment Details
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="text-lg">
                      {profileData.fullName.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Upload className="h-4 w-4" />
                      </div>
                    </Label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a professional photo (max 5MB)
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell clients about yourself and your expertise..."
                    required
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min 100 characters recommended. Include your expertise, experience, and why clients should hire you.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="New York, USA"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                      placeholder="25"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleProfileSubmit} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Continue to Skills'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="skills">Your Skills</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. Web Design)"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter or click Add to add each skill. Add at least 3-5 skills to maximize visibility.
                </p>
              </div>
              
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Popular Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 
                    'SEO', 'Logo Design', 'WordPress', 'Video Editing', 'UI/UX Design'].map((skill) => (
                    <Button
                      key={skill}
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs"
                      onClick={() => {
                        if (!selectedSkills.includes(skill)) {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      disabled={selectedSkills.includes(skill)}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSkillsSubmit} 
                disabled={loading || selectedSkills.length === 0} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Continue to Payment Details'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={paymentData.paypalEmail}
                    onChange={(e) => setPaymentData({...paymentData, paypalEmail: e.target.value})}
                    placeholder="your-email@example.com"
                  />
                </div>
                
                <div className="space-y-4 pt-2">
                  <h3 className="font-medium">Bank Account Details (Optional)</h3>
                  
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={paymentData.bankName}
                      onChange={(e) => setPaymentData({...paymentData, bankName: e.target.value})}
                      placeholder="Bank of America"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={paymentData.accountHolderName}
                      onChange={(e) => setPaymentData({...paymentData, accountHolderName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={paymentData.accountNumber}
                        onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})}
                        placeholder="XXXXXXXXXXXX"
                        type="password"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={paymentData.routingNumber}
                        onChange={(e) => setPaymentData({...paymentData, routingNumber: e.target.value})}
                        placeholder="XXXXXXXXX"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Your payment information is securely stored. You'll need at least one payment method to receive payments.
              </p>
              
              <Button 
                onClick={handlePaymentsSubmit} 
                disabled={loading || (!paymentData.paypalEmail && !paymentData.bankName)}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Complete Setup'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={() => {
              if (activeStep === 'skills' && completedSteps.profile) {
                setActiveStep('profile');
              } else if (activeStep === 'payments' && completedSteps.skills) {
                setActiveStep('skills');
              } else {
                navigate('/dashboard');
              }
            }}
            disabled={loading}
          >
            {activeStep === 'profile' ? 'Cancel' : 'Back'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {activeStep === 'profile' ? '1' : activeStep === 'skills' ? '2' : '3'} of 3
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
