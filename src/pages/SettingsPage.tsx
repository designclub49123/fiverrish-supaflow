
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Profile settings
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  
  // Account settings
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  
  // Payment settings
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  
  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }
      
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData) {
        setFullName(profileData.full_name || "");
        setUsername(profileData.username || "");
        setBio(profileData.bio || "");
        setLocation(profileData.location || "");
        setWebsite(profileData.website || "");
        setProfileImageUrl(profileData.avatar_url || null);
      }
      
      // Set email from auth user
      setEmail(session.user.email || "");
      
      // Get payment info if exists
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (!paymentError && paymentData) {
        setPaypalEmail(paymentData.paypal_email || "");
        setBankName(paymentData.bank_name || "");
        setAccountNumber(paymentData.account_number || "");
        setRoutingNumber(paymentData.routing_number || "");
        setAccountHolderName(paymentData.account_holder_name || "");
      }
      
      // Get notification settings if exists
      const { data: notificationData, error: notificationError } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (!notificationError && notificationData) {
        setEmailNotifications(notificationData.email_notifications);
        setMessageNotifications(notificationData.message_notifications);
        setOrderNotifications(notificationData.order_notifications);
        setPromotionalEmails(notificationData.promotional_emails);
      }
      
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "There was a problem loading your profile data.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be logged in to update your profile.",
        });
        return;
      }
      
      let avatarUrl = profileImageUrl;
      
      // Upload new profile image if selected
      if (profileImage) {
        const fileName = `${Date.now()}-${profileImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`public/${session.user.id}/${fileName}`, profileImage);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(`public/${session.user.id}/${fileName}`);
        
        avatarUrl = publicUrl.publicUrl;
      }
      
      // Update profile data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          bio,
          location,
          website,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "There was a problem updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: "There was a problem updating your password.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: session.user.id,
          email_notifications: emailNotifications,
          message_notifications: messageNotifications,
          order_notifications: orderNotifications,
          promotional_emails: promotionalEmails,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
      
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "There was a problem updating your notification settings.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updatePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          user_id: session.user.id,
          paypal_email: paypalEmail,
          bank_name: bankName,
          account_number: accountNumber,
          routing_number: routingNumber,
          account_holder_name: accountHolderName,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Payment settings updated",
        description: "Your payment information has been saved.",
      });
      
    } catch (error) {
      console.error("Error updating payment settings:", error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "There was a problem updating your payment settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your profile information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImageUrl || ""} />
                    <AvatarFallback>{fullName.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                    <Label htmlFor="profile-image" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your email and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
              </div>
              
              <form onSubmit={updatePassword} className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateNotificationSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about account activity via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="messageNotifications">Message Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when you get new messages
                      </p>
                    </div>
                    <Switch
                      id="messageNotifications"
                      checked={messageNotifications}
                      onCheckedChange={setMessageNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderNotifications">Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your orders
                      </p>
                    </div>
                    <Switch
                      id="orderNotifications"
                      checked={orderNotifications}
                      onCheckedChange={setOrderNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotionalEmails">Promotional Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about promotions and special offers
                      </p>
                    </div>
                    <Switch
                      id="promotionalEmails"
                      checked={promotionalEmails}
                      onCheckedChange={setPromotionalEmails}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updatePaymentSettings} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">PayPal</h3>
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        placeholder="your-paypal@example.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Bank Account</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Payment Information"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
