import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  const quickLinks = [
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Reservations", href: "#" },
    { name: "Private Events", href: "#" },
    { name: "Catering", href: "#" }
  ];

  return (
    <footer className="bg-restaurant-dark text-restaurant-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-warm rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">R</span>
              </div>
              <span className="text-2xl font-bold">Bella Vista</span>
            </div>
            <p className="text-restaurant-cream/80 leading-relaxed">
              Where tradition meets innovation. Experience exquisite flavors and 
              unforgettable moments at our award-winning restaurant.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-restaurant-cream/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-restaurant-cream/80 hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-restaurant-cream/80">
                  <p>123 Gourmet Street</p>
                  <p>Culinary District, CD 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-restaurant-cream/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-restaurant-cream/80">info@bellavista.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opening Hours</h3>
            <div className="space-y-2 text-restaurant-cream/80">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>11am - 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Sunday</span>
                <span>11am - 11pm</span>
              </div>
              <div className="pt-2 border-t border-restaurant-cream/20">
                <p className="text-sm">Kitchen closes 30 minutes before closing time</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-restaurant-cream/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-restaurant-cream/60 text-sm">
            © 2024 Bella Vista Restaurant. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-restaurant-cream/60 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-restaurant-red fill-current" />
            <span>for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;