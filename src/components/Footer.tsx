import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Mountain } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" }
  ];

  const quickLinks = [
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Reservations", href: "#" },
    { name: "Catering", href: "#" }
  ];

  return (
    <footer className="bg-tibetan-dark text-tibetan-cream relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl">࿕</div>
        <div className="absolute top-20 right-20 text-4xl">☸</div>
        <div className="absolute bottom-10 left-1/3 text-5xl">࿐</div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
                <Mountain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold block">Himalayan Kitchen</span>
                <span className="text-xs text-tibetan-gold tracking-widest uppercase">Tibetan & Ladakhi</span>
              </div>
            </div>
            <p className="text-tibetan-cream/80 leading-relaxed font-light">
              Experience the sacred flavors of the Himalayas. Traditional recipes passed down 
              through generations, prepared with love and reverence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-tibetan-cream/10 rounded-full flex items-center justify-center hover:bg-tibetan-gold hover:text-tibetan-dark transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tibetan-gold">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-tibetan-cream/80 hover:text-tibetan-gold transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tibetan-gold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-tibetan-gold flex-shrink-0 mt-0.5" />
                <div className="text-tibetan-cream/80">
                  <p>123 Himalayan Way</p>
                  <p>Mountain District, MD 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-tibetan-gold" />
                <span className="text-tibetan-cream/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-tibetan-gold" />
                <span className="text-tibetan-cream/80">namaste@himalayankitchen.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tibetan-gold">Opening Hours</h3>
            <div className="space-y-2 text-tibetan-cream/80">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>11am - 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Sunday</span>
                <span>11am - 11pm</span>
              </div>
              <div className="pt-2 border-t border-tibetan-gold/20">
                <p className="text-sm italic">Kitchen closes 30 minutes before closing</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-tibetan-gold/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-tibetan-cream/60 text-sm">
            © 2024 Himalayan Kitchen. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-tibetan-cream/60 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span>in the spirit of</span>
            <span className="text-tibetan-gold">བཀྲ་ཤིས་བདེ་ལེགས</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
