
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  title: string;
  description?: string;
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
  isFeatured,
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <Link to={`/services/${id}`} className="flex-grow flex flex-col">
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {isFeatured && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              Featured
            </div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={sellerAvatar} alt={sellerName} />
              <AvatarFallback>{sellerName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{sellerName}</div>
            <div className="text-xs text-muted-foreground">· {sellerLevel}</div>
          </div>
          
          <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          {description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{description}</p>
          )}
          
          <div className="flex items-center mt-auto">
            {rating > 0 && (
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-0.5" />
                <span className="text-sm font-medium mr-1">{rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{deliveryTime} day{deliveryTime !== 1 ? 's' : ''} delivery</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-1">Starting at</span>
              <div className="flex items-center font-bold">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>{price}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
