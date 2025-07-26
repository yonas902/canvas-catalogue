import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Artist {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  artwork_count: number;
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      // First get all profiles marked as artists
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_artist', true);

      if (profilesError) throw profilesError;

      // Then get artwork counts for each artist
      const artistsWithCounts = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count } = await supabase
            .from('artworks')
            .select('*', { count: 'exact', head: true })
            .eq('artist_id', profile.user_id);

          return {
            ...profile,
            artwork_count: count || 0
          };
        })
      );

      setArtists(artistsWithCounts);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast({
        title: "Error",
        description: "Failed to load artists. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading artists...</div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4">Featured Artists</h1>
            <p className="text-gray-600 mb-8">No artists found. Artists will appear here once they create profiles.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Featured Artists</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented artists whose works grace our collection. Each brings a unique perspective and mastery to their craft.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="group">
              <div className="space-y-4">
                {/* Artist Image */}
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  {artist.avatar_url ? (
                    <img
                      src={artist.avatar_url}
                      alt={artist.display_name || 'Artist'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-gray-400 text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                        <span className="text-sm">No Photo</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Artist Info */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">
                      {artist.display_name || 'Anonymous Artist'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {artist.artwork_count} {artist.artwork_count === 1 ? 'artwork' : 'artworks'}
                    </p>
                  </div>
                  
                  {artist.bio && (
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Future: Navigate to individual artist page
                      toast({
                        title: "Coming Soon",
                        description: "Individual artist pages will be available soon.",
                      });
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Are you an artist?
          </h2>
          <p className="text-gray-600 mb-6">
            Join our community and showcase your work to art enthusiasts worldwide.
          </p>
          <Button className="bg-gray-900 text-white hover:bg-gray-800">
            Join as Artist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Artists;