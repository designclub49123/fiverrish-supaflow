
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, HelpCircle, MessageSquare, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CommunityStandardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Community Standards</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Our guidelines help create a safe, respectful, and productive community for everyone.
            </p>
          </div>
          
          <Card className="mb-10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Commitment</h2>
                  <p className="text-muted-foreground">
                    At Grew up, we're committed to maintaining a positive environment where freelancers and clients can collaborate effectively. Our community standards reflect our core values of respect, integrity, and professionalism.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Key Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-medium text-lg">Respect & Inclusion</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Treat all community members with respect regardless of background, identity, or experience level. Discrimination, harassment, hate speech, or bullying will not be tolerated.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-medium text-lg">Honesty & Transparency</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Be truthful about your skills, experience, and deliverables. Accurate representation builds trust within our community and leads to better outcomes for everyone.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-medium text-lg">Quality & Professionalism</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Deliver high-quality work and maintain professional communication. Honor commitments, meet deadlines, and handle disputes constructively and respectfully.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-medium text-lg">Intellectual Property</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Respect copyright and intellectual property rights. Do not use or share content that infringes on others' rights, and properly attribute work when required.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Detailed Guidelines</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Communication Standards</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• Use clear, professional language in all communications.</p>
                  <p>• Respond to messages in a timely manner.</p>
                  <p>• Keep communications within the platform when possible for security.</p>
                  <p>• Avoid offensive language, personal attacks, or inflammatory comments.</p>
                  <p>• Be respectful of cultural differences and language barriers.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Service Listings & Profiles</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• Provide accurate information about your services and capabilities.</p>
                  <p>• Use your own original work in portfolios and examples.</p>
                  <p>• Set realistic expectations about deliverables and timeframes.</p>
                  <p>• Use appropriate, professional imagery and descriptions.</p>
                  <p>• Do not misrepresent qualifications or experience.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Transaction Conduct</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• Complete agreed-upon work within the specified timeframe.</p>
                  <p>• Only request payment for services actually rendered.</p>
                  <p>• Communicate proactively about any delays or issues.</p>
                  <p>• Provide fair and honest feedback about transactions.</p>
                  <p>• Do not attempt to circumvent platform payment systems.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Content Guidelines</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• Do not post content that is illegal, harmful, or offensive.</p>
                  <p>• Respect copyright and trademark laws.</p>
                  <p>• Do not share inappropriate, adult-oriented, or violent content.</p>
                  <p>• Credit all sources appropriately.</p>
                  <p>• Do not distribute malware or engage in phishing activities.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Dispute Resolution</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• Attempt to resolve disputes directly and professionally first.</p>
                  <p>• Use the platform's dispute resolution tools when necessary.</p>
                  <p>• Provide factual information when reporting issues.</p>
                  <p>• Be open to compromise and constructive solutions.</p>
                  <p>• Do not make false claims or accusations.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mb-10">
            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg mb-2">Enforcement & Consequences</h3>
                  <p className="text-muted-foreground">
                    Violations of these standards may result in warnings, temporary restrictions, or permanent removal from the Grew up platform, depending on the severity and frequency of the violation. We investigate all reported incidents thoroughly and take appropriate action to maintain our community standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Reporting Violations</h2>
            <p className="text-muted-foreground mb-6">
              If you encounter behavior that violates our community standards, please report it promptly. We take all reports seriously and will investigate each case thoroughly.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Report a Violation
              </Button>
              <Button variant="outline" className="flex-1">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              These community standards may be updated periodically. By using Grew up, you agree to abide by the most current version of these standards.
            </p>
            <p className="text-sm">
              Last updated: May 10, 2023
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
