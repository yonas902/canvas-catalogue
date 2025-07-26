import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-gallery-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-wider text-gallery-text mb-4">
              Contact Us
            </h1>
            <p className="text-gallery-accent max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with our team for inquiries about artworks, 
              private viewings, or consultation services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-gallery-text mb-6">Get in Touch</h2>
              <p className="text-gallery-accent mb-8">
                Our team is here to assist you with any questions about our collection, 
                purchasing process, or to schedule a private viewing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-gallery-accent mt-1" />
                <div>
                  <h3 className="font-medium text-gallery-text">Address</h3>
                  <p className="text-gallery-accent">
                    123 Gallery Street<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-gallery-accent mt-1" />
                <div>
                  <h3 className="font-medium text-gallery-text">Phone</h3>
                  <p className="text-gallery-accent">+1 (212) 555-0123</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-gallery-accent mt-1" />
                <div>
                  <h3 className="font-medium text-gallery-text">Email</h3>
                  <p className="text-gallery-accent">info@artelier.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-5 w-5 text-gallery-accent mt-1" />
                <div>
                  <h3 className="font-medium text-gallery-text">Hours</h3>
                  <div className="text-gallery-accent space-y-1">
                    <p>Tuesday - Saturday<br />10:00 AM - 6:00 PM</p>
                    <p>Sunday<br />12:00 PM - 5:00 PM</p>
                    <p>Closed Mondays</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gallery-border">
              <h3 className="font-medium text-gallery-text mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Button variant="gallery-outline" size="sm">Facebook</Button>
                <Button variant="gallery-outline" size="sm">Instagram</Button>
                <Button variant="gallery-outline" size="sm">Twitter</Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-2xl font-light text-gallery-text mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Your first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Your last name" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>

              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" type="tel" placeholder="Your phone number" />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px]"
                />
              </div>

              <Button variant="gallery" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 text-center border-t border-gallery-border pt-16">
          <h2 className="text-2xl font-light text-gallery-text mb-4">Stay Updated</h2>
          <p className="text-gallery-accent mb-8 max-w-2xl mx-auto">
            Subscribe to receive updates about exhibitions and events, new artwork arrivals, 
            and exclusive previews for collectors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button variant="gallery">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;