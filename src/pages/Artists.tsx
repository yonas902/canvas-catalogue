import { artists } from '@/data/artworks';
import { Button } from '@/components/ui/button';

const Artists = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-gallery-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-wider text-gallery-text mb-4">
              Featured Artists
            </h1>
            <p className="text-gallery-accent max-w-2xl mx-auto">
              Meet the talented artists whose works grace our collection. Each brings a unique perspective and mastery to their craft.
            </p>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {artists.map((artist) => (
            <div key={artist.id} className="group text-center">
              <div className="aspect-square overflow-hidden mb-6 bg-gray-50">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-light text-gallery-text mb-2">
                    {artist.name}
                  </h2>
                  <p className="text-sm text-gallery-accent">
                    Born {artist.birthYear} • {artist.nationality}
                  </p>
                  <p className="text-sm text-gallery-accent">
                    {artist.education}
                  </p>
                </div>
                
                <p className="text-gallery-text leading-relaxed text-sm">
                  {artist.bio}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gallery-text mb-2">Recent Exhibitions</h4>
                    <ul className="text-xs text-gallery-accent space-y-1">
                      {artist.exhibitions.slice(0, 2).map((exhibition, index) => (
                        <li key={index}>{exhibition}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {artist.awards.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gallery-text mb-2">Awards</h4>
                      <ul className="text-xs text-gallery-accent space-y-1">
                        {artist.awards.slice(0, 2).map((award, index) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button variant="gallery-outline" size="sm">
                  View Artworks
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artists;