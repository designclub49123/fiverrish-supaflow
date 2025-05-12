
import StandardPage from '@/components/layout/StandardPage';

export default function CommunityStandardsPage() {
  return (
    <StandardPage 
      title="Community Standards" 
      subtitle="Guidelines for maintaining a respectful and professional environment on Fiverrish"
    >
      <section className="mb-8">
        <p className="mb-6">
          At Fiverrish, we're committed to creating a platform where freelancers and clients can connect and collaborate 
          in a safe, respectful, and professional environment. These community standards outline the behavior we expect 
          from all users of our platform.
        </p>
        <p>
          Violation of these standards may result in content removal, restrictions on account features, 
          or account termination, depending on the severity and frequency of the violation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Respect and Professionalism</h2>
        <p className="mb-4">We expect all users to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Treat others with respect, courtesy, and professionalism</li>
          <li>Communicate clearly and respond to messages in a timely manner</li>
          <li>Honor commitments and deadlines</li>
          <li>Provide honest and constructive feedback</li>
          <li>Respect differences in opinions, backgrounds, and cultures</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Prohibited Content and Behavior</h2>
        <p className="mb-4">The following are not allowed on Fiverrish:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Harassment, hate speech, or discrimination based on race, ethnicity, gender, religion, sexual orientation, or other protected characteristics</li>
          <li>Threats, bullying, or intimidation</li>
          <li>Spam, scams, or deceptive practices</li>
          <li>Sharing explicit, violent, or otherwise inappropriate content</li>
          <li>Creating multiple accounts to circumvent restrictions or manipulate the platform</li>
          <li>Selling illegal goods or services, or promoting illegal activities</li>
          <li>Misrepresenting your identity, qualifications, or work</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respect copyright, trademark, and other intellectual property rights</li>
          <li>Only upload content you have the right to use or share</li>
          <li>Give proper attribution when using licensed or creative commons content</li>
          <li>Do not sell or distribute work that infringes on others' intellectual property</li>
          <li>Report copyright violations if you believe your work has been improperly used</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Service Quality and Accuracy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate descriptions of your services, including what is and isn't included</li>
          <li>Set realistic expectations regarding delivery time, quality, and outcomes</li>
          <li>Showcase only your own work in your portfolio or service examples</li>
          <li>Deliver work that meets professional standards and aligns with the service description</li>
          <li>Communicate proactively about any delays or issues that may affect delivery</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Privacy and Confidentiality</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respect the privacy and confidentiality of other users</li>
          <li>Do not share private communications or personal information without consent</li>
          <li>Handle client information and project details with appropriate security measures</li>
          <li>Do not use confidential information learned through a project for unauthorized purposes</li>
          <li>Obtain proper permission before using client work in your portfolio</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Reporting Violations</h2>
        <p className="mb-4">
          If you encounter content or behavior that violates these standards, please report it immediately:
        </p>
        <ul className="list-disc pl-6">
          <li>Use the "Report" button on profiles, services, or messages</li>
          <li>Contact our support team at support@fiverrish.com</li>
          <li>Provide as much detail as possible about the violation to help us investigate</li>
        </ul>
      </section>
    </StandardPage>
  );
}
