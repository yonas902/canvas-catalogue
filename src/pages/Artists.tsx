import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Artists = () => {
  const artist = {
    name: "Elizabeth Morrison",
    title: "Contemporary Abstract Artist",
    bio: "Elizabeth Morrison's evocative works delve deep into the realms of emotion and the intersection of color, form, and emotion. Her paintings, imbued with ethereal qualities that explore the raw energy and subtle nuances of modern life through bold brushstrokes and vibrant palettes.",
    location: "New York City",
    image: "/lovable-uploads/d18616e6-e1b4-45dd-8ab4-98bad16c17ac.png",
    selectedWorks: [
      { title: "Ethereal Dreams", year: "2024", medium: "Oil on Canvas", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
      { title: "Urban Rhythms", year: "2023", medium: "Mixed Media", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
      { title: "Abstract Harmony", year: "2024", medium: "Acrylic on Canvas", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
      { title: "Color Symphony", year: "2023", medium: "Oil on Canvas", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
      { title: "Modern Canvas", year: "2024", medium: "Mixed Media", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
      { title: "Abstract Flow", year: "2024", medium: "Acrylic on Canvas", image: "/lovable-uploads/43a086ce-fb58-448e-b8ce-a65993a82fbc.png" },
    ],
    biography: "Elizabeth Morrison received her BFA from the School of Visual Arts in New York City. Her work has since been featured in solo exhibitions across the United States and Europe.",
    exhibitions: [
      "2024 • \"Contemporary Visions\" • Museum of Modern Art, New York",
      "2023 • \"Abstract Expressions\" • Guggenheim Museum, New York", 
      "2022 • \"New York Artists\" • The Met, New York",
      "2020 • \"Future of Art\" • Tate Modern, London"
    ],
    awards: [
      "2024 • Artist of the Year - New York Art Critics Association",
      "2022 • Innovation in Contemporary Art - The Art Institute",
      "2020 • Rising Star Award - International Art Foundation"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Artist Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                {artist.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {artist.title}
              </p>
              <div className="flex items-center text-gray-500 mb-6">
                <MapPin size={16} className="mr-2" />
                <span>Based in {artist.location}</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {artist.bio}
            </p>
          </div>
        </div>

        {/* Selected Works */}
        <div className="mb-20">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Selected Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artist.selectedWorks.map((work, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{work.title}</h3>
                  <p className="text-sm text-gray-600">{work.year} • {work.medium}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biography and Exhibitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Biography</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {artist.biography}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Morrison currently lives and works in New York City, where she draws inspiration from the city's dynamic
              energy and diverse cultural landscape. Her paintings often reflect themes
              of urban life, nature, and the human experience.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Through her work, Morrison seeks to create emotional connections with
              viewers, inviting them to see their own interpretations and
              experiences. Her pieces are held in private collections worldwide and have
              been featured in numerous publications.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Exhibitions & Recognition</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Exhibitions</h3>
              <ul className="space-y-2">
                {artist.exhibitions.map((exhibition, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {exhibition}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Awards & Recognition</h3>
              <ul className="space-y-2">
                {artist.awards.map((award, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">Get in Touch</h2>
          <form className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 resize-none"
              />
            </div>
            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Artists;