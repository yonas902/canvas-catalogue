import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Artwork {
  id: string;
  title: string;
  artist_name: string;
  description: string | null;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const { id, title, artist_name, year, price, image_url, medium, dimensions } = artwork;
  return (
    <div className="group">
      <Link to={`/artwork/${id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={image_url || '/placeholder.svg'}
            alt={`${title} by ${artist_name}`}
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
        <p className="text-sm text-gallery-accent">{artist_name}</p>
        {year && <p className="text-sm text-gallery-accent">{year}</p>}
        {price && (
          <p className="text-lg font-medium text-gallery-text mt-2">
            ${price.toLocaleString()}
          </p>
        )}
        <div className="text-xs text-gallery-accent space-y-1">
          {medium && <p>{medium}</p>}
          {dimensions && <p>{dimensions}</p>}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;