
import StandardPage from '@/components/layout/StandardPage';

export default function TermsOfServicePage() {
  return (
    <StandardPage 
      title="Terms of Service" 
      subtitle="Last updated: June 1, 2025"
    >
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the Fiverrish website, 
          services, and applications (collectively, the "Services"). By accessing or using our Services, 
          you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">2. Eligibility</h2>
        <p>
          To use the Services, you must be at least 18 years old and capable of forming a binding contract with Fiverrish. 
          By using the Services, you represent and warrant that you meet these requirements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">3. Account Registration</h2>
        <p className="mb-3">
          To access certain features of the Services, you must register for an account. When you register, 
          you agree to provide accurate, current, and complete information about yourself.
        </p>
        <p>
          You are responsible for safeguarding your account credentials and for all activities that occur under your account. 
          You agree to notify Fiverrish immediately of any unauthorized use of your account or any other breach of security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">4. User Conduct</h2>
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-6">
          <li>Violate any applicable law or regulation.</li>
          <li>Infringe the intellectual property rights of others.</li>
          <li>Harass, abuse, or harm another person.</li>
          <li>Use our Services for any illegal or unauthorized purpose.</li>
          <li>Interfere with or disrupt the Services or servers or networks connected to the Services.</li>
          <li>Attempt to gain unauthorized access to any portion of the Services or any other accounts, computer systems, or networks connected to the Services.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">5. Service Fees</h2>
        <p>
          Fiverrish charges service fees for the use of the platform. Fees may vary based on the type of service, 
          transaction amount, and other factors. All fees are clearly displayed before you complete a transaction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">6. Intellectual Property</h2>
        <p>
          The Services and all content and materials included on the Services, including, without limitation, 
          the Fiverrish logo and all designs, text, graphics, pictures, information, data, software, and other 
          files (collectively, "Content"), are the proprietary property of Fiverrish or our licensors or users.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Fiverrish shall not be liable for any indirect, incidental, 
          special, consequential, or punitive damages, including lost profits, arising out of or in connection 
          with these Terms or your use of the Services, even if Fiverrish has been advised of the possibility of such damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">8. Dispute Resolution</h2>
        <p>
          Any disputes arising out of or relating to these Terms or the Services will be resolved through binding arbitration 
          in accordance with the rules of the American Arbitration Association. The arbitration will be conducted in New York, 
          New York, unless you and Fiverrish agree otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">9. Changes to Terms</h2>
        <p>
          Fiverrish reserves the right to modify these Terms at any time. We will provide notice of significant changes 
          by posting the updated Terms on the Services and updating the "Last updated" date. Your continued use of the 
          Services after such changes constitutes your acceptance of the new Terms.
        </p>
      </section>
    </StandardPage>
  );
}
