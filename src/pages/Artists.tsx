import { Button } from '@/components/ui/button';

const Artists = () => {
  const featuredArtist = {
    name: "Sofia Rodriguez",
    title: "Contemporary abstract artist exploring color and emotion",
    bio: "Sofia Rodriguez is a visionary contemporary artist whose work explores the intersection of color, emotion, and abstract expression. Her unique approach to painting combines traditional techniques with modern sensibilities, creating pieces that resonate deeply with viewers and challenge conventional perceptions of abstract art.",
    image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png",
    birthYear: "1985",
    nationality: "Spanish-American",
    education: "MFA from Yale School of Art",
    exhibitions: [
      "Museum of Modern Art, New York - 'Abstract Visions' (2024)",
      "Tate Modern, London - 'Contemporary Masters' (2023)",
      "Whitney Biennial, New York (2022)",
      "Venice Biennale, Italy (2021)"
    ],
    awards: [
      "Guggenheim Fellowship (2023)",
      "National Endowment for the Arts Grant (2022)",
      "Pollock-Krasner Foundation Grant (2020)"
    ],
    collections: [
      "Museum of Modern Art, New York",
      "Tate Modern, London", 
      "Guggenheim Museum, New York",
      "Private collections worldwide"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredArtist.image})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-6">
              Featured Artist
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 leading-relaxed">
              Connect directly with exceptional talent and discover their perfect artistic vision
            </p>
            <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm px-8 py-3">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Artist Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-light text-gallery-text mb-4">
                {featuredArtist.name}
              </h2>
              <p className="text-xl text-gallery-accent mb-6">
                {featuredArtist.title}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gallery-accent mb-6">
                <span>Born {featuredArtist.birthYear}</span>
                <span>•</span>
                <span>{featuredArtist.nationality}</span>
                <span>•</span>
                <span>{featuredArtist.education}</span>
              </div>
            </div>
            
            <p className="text-gallery-text leading-relaxed text-lg">
              {featuredArtist.bio}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gallery-text mb-4">Major Exhibitions</h3>
                <ul className="space-y-2">
                  {featuredArtist.exhibitions.map((exhibition, index) => (
                    <li key={index} className="text-gallery-accent">
                      {exhibition}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gallery-text mb-4">Awards & Recognition</h3>
                <ul className="space-y-2">
                  {featuredArtist.awards.map((award, index) => (
                    <li key={index} className="text-gallery-accent">
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={featuredArtist.image}
                alt={featuredArtist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-medium text-gallery-text mb-3">Collections Include</h4>
              <div className="space-y-1">
                {featuredArtist.collections.map((collection, index) => (
                  <p key={index} className="text-gallery-accent text-sm">
                    {collection}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-light text-gallery-text mb-6">
            Stay Updated with New Artworks
          </h2>
          <p className="text-gallery-accent mb-8">
            Join our community of art enthusiasts and be the first to discover Sofia's latest creations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gallery-text"
            />
            <Button className="bg-gallery-text text-white hover:bg-gallery-text/90 px-8 py-3 rounded-none">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;