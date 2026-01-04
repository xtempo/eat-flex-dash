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
              <h2 className="text-3xl md:text-4xl font-bold text-tibetan-dark leading-tight">
                Ancient Wisdom, Modern Warmth
              </h2>
              <p className="text-lg text-muted-foreground">
                Nestled in the heart of the city, Himalayan Kitchen brings the authentic flavors 
                of Tibet and Ladakh to your table. Our recipes have been passed down through 
                generations of Himalayan families.
              </p>
              <p className="text-muted-foreground">
                Every dish we serve represents our commitment to preserving traditional cooking 
                methods while creating a warm, welcoming atmosphere that honors our heritage.
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-tibetan-gold text-tibetan-dark px-3 py-1">
                Authentic Recipes
              </Badge>
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                Family Heritage
              </Badge>
              <Badge className="bg-tibetan-ochre text-white px-3 py-1">
                5-Star Rated
              </Badge>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                ornate
                className="border-none shadow-elegant hover:shadow-warm transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-warm rounded-full mx-auto">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-tibetan-dark">
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
          <blockquote className="text-2xl md:text-3xl font-light text-tibetan-dark italic leading-relaxed">
            "Food is a sacred offering — it nourishes the body, warms the soul, and connects us to our ancestors."
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold text-primary">Traditional Himalayan Proverb</p>
            <p className="text-sm text-muted-foreground">བཀྲ་ཤིས་བདེ་ལེགས</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;