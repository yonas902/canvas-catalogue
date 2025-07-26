import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artworks } from '@/data/artworks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ArrowLeft } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const artwork = artworks.find(item => item.id === id);
  const relatedArtworks = artworks.filter(item => 
    item.id !== id && (item.artist === artwork?.artist || item.category === artwork?.category)
  ).slice(0, 3);

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Artwork not found</h1>
          <Link to="/">
            <Button variant="gallery-outline">Return to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-gallery-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-gallery-accent hover:text-gallery-text transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Artwork Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 overflow-hidden">
              <img
                src={artwork.image}
                alt={`${artwork.title} by ${artwork.artist}`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gallery-accent text-center">
              Click to view in fullscreen
            </p>
          </div>

          {/* Artwork Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-light text-gallery-text mb-2">
                {artwork.title}
              </h1>
              <p className="text-lg text-gallery-accent mb-1">
                {artwork.artist}
              </p>
              <p className="text-gallery-accent">
                {artwork.year}
              </p>
            </div>

            <div className="text-2xl font-medium text-gallery-text">
              ${artwork.price.toLocaleString()}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gallery-accent">Medium</p>
                <p className="text-gallery-text">{artwork.medium}</p>
              </div>
              <div>
                <p className="text-gallery-accent">Dimensions</p>
                <p className="text-gallery-text">{artwork.dimensions}</p>
              </div>
              <div>
                <p className="text-gallery-accent">Edition</p>
                <p className="text-gallery-text">{artwork.edition}</p>
              </div>
              <div>
                <p className="text-gallery-accent">Condition</p>
                <p className="text-gallery-text">{artwork.condition}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gallery-text leading-relaxed">
                {artwork.description}
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="gallery" 
                className="flex-1"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="gallery-outline" className="flex-1">
                Contact Gallery
              </Button>
            </div>

            {/* Additional Information Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Artwork Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                <TabsTrigger value="artist">Artist Biography</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gallery-accent">Series</p>
                    <p className="text-gallery-text">{artwork.series}</p>
                  </div>
                  <div>
                    <p className="text-gallery-accent">Category</p>
                    <p className="text-gallery-text">{artwork.category}</p>
                  </div>
                  <div>
                    <p className="text-gallery-accent">Provenance</p>
                    <p className="text-gallery-text">{artwork.provenance}</p>
                  </div>
                  <div>
                    <p className="text-gallery-accent">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {artwork.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gallery-accent/10 text-gallery-accent text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4 mt-6">
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gallery-text mb-2">Shipping Information</h4>
                    <p className="text-gallery-accent">
                      Free shipping worldwide for orders over $1,000. Carefully packaged and insured for safe delivery.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gallery-text mb-2">Returns Policy</h4>
                    <p className="text-gallery-accent">
                      14-day return policy for all artworks. Items must be returned in original condition.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="artist" className="space-y-4 mt-6">
                <div className="space-y-4 text-sm">
                  <p className="text-gallery-text">
                    {artwork.artist} is known for their distinctive style and unique approach to contemporary art.
                    Their work has been featured in galleries worldwide and continues to captivate audiences
                    with its emotional depth and technical mastery.
                  </p>
                  <Link to={`/artists/${artwork.artist.toLowerCase().replace(' ', '-')}`}>
                    <Button variant="link" className="p-0 h-auto">
                      View full artist biography →
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-light text-gallery-text mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <ArtworkCard
                  key={relatedArtwork.id}
                  id={relatedArtwork.id}
                  title={relatedArtwork.title}
                  artist={relatedArtwork.artist}
                  year={relatedArtwork.year}
                  price={relatedArtwork.price}
                  image={relatedArtwork.image}
                  medium={relatedArtwork.medium}
                  dimensions={relatedArtwork.dimensions}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetail;