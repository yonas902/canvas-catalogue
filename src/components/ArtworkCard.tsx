import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtworkCardProps {
  id: string;
  title: string;
  artist: string;
  year: number;
  price: number;
  image: string;
  medium: string;
  dimensions: string;
}

const ArtworkCard = ({ id, title, artist, year, price, image, medium, dimensions }: ArtworkCardProps) => {
  return (
    <div className="group">
      <Link to={`/artwork/${id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={image}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist functionality
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      
      <div className="mt-4 space-y-1">
        <Link to={`/artwork/${id}`} className="block">
          <h3 className="text-lg font-light text-gallery-text hover:text-gallery-hover transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gallery-accent">{artist}</p>
        <p className="text-sm text-gallery-accent">{year}</p>
        <p className="text-lg font-medium text-gallery-text mt-2">
          ${price.toLocaleString()}
        </p>
        <div className="text-xs text-gallery-accent space-y-1">
          <p>{medium}</p>
          <p>{dimensions}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;