
import StandardPage from '@/components/layout/StandardPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Building, GraduationCap, Heart } from 'lucide-react';

export default function PartnershipsPage() {
  return (
    <StandardPage 
      title="Partnerships" 
      subtitle="Collaborate with Fiverrish to create mutual growth opportunities"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Why Partner With Us?</h2>
        <p className="mb-4">
          Fiverrish collaborates with businesses, educational institutions, and nonprofits 
          to create impactful partnerships that drive growth and innovation. Our platform 
          connects talented freelancers with clients worldwide, creating unique opportunities 
          for strategic alliances.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Partnership Opportunities</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Corporate Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Join our enterprise program to access top freelance talent for your business needs, 
                receive custom solutions, and benefit from preferential rates.
              </p>
              <Button variant="outline" className="w-full">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Building className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Agency Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Agencies can expand their service offerings and scale their workforce 
                by tapping into our freelancer network to handle client overflow.
              </p>
              <Button variant="outline" className="w-full">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Educational Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We collaborate with universities and training institutions to bridge 
                education with real-world opportunities for students and graduates.
              </p>
              <Button variant="outline" className="w-full">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Nonprofit Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We support nonprofits through our corporate social responsibility 
                initiatives, providing subsidized access to freelance talent.
              </p>
              <Button variant="outline" className="w-full">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <p className="mb-4">
          Interested in exploring partnership opportunities with Fiverrish? 
          Our partnerships team is ready to discuss how we can create value together.
        </p>
        <p className="mb-6">
          Contact us at partnerships@fiverrish.com to start the conversation.
        </p>
        <Button>Contact Partnership Team</Button>
      </section>
    </StandardPage>
  );
}
