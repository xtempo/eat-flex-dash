import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Flame, Leaf, Utensils } from "lucide-react";
import menuImage from "@/assets/menu-showcase.jpg";

const MenuPreview = () => {
  const featuredDishes = [
    {
      id: 1,
      name: "Truffle Risotto",
      description: "Creamy arborio rice with wild mushrooms and truffle oil",
      price: 28,
      rating: 4.9,
      image: menuImage,
      badges: ["Chef's Special", "Vegetarian"],
      spicy: false,
      popular: true
    },
    {
      id: 2,
      name: "Grilled Salmon",
      description: "Atlantic salmon with lemon herb butter and seasonal vegetables",
      price: 32,
      rating: 4.8,
      image: menuImage,
      badges: ["Healthy Choice"],
      spicy: false,
      popular: true
    },
    {
      id: 3,
      name: "Spicy Arrabiata",
      description: "House-made pasta with spicy tomato sauce and fresh basil",
      price: 24,
      rating: 4.7,
      image: menuImage,
      badges: ["Spicy"],
      spicy: true,
      popular: false
    }
  ];

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
              <Utensils className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Our Menu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-restaurant-dark mb-4">
            Crafted with Passion, Served with Love
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our signature dishes, each prepared with the finest ingredients 
            and crafted by our expert chefs.
          </p>
        </div>

        {/* Featured Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredDishes.map((dish, index) => (
            <Card 
              key={dish.id} 
              className="overflow-hidden hover:shadow-warm transition-all duration-300 animate-slide-up group"
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
                    <Badge className="bg-restaurant-red text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                  {dish.spicy && (
                    <Badge className="bg-orange-500 text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full text-sm font-semibold text-restaurant-dark">
                  ${dish.price}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-restaurant-dark">{dish.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-restaurant-gold text-restaurant-gold" />
                      <span className="text-sm text-muted-foreground">{dish.rating}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  {dish.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dish.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
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
            className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;