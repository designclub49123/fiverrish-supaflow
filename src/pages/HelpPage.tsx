
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export default function HelpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate sending support request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support request sent",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
    } catch (error) {
      console.error("Error sending support request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send support request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to commonly asked questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">How do I place an order?</h3>
                <p className="text-muted-foreground">
                  To place an order, browse services and click on "Order Now" on the service you want. Review the details, choose your package, and proceed to checkout.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">What payment methods are accepted?</h3>
                <p className="text-muted-foreground">
                  We accept credit/debit cards, PayPal, and bank transfers for all transactions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">How do I contact a freelancer?</h3>
                <p className="text-muted-foreground">
                  You can message a freelancer directly from their profile page or through the messaging system after placing an order.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">What if I'm not satisfied with the delivered work?</h3>
                <p className="text-muted-foreground">
                  If you're not satisfied, you can request revisions according to the package terms or contact support for further assistance.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">How do I become a freelancer on this platform?</h3>
                <p className="text-muted-foreground">
                  To become a freelancer, go to your profile settings and select "Become a Freelancer". Fill out the required information and submit your application for review.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">How long does it take to get paid as a freelancer?</h3>
                <p className="text-muted-foreground">
                  Funds are released to your account 14 days after the order is completed, provided there are no disputes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get help with any issues or questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>User Guides</CardTitle>
              <CardDescription>
                Step-by-step guides to help you navigate the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Popular Guides</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guide Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Getting Started Guide</TableCell>
                      <TableCell>Basics</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">How to Place an Order</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Creating a Seller Profile</TableCell>
                      <TableCell>Freelancing</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Managing Your Services</TableCell>
                      <TableCell>Freelancing</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Payment Methods Explained</TableCell>
                      <TableCell>Payments</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Video Tutorials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Video Preview</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Platform Tour</h4>
                      <p className="text-sm text-muted-foreground">3:45</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Video Preview</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Order Process Walkthrough</h4>
                      <p className="text-sm text-muted-foreground">4:20</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Video Preview</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Setting Up Your Profile</h4>
                      <p className="text-sm text-muted-foreground">2:55</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
