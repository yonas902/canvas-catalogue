import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Painting', 'Sculpture', 'Photography', 'Digital Art'];

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artworks:', error);
      } else {
        setArtworks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = selectedCategory === 'All' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light text-gallery-text mb-2">Curated Collection</h1>
            <p className="text-gallery-accent">Discover exceptional contemporary artworks</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-gallery-text text-background'
                    : 'bg-gallery-accent/10 text-gallery-accent hover:bg-gallery-accent/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading artworks...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No artworks found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}