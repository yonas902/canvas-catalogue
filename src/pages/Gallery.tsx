import { useState } from 'react';
import ArtworkCard from '@/components/ArtworkCard';
import { artworks } from '@/data/artworks';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const [filter, setFilter] = useState<string>('all');
  const categories = ['all', 'Painting', 'Abstract', 'Landscape', 'Mixed Media', 'Botanical'];

  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-gallery-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-wider text-gallery-text mb-4">
              Curated Artworks
            </h1>
            <p className="text-gallery-accent max-w-2xl mx-auto">
              Discover exceptional pieces from contemporary artists, each carefully selected for their artistic merit and cultural significance.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="border-b border-gallery-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "gallery" : "gallery-outline"}
                onClick={() => setFilter(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              id={artwork.id}
              title={artwork.title}
              artist={artwork.artist}
              year={artwork.year}
              price={artwork.price}
              image={artwork.image}
              medium={artwork.medium}
              dimensions={artwork.dimensions}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;