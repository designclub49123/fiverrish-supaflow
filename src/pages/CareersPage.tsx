
import StandardPage from '@/components/layout/StandardPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      title: "Customer Support Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time"
    }
  ];

  return (
    <StandardPage 
      title="Careers at Fiverrish" 
      subtitle="Join our team and help build the future of freelancing"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Why work with us?</h2>
        <p className="mb-4">
          At Fiverrish, we're building a platform that connects talented freelancers with clients worldwide. 
          We're passionate about creating opportunities and empowering people to turn their skills into a sustainable income.
        </p>
        <p>
          We offer competitive salaries, flexible remote work options, comprehensive benefits, and a collaborative culture
          that values innovation, diversity, and work-life balance.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        <div className="grid gap-4">
          {openPositions.map((position, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle>{position.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{position.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{position.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{position.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="space-y-4 list-disc pl-6">
          <li>
            <strong>Innovation:</strong> We're not afraid to challenge the status quo and find new ways to improve our platform.
          </li>
          <li>
            <strong>Inclusion:</strong> We believe in creating a workplace where everyone feels welcome, valued, and heard.
          </li>
          <li>
            <strong>Integrity:</strong> We're committed to doing the right thing, even when it's difficult.
          </li>
          <li>
            <strong>Impact:</strong> We're focused on making a meaningful difference in the lives of our users.
          </li>
        </ul>
      </section>
    </StandardPage>
  );
}
