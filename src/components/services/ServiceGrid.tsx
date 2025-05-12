
import ServiceCard from '@/components/ui/ServiceCard';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  sellerName: string;
  sellerAvatar: string;
  sellerLevel: string;
  imageUrl: string;
  deliveryTime: number;
  isFeatured?: boolean;
}

interface ServiceGridProps {
  services: Service[];
  className?: string;
}

export default function ServiceGrid({ services, className }: ServiceGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          {...service}
        />
      ))}
    </div>
  );
}
