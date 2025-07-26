import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-gallery-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-wider text-gallery-text mb-8">
              About Artelier
            </h1>
            <p className="text-lg text-gallery-accent leading-relaxed">
              A curated platform dedicated to showcasing exceptional contemporary art from emerging and established artists worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-light text-gallery-text mb-6">Our Story</h2>
            <div className="space-y-4 text-gallery-accent leading-relaxed">
              <p>
                Founded in 2020, Artelier emerged from a passion for connecting art lovers with exceptional contemporary works. 
                We believe that art has the power to transform spaces and inspire minds, and our mission is to make outstanding 
                artworks accessible to collectors and enthusiasts alike.
              </p>
              <p>
                Our carefully curated collection features works from both emerging talents and established masters, 
                each piece selected for its artistic merit, cultural significance, and emotional resonance. We work 
                directly with artists and their estates to ensure authenticity and provide collectors with the highest 
                quality artworks.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gallery-text mb-6">Our Vision</h2>
            <div className="space-y-4 text-gallery-accent leading-relaxed">
              <p>
                We envision a world where exceptional art is celebrated and accessible. Through our platform, we aim to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Support artists by providing a prestigious platform for their work</li>
                <li>Educate collectors about the significance and context of contemporary art</li>
                <li>Foster a community of art enthusiasts and collectors</li>
                <li>Preserve and promote artistic heritage for future generations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gallery-text mb-6">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gallery-text mb-3">Curatorial Excellence</h3>
                <p className="text-gallery-accent">
                  Our team of experienced curators and art historians carefully selects each work, 
                  ensuring that every piece meets our high standards for artistic quality and cultural relevance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gallery-text mb-3">Artist Relationships</h3>
                <p className="text-gallery-accent">
                  We work directly with artists and their representatives, fostering long-term relationships 
                  that benefit both the creators and our collectors.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gallery-text mb-3">Authenticity Guarantee</h3>
                <p className="text-gallery-accent">
                  Every artwork comes with a certificate of authenticity and detailed provenance, 
                  giving collectors confidence in their investment.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gallery-text mb-3">Expert Guidance</h3>
                <p className="text-gallery-accent">
                  Our team provides personalized consultation to help collectors build meaningful 
                  collections that reflect their taste and vision.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center pt-8 border-t border-gallery-border">
            <h2 className="text-2xl font-light text-gallery-text mb-6">Ready to Start Your Collection?</h2>
            <p className="text-gallery-accent mb-8 max-w-2xl mx-auto">
              Whether you're a seasoned collector or just beginning your journey into art collecting, 
              we're here to help you discover works that will inspire and delight you for years to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gallery">
                Browse Collection
              </Button>
              <Button variant="gallery-outline">
                Schedule Consultation
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;