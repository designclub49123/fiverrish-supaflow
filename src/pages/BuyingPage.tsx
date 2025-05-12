
import StandardPage from '@/components/layout/StandardPage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, MessageSquare, Star } from 'lucide-react';

export default function BuyingPage() {
  const navigate = useNavigate();

  return (
    <StandardPage 
      title="Buying on Fiverrish" 
      subtitle="How to find, purchase, and receive great services from talented freelancers"
    >
      <section className="mb-10">
        <p className="mb-6">
          Fiverrish connects you with skilled freelancers from around the world who can help bring your ideas to life. 
          Whether you need a logo designed, content written, or a website developed, our platform makes it easy to find 
          and hire the right talent for your project.
        </p>
        <Button onClick={() => navigate('/services')} className="mb-8">
          Browse Services <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Find the Right Service</h3>
              <p>
                Browse categories or search for specific services. Filter results by price, delivery time, 
                and seller ratings to find options that match your needs and budget.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Review Seller Profiles</h3>
              <p>
                Check seller ratings, reviews, and portfolios to ensure they have the skills and experience 
                needed for your project. You can also contact sellers with questions before ordering.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Place Your Order</h3>
              <p>
                Select the service package that best suits your needs, provide project details, 
                and make your payment. Your payment is held in escrow until you approve the work.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">4</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Receive and Review</h3>
              <p>
                Once the seller delivers your order, review it carefully. You can request revisions if needed, 
                or approve the work if you're satisfied. After approval, the seller receives payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Benefits of Buying on Fiverrish</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Wide Selection</h3>
              <p className="text-muted-foreground">Access thousands of services across dozens of categories to find exactly what you need.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Buyer Protection</h3>
              <p className="text-muted-foreground">Your payment is held in escrow until you're satisfied with the delivered work.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <MessageSquare className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Direct Communication</h3>
              <p className="text-muted-foreground">Message sellers directly to discuss your needs before and during the project.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Star className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Quality Assurance</h3>
              <p className="text-muted-foreground">Transparent reviews and ratings help you choose reliable sellers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Tips for a Great Experience</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Be specific about your requirements</strong> - The more details you provide about your project, 
            the better the seller can meet your expectations.
          </li>
          <li>
            <strong>Communicate clearly</strong> - Respond promptly to seller questions and provide feedback during the project.
          </li>
          <li>
            <strong>Check seller reviews and ratings</strong> - Past client experiences can give you insights into a seller's reliability and quality of work.
          </li>
          <li>
            <strong>Understand what's included</strong> - Review what's included in each service package to ensure it meets your needs.
          </li>
          <li>
            <strong>Set realistic expectations</strong> - Consider the price point and delivery timeframe when setting your quality expectations.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="mb-6">
          Browse our marketplace to find talented freelancers who can help with your projects. 
          With thousands of services available, you're sure to find the perfect match for your needs.
        </p>
        <Button size="lg" onClick={() => navigate('/services')}>
          Find Services Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </StandardPage>
  );
}
