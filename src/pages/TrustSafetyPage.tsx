
import StandardPage from '@/components/layout/StandardPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, DollarSign, UserCheck } from 'lucide-react';

export default function TrustSafetyPage() {
  return (
    <StandardPage 
      title="Trust & Safety" 
      subtitle="How we keep the Fiverrish community secure and reliable"
    >
      <section className="mb-10">
        <p className="mb-6">
          At Fiverrish, we're committed to creating a safe and trusted marketplace where freelancers and clients 
          can connect and work together with confidence. Our Trust & Safety team works around the clock to 
          maintain the integrity of our platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                All payments on Fiverrish are processed through our secure payment system. Funds are held in escrow 
                until you approve the completed work, ensuring that sellers get paid and buyers receive the services they paid for.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Fraud Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our advanced fraud detection systems monitor the platform 24/7 to identify and prevent suspicious activities. 
                We employ machine learning algorithms and manual reviews to maintain the integrity of our marketplace.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Buyer Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our buyer protection program ensures that you only pay for work that meets your expectations. 
                If there's an issue with your order, our support team will help resolve it promptly and fairly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <UserCheck className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Seller Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We verify seller identities and monitor their performance to maintain high standards across our platform. 
                Our rating system provides transparency about seller reputation based on genuine client feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
        <p className="mb-4">
          Our community guidelines ensure that Fiverrish remains a respectful and professional environment for everyone. 
          We expect all users to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Treat others with respect and professionalism</li>
          <li>Provide accurate information about themselves and their services</li>
          <li>Deliver work as promised and communicate effectively</li>
          <li>Respect intellectual property rights</li>
          <li>Maintain confidentiality of client information</li>
          <li>Report suspicious or inappropriate behavior</li>
        </ul>
        <p>
          Violations of these guidelines may result in warnings, restrictions, or account termination.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
        <p className="mb-6">
          In the rare event of a dispute between buyers and sellers, our support team is here to help. 
          We provide a fair and transparent resolution process that includes:
        </p>
        <ol className="list-decimal pl-6">
          <li className="mb-2">Direct communication between parties to resolve the issue</li>
          <li className="mb-2">Mediation by our support team if needed</li>
          <li className="mb-2">Review of order details, communications, and delivered work</li>
          <li>Final resolution based on our terms of service and marketplace standards</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Reporting Issues</h2>
        <p className="mb-4">
          If you encounter any issues related to trust and safety on Fiverrish, please report them immediately. 
          You can:
        </p>
        <ul className="list-disc pl-6">
          <li>Use the "Report" button on user profiles, service listings, or messages</li>
          <li>Contact our support team at trust@fiverrish.com</li>
          <li>Submit a request through our Help & Support center</li>
        </ul>
      </section>
    </StandardPage>
  );
}
