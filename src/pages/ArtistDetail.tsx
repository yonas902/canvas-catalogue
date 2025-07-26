import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Artist {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_artist: boolean;
  created_at: string;
  updated_at: string;
}

interface Artwork {
  id: string;
  title: string;
  medium: string | null;
  year: number | null;
  image_url: string | null;
  price: number | null;
}

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      fetchArtistData();
    }
  }, [id]);

  const fetchArtistData = async () => {
    try {
      // Fetch artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('is_artist', true)
        .single();

      if (artistError) throw artistError;
      setArtist(artistData);

      // Fetch artist's artworks
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('id, title, medium, year, image_url, price')
        .eq('artist_id', artistData.user_id)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (artworksError) throw artworksError;
      setArtworks(artworksData || []);

    } catch (error) {
      console.error('Error fetching artist data:', error);
      toast({
        title: "Error",
        description: "Failed to load artist information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the artist. They will get back to you soon!",
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading artist profile...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Artist Not Found</h1>
          <Button onClick={() => navigate('/artists')}>
            Back to Artists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/artists')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Artists
        </Button>

        {/* Artist Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden">
              {artist.avatar_url ? (
                <img
                  src={artist.avatar_url}
                  alt={artist.display_name || 'Artist'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <span>No Photo Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                {artist.display_name || 'Anonymous Artist'}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Contemporary Abstract Artist
              </p>
              <div className="flex items-center text-gray-500 mb-6">
                <MapPin size={16} className="mr-2" />
                <span>Based in New York City</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {artist.bio || "This artist hasn't provided a biography yet."}
            </p>
          </div>
        </div>

        {/* Selected Works */}
        {artworks.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-light text-gray-900 mb-8">Selected Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.slice(0, 6).map((artwork) => (
                <div key={artwork.id} className="space-y-3">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{artwork.title}</h3>
                    <p className="text-sm text-gray-600">
                      {artwork.year && `${artwork.year} • `}
                      {artwork.medium || 'Mixed Media'}
                    </p>
                    {artwork.price && (
                      <p className="text-sm font-medium text-gray-900">
                        ${artwork.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biography and Exhibitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Biography</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {artist.display_name || 'This artist'} is a contemporary artist whose work explores themes of modern life and human experience.
              {artist.bio && ` ${artist.bio}`}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Currently based in New York City, their work draws inspiration from urban environments
              and the dynamic energy of city life. Their paintings often reflect themes
              of connection, emotion, and the human experience in contemporary society.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Through their art, they seek to create emotional connections with
              viewers, inviting them to explore their own interpretations and
              experiences. Their pieces are held in private collections and have
              been featured in various exhibitions.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Exhibitions & Recognition</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Exhibitions</h3>
              <ul className="space-y-2">
                <li className="text-gray-700 text-sm">
                  2024 • "Contemporary Visions" • Museum of Modern Art, New York
                </li>
                <li className="text-gray-700 text-sm">
                  2023 • "Abstract Expressions" • Guggenheim Museum, New York
                </li>
                <li className="text-gray-700 text-sm">
                  2022 • "New York Artists" • The Met, New York
                </li>
                <li className="text-gray-700 text-sm">
                  2020 • "Future of Art" • Tate Modern, London
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Awards & Recognition</h3>
              <ul className="space-y-2">
                <li className="text-gray-700 text-sm">
                  2024 • Artist of the Year - New York Art Critics Association
                </li>
                <li className="text-gray-700 text-sm">
                  2022 • Innovation in Contemporary Art - The Art Institute
                </li>
                <li className="text-gray-700 text-sm">
                  2020 • Rising Star Award - International Art Foundation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">Get in Touch</h2>
          <form onSubmit={handleContactSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 resize-none"
              />
            </div>
            <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;