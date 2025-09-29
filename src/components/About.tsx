import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Clock, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for culinary excellence by leading food critics"
    },
    {
      icon: Users,
      title: "Expert Chefs",
      description: "Our team brings decades of international culinary experience"
    },
    {
      icon: Clock,
      title: "Fresh Daily",
      description: "Ingredients sourced daily from local farms and markets"
    },
    {
      icon: Heart,
      title: "Family Recipe",
      description: "Traditional recipes passed down through generations"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium uppercase tracking-wider">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-restaurant-dark leading-tight">
                Where Tradition Meets Innovation
              </h2>
              <p className="text-lg text-muted-foreground">
                Founded in 1985, Bella Vista has been serving authentic Mediterranean cuisine 
                with a modern twist. Our passion for food excellence and warm hospitality 
                has made us a beloved destination for food enthusiasts.
              </p>
              <p className="text-muted-foreground">
                Every dish we serve represents our commitment to quality, authenticity, and 
                the joy of sharing great food with great people. We believe dining is not 
                just about eating—it's about creating memories.
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-restaurant-gold text-restaurant-dark px-3 py-1">
                Michelin Recommended
              </Badge>
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                Best Local Restaurant 2023
              </Badge>
              <Badge className="bg-restaurant-red text-white px-3 py-1">
                5-Star Rated
              </Badge>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="border-none shadow-elegant hover:shadow-warm transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-warm rounded-full mx-auto">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-restaurant-dark">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-20 text-center max-w-4xl mx-auto animate-fade-in">
          <blockquote className="text-2xl md:text-3xl font-light text-restaurant-dark italic leading-relaxed">
            "Food is our common ground, a universal experience that brings people together."
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold text-primary">Chef Marco Antonelli</p>
            <p className="text-sm text-muted-foreground">Head Chef & Owner</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;