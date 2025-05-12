
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
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
  className?: string;
}

export default function ServiceCard({
  id,
  title,
  description,
  price,
  rating,
  reviewCount,
  sellerName,
  sellerAvatar,
  sellerLevel,
  imageUrl,
  deliveryTime,
  isFeatured = false,
  className,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsImageLoaded(true);
    }
  }, []);

  return (
    <div 
      className={cn(
        "group rounded-xl overflow-hidden bg-background shadow-subtle border border-border hover:shadow-elevation transition-all duration-300",
        isFeatured && "border-primary/20 bg-primary/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/services/${id}`} className="block">
        <div className="relative overflow-hidden aspect-video">
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              isImageLoaded ? "blur-0" : "blur-md",
              isHovered ? "scale-110" : "scale-100"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {isFeatured && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
              Featured
            </div>
          )}
          
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Save to favorites"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <img 
              src={sellerAvatar} 
              alt={sellerName}
              className="h-6 w-6 rounded-full"
            />
            <div className="flex items-center">
              <span className="text-sm font-medium truncate">{sellerName}</span>
              <span className="mx-1 text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{sellerLevel}</span>
            </div>
          </div>
          
          <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center mb-3 text-sm">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({reviewCount})</span>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{deliveryTime} {deliveryTime === 1 ? 'day' : 'days'} delivery</span>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Starting at</div>
              <div className="text-base font-semibold">${price}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
