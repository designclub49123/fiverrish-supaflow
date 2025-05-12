
import StandardPage from '@/components/layout/StandardPage';

export default function PrivacyPolicyPage() {
  return (
    <StandardPage 
      title="Privacy Policy" 
      subtitle="Last updated: June 1, 2025"
    >
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
        <p>
          Fiverrish ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">2. Data We Collect</h2>
        <p className="mb-3">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 mb-3">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
          <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">3. How We Use Your Data</h2>
        <p className="mb-3">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">4. Data Sharing</h2>
        <p>
          We may share your personal data with the parties set out below for the purposes set out in this privacy policy.
        </p>
        <ul className="list-disc pl-6">
          <li>Service providers who provide IT and system administration services.</li>
          <li>Professional advisers including lawyers, bankers, auditors and insurers.</li>
          <li>Regulators and other authorities who require reporting of processing activities in certain circumstances.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
          used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
          to those employees, agents, contractors and other third parties who have a business need to know.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">6. Your Legal Rights</h2>
        <p className="mb-3">
          Under certain circumstances, you have rights under data protection laws in relation to your personal data:
        </p>
        <ul className="list-disc pl-6">
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">7. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, 
          please contact our data privacy manager at privacy@fiverrish.com.
        </p>
      </section>
    </StandardPage>
  );
}
