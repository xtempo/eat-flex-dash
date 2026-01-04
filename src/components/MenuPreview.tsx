import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Flame, Leaf, Mountain } from "lucide-react";
import momosImage from "@/assets/momos-dish.jpg";
import thukpaImage from "@/assets/thukpa-soup.jpg";
import tingmoImage from "@/assets/tingmo-shapta.jpg";

const MenuPreview = () => {
  const featuredDishes = [
    {
      id: 1,
      name: "Steamed Momos",
      description: "Hand-crafted Tibetan dumplings with seasoned vegetables and special dipping sauce",
      price: 12,
      rating: 4.9,
      image: momosImage,
      badges: ["House Special", "Vegetarian"],
      spicy: false,
      popular: true
    },
    {
      id: 2,
      name: "Thukpa Noodle Soup",
      description: "Hearty Himalayan noodle soup with tender vegetables and aromatic herbs",
      price: 14,
      rating: 4.8,
      image: thukpaImage,
      badges: ["Comfort Food"],
      spicy: false,
      popular: true
    },
    {
      id: 3,
      name: "Tingmo & Shapta",
      description: "Fluffy steamed bread with spicy stir-fried beef in traditional Tibetan spices",
      price: 18,
      rating: 4.7,
      image: tingmoImage,
      badges: ["Spicy", "Traditional"],
      spicy: true,
      popular: false
    }
  ];

  return (
    <section id="menu" className="py-20 bg-background relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 text-6xl">☸</div>
        <div className="absolute bottom-20 left-20 text-4xl">࿐</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-tibetan-gold mb-4">
            <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
              <Mountain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Our Menu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-tibetan-dark mb-4">
            Sacred Recipes from the Himalayas
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Discover authentic Tibetan and Ladakhi delicacies, each prepared with 
            traditional methods and the finest Himalayan ingredients.
          </p>
        </div>

        {/* Featured Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredDishes.map((dish, index) => (
            <Card 
              key={dish.id} 
              className="overflow-hidden hover:shadow-warm transition-all duration-300 animate-slide-up group border-tibetan-gold/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {dish.popular && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                  {dish.spicy && (
                    <Badge className="bg-tibetan-ochre text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-tibetan-cream/95 px-3 py-1 rounded-full text-sm font-semibold text-tibetan-dark">
                  ${dish.price}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-tibetan-dark">{dish.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-tibetan-gold text-tibetan-gold" />
                      <span className="text-sm text-muted-foreground">{dish.rating}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground font-light">
                  {dish.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dish.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs bg-tibetan-cream text-tibetan-dark">
                      {badge === "Vegetarian" && <Leaf className="w-3 h-3 mr-1" />}
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full bg-gradient-warm hover:opacity-90"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-3 text-lg border-tibetan-gold text-tibetan-dark hover:bg-tibetan-gold hover:text-tibetan-dark"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
