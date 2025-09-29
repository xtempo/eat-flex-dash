import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["123 Gourmet Street", "Culinary District, CD 12345"],
      color: "text-primary"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["(555) 123-4567", "Call for reservations"],
      color: "text-restaurant-red"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@bellavista.com", "We'll respond within 24h"],
      color: "text-restaurant-gold"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Thu: 11am-10pm", "Fri-Sun: 11am-11pm"],
      color: "text-accent"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-restaurant-dark mb-4">
            Visit Us Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Ready to experience exceptional dining? We'd love to welcome you to Bella Vista.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="border-none shadow-elegant hover:shadow-warm transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto ${info.color} bg-current/10`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <h3 className="font-semibold text-restaurant-dark">
                      {info.title}
                    </h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className={`text-sm ${idx === 0 ? 'font-medium text-restaurant-dark' : 'text-muted-foreground'}`}>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden animate-slide-up">
              <div className="h-64 bg-gradient-subtle flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">123 Gourmet Street, Culinary District</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-restaurant-dark">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-restaurant-dark">First Name</label>
                  <Input placeholder="John" className="border-border focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-restaurant-dark">Last Name</label>
                  <Input placeholder="Doe" className="border-border focus:border-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-restaurant-dark">Email</label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="border-border focus:border-primary" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-restaurant-dark">Phone (Optional)</label>
                <Input placeholder="(555) 123-4567" className="border-border focus:border-primary" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-restaurant-dark">Message</label>
                <Textarea 
                  placeholder="Tell us about your reservation needs or any questions you have..."
                  className="min-h-[120px] border-border focus:border-primary"
                />
              </div>
              
              <Button className="w-full bg-gradient-warm hover:opacity-90 text-lg py-3">
                Send Message
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                We typically respond within 24 hours. For urgent matters, please call us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;