
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

interface StandardPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function StandardPage({ title, subtitle, children }: StandardPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
            <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
