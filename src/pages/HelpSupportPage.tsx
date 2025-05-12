
import { useState } from 'react';
import StandardPage from '@/components/layout/StandardPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = {
    general: [
      {
        question: "What is Fiverrish?",
        answer: "Fiverrish is a platform that connects freelancers with clients needing various services, from graphic design to programming and more."
      },
      {
        question: "How do I sign up?",
        answer: "Click the 'Join' button in the top right corner of the page and follow the registration process. You can sign up using your email or social media accounts."
      },
      {
        question: "Is Fiverrish free to use?",
        answer: "Signing up and browsing services on Fiverrish is free. We charge a service fee on completed transactions between buyers and sellers."
      }
    ],
    buyers: [
      {
        question: "How do I find a service?",
        answer: "You can browse categories, use the search bar, or filter results based on price, delivery time, and seller ratings to find services that match your needs."
      },
      {
        question: "How do payments work?",
        answer: "Payments are processed securely through our platform. Funds are held in escrow until you approve the completed work."
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer: "If you're not satisfied, you can request revisions as specified in the service package. If issues persist, you can contact our support team for assistance."
      }
    ],
    sellers: [
      {
        question: "How do I become a seller?",
        answer: "Click on 'Become a Seller' link and complete your profile setup. Then you can create services to offer to potential clients."
      },
      {
        question: "How much can I charge?",
        answer: "You set your own prices for your services. Research similar offerings to ensure your rates are competitive."
      },
      {
        question: "When do I get paid?",
        answer: "After delivering work that the client approves, funds are released from escrow to your Fiverrish account. You can withdraw funds to your bank account or other payment methods."
      }
    ]
  };

  const filteredFaqs = searchQuery
    ? Object.entries(faqs).reduce((result, [category, questions]) => {
        const filtered = questions.filter(
          (faq) => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          result[category] = filtered;
        }
        return result;
      }, {} as Record<string, typeof faqs.general>)
    : faqs;

  return (
    <StandardPage 
      title="Help & Support" 
      subtitle="Find answers to common questions or contact our support team for assistance"
    >
      <div className="mb-10">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            className="pl-10 py-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex flex-col h-auto py-6">
            <span className="text-lg font-medium">Contact Support</span>
            <span className="text-sm text-muted-foreground mt-1">Get help from our team</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-auto py-6">
            <span className="text-lg font-medium">Community Forum</span>
            <span className="text-sm text-muted-foreground mt-1">Ask the community</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-auto py-6">
            <span className="text-lg font-medium">Video Tutorials</span>
            <span className="text-sm text-muted-foreground mt-1">Learn how to use Fiverrish</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="buyers">For Buyers</TabsTrigger>
          <TabsTrigger value="sellers">For Sellers</TabsTrigger>
        </TabsList>

        {Object.entries(filteredFaqs).map(([category, questions]) => (
          <TabsContent key={category} value={category}>
            <h2 className="text-2xl font-bold mb-4">
              {category === 'general' ? 'General Questions' : 
               category === 'buyers' ? 'Buyer Questions' : 'Seller Questions'}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}

        {searchQuery && Object.keys(filteredFaqs).length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or contact our support team for assistance.
            </p>
          </div>
        )}
      </Tabs>
    </StandardPage>
  );
}
