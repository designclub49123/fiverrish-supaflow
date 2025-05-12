
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Pencil, Save, Award, Briefcase, Upload, Loader2 } from 'lucide-react';
import PortfolioProjects from '@/components/portfolio/PortfolioProjects';
import { useFileUpload } from '@/hooks/useFileUpload';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: number | null;
  is_freelancer: boolean;
  location: string | null;
  website: string | null;
  updated_at?: string;
  created_at?: string;
  role?: 'client' | 'freelancer';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { uploadFile, isUploading } = useFileUpload({
    bucketName: 'avatars',
    maxFileSize: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif']
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_freelancer: checked }));
  };

  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, hourly_rate: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url ?? null;
      
      if (avatarFile) {
        const result = await uploadFile(avatarFile, `user-${profile?.id}`);
        if (result) {
          avatarUrl = result.publicUrl;
        }
      }
      
      // Update profile data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          hourly_rate: formData.hourly_rate,
          is_freelancer: formData.is_freelancer,
          location: formData.location,
          website: formData.website,
          avatar_url: avatarUrl
        })
        .eq('id', profile?.id);
      
      if (updateError) throw updateError;
      
      await fetchProfile();
      setEditing(false);
      setAvatarFile(null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setFormData(profile || {});
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(false);
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={cancelEditing} disabled={submitting || isUploading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || isUploading}>
              {(submitting || isUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          {formData.is_freelancer && <TabsTrigger value="services">Services</TabsTrigger>}
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={avatarPreview || profile?.avatar_url || ''} 
                      alt={profile?.full_name || 'User'} 
                    />
                    <AvatarFallback className="text-xl">
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {editing && (
                    <div className="flex flex-col items-center">
                      <Label htmlFor="avatar" className="cursor-pointer mt-2 text-sm text-primary">
                        <Upload className="h-4 w-4 mr-1 inline-block" />
                        Upload Photo
                      </Label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                        disabled={submitting || isUploading}
                      />
                      {avatarPreview && (
                        <p className="text-xs text-muted-foreground mt-1">New photo selected</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name"
                        name="full_name"
                        disabled={!editing || submitting}
                        value={formData.full_name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username"
                        disabled={!editing || submitting}
                        value={formData.username || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio"
                      rows={4}
                      disabled={!editing || submitting}
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      placeholder={editing ? "Tell clients about yourself, your experience, and the services you offer..." : ""}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        name="location"
                        disabled={!editing || submitting}
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, USA"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website"
                        name="website"
                        disabled={!editing || submitting}
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Freelancer Profile</h4>
                    <p className="text-sm text-muted-foreground">Enable this to offer services on the platform</p>
                  </div>
                  <Switch 
                    checked={formData.is_freelancer || false} 
                    onCheckedChange={handleSwitchChange}
                    disabled={!editing || submitting}
                  />
                </div>
                
                {(formData.is_freelancer || profile?.is_freelancer) && (
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourly_rate" 
                      type="number" 
                      disabled={!editing || submitting} 
                      value={formData.hourly_rate || ''} 
                      onChange={handleHourlyRateChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <PortfolioProjects />
          
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your skills to showcase your expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Your Skills</h4>
                <Button variant="outline" size="sm">
                  <Award className="mr-2 h-4 w-4" />
                  Add Skills
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-muted text-muted-foreground py-1 px-3 rounded-full text-sm">
                  Add your skills here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {formData.is_freelancer && (
          <TabsContent value="services" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Services</CardTitle>
                <CardDescription>Manage the services you offer to clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">Create services to showcase your skills to potential clients</p>
                  <Button onClick={() => navigate('/dashboard/services/create')}>
                    Create New Service
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="h-56 flex items-center justify-center border-dashed">
                    <CardContent className="flex flex-col items-center p-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-center text-sm text-muted-foreground">
                        Create your first service
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => navigate('/dashboard/services/create')}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
