import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ArrowLeft } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';

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

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArtwork();
    }
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const { data: artworkData, error: artworkError } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single();

      if (artworkError) {
        console.error('Error fetching artwork:', artworkError);
        setLoading(false);
        return;
      }

      setArtwork(artworkData);

      // Fetch related artworks
      const { data: relatedData, error: relatedError } = await supabase
        .from('artworks')
        .select('*')
        .neq('id', id)
        .or(`artist_name.eq.${artworkData.artist_name},category.eq.${artworkData.category}`)
        .limit(3);

      if (relatedError) {
        console.error('Error fetching related artworks:', relatedError);
      } else {
        setRelatedArtworks(relatedData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gallery-accent">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Artwork not found</h1>
          <Link to="/">
            <Button variant="outline">Return to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gallery-accent hover:text-gallery-text transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img
              src={artwork.image_url || '/placeholder.svg'}
              alt={`${artwork.title} by ${artwork.artist_name}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Artwork Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gallery-text mb-2">{artwork.title}</h1>
              <p className="text-xl text-gallery-accent mb-4">{artwork.artist_name}</p>
              {artwork.year && <p className="text-gallery-accent">{artwork.year}</p>}
              {artwork.price && (
                <p className="text-3xl font-medium text-gallery-text mt-6">
                  ${artwork.price.toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-gallery-text text-background hover:bg-gallery-hover"
              >
                Inquire
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? 'bg-gallery-accent/10 border-gallery-accent' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="artist">Artist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gallery-text mb-2">About this work</h3>
                  <p className="text-gallery-accent leading-relaxed">
                    {artwork.description || `An exceptional piece by ${artwork.artist_name}, showcasing mastery of form and composition.`}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {artwork.medium && (
                    <div>
                      <dt className="font-medium text-gallery-text">Medium</dt>
                      <dd className="text-gallery-accent">{artwork.medium}</dd>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div>
                      <dt className="font-medium text-gallery-text">Dimensions</dt>
                      <dd className="text-gallery-accent">{artwork.dimensions}</dd>
                    </div>
                  )}
                  {artwork.year && (
                    <div>
                      <dt className="font-medium text-gallery-text">Year</dt>
                      <dd className="text-gallery-accent">{artwork.year}</dd>
                    </div>
                  )}
                  {artwork.category && (
                    <div>
                      <dt className="font-medium text-gallery-text">Category</dt>
                      <dd className="text-gallery-accent">{artwork.category}</dd>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gallery-text mb-2">Shipping Information</h3>
                  <div className="space-y-2 text-sm text-gallery-accent">
                    <p>• Carefully packaged and insured</p>
                    <p>• Ships within 3-5 business days</p>
                    <p>• Free shipping within the continental US</p>
                    <p>• International shipping available</p>
                    <p>• 30-day return policy</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="artist" className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gallery-text mb-2">About {artwork.artist_name}</h3>
                  <p className="text-gallery-accent leading-relaxed">
                    {artwork.artist_name} is a distinguished artist whose work explores the intersection of 
                    traditional techniques and contemporary themes. Their pieces have been featured in 
                    numerous exhibitions and are held in private collections worldwide.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-light text-gallery-text mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <ArtworkCard
                  key={relatedArtwork.id}
                  artwork={relatedArtwork}
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