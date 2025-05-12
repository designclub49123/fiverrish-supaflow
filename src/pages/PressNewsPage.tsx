
import StandardPage from '@/components/layout/StandardPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PressNewsPage() {
  const pressReleases = [
    {
      title: "Fiverrish Announces $30M Series B Funding Round",
      date: "May 15, 2025",
      summary: "Funding will accelerate global expansion and platform development."
    },
    {
      title: "Fiverrish Launches New Mobile App",
      date: "March 3, 2025",
      summary: "New mobile app brings the power of Fiverrish to iOS and Android devices."
    },
    {
      title: "Fiverrish Reaches 1 Million Registered Freelancers",
      date: "January 20, 2025",
      summary: "Platform celebrates milestone with new features and community initiatives."
    },
  ];

  return (
    <StandardPage 
      title="Press & News" 
      subtitle="The latest updates and announcements from Fiverrish"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Press Releases</h2>
        <div className="space-y-4">
          {pressReleases.map((release, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle>{release.title}</CardTitle>
                <CardDescription>{release.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{release.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Media Kit</h2>
        <p className="mb-4">
          Our media kit includes company information, logo files, executive bios, and high-resolution images.
          Contact our press team to request access.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
        <p className="mb-2">
          For press inquiries, please contact our media relations team:
        </p>
        <p className="mb-1">
          <strong>Email:</strong> press@fiverrish.com
        </p>
        <p>
          <strong>Phone:</strong> +1 (555) 123-4567
        </p>
      </section>
    </StandardPage>
  );
}
