
import StandardPage from '@/components/layout/StandardPage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Award, Clock } from 'lucide-react';

export default function SellingPage() {
  const navigate = useNavigate();

  return (
    <StandardPage 
      title="Selling on Fiverrish" 
      subtitle="Turn your skills into income by offering services to clients worldwide"
    >
      <section className="mb-10">
        <p className="mb-6">
          Fiverrish provides a platform for freelancers to showcase their skills, connect with clients, 
          and build a sustainable business. Whether you're a designer, writer, developer, or have any other 
          marketable skill, you can start earning on Fiverrish.
        </p>
        <Button onClick={() => navigate('/become-seller')} className="mb-8">
          Become a Seller Now <ArrowRight className="ml-2 h-4 w-4" />
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
              <h3 className="text-xl font-bold mb-2">Create Your Seller Profile</h3>
              <p>
                Set up a professional profile showcasing your skills, experience, and portfolio. 
                A complete profile helps build trust with potential clients.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Create Service Listings</h3>
              <p>
                Create detailed listings for the services you offer. Include clear descriptions, pricing, 
                delivery timeframes, and example work to attract the right clients.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Receive and Fulfill Orders</h3>
              <p>
                When clients place orders, communicate clearly and deliver high-quality work on time. 
                Building a reputation for excellence will lead to positive reviews and repeat business.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">4</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Get Paid</h3>
              <p>
                Once clients approve your work, payment is released to your Fiverrish account. 
                You can withdraw funds to your preferred payment method.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Benefits of Selling on Fiverrish</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Global Client Base</h3>
              <p className="text-muted-foreground">Access clients from around the world, expanding your reach beyond local markets.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Secure Payments</h3>
              <p className="text-muted-foreground">Get paid safely through our secure payment system with funds held in escrow.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Work on Your Terms</h3>
              <p className="text-muted-foreground">Set your own prices, work hours, and choose projects that interest you.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Build Your Brand</h3>
              <p className="text-muted-foreground">Develop a reputation and personal brand through reviews and ratings.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Tips for Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <TrendingUp className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Stand Out</h3>
            <p className="text-sm text-muted-foreground">
              Create unique, professional service listings with high-quality images and clear descriptions.
            </p>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <Award className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Deliver Quality</h3>
            <p className="text-sm text-muted-foreground">
              Consistently provide excellent work that exceeds client expectations to earn great reviews.
            </p>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <Clock className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Be Responsive</h3>
            <p className="text-sm text-muted-foreground">
              Respond quickly to inquiries and maintain clear communication throughout projects.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Ready to Start?</h2>
        <p className="mb-6">
          Join thousands of successful freelancers who are building their careers on Fiverrish. 
          It's free to sign up and create your first service listing.
        </p>
        <Button size="lg" onClick={() => navigate('/become-seller')}>
          Become a Seller <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </StandardPage>
  );
}
