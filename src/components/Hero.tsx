import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Utensils } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  return (
    <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">Award Winning Restaurant</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-restaurant-dark leading-tight">
                Exquisite Flavors,
                <span className="text-primary block">Unforgettable Moments</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Experience the perfect blend of traditional recipes and modern culinary artistry. 
                Every dish tells a story of passion and perfection.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <Utensils className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-restaurant-dark">150+</div>
                <div className="text-sm text-muted-foreground">Dishes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-restaurant-gold/10 rounded-full mx-auto mb-2">
                  <Clock className="w-6 h-6 text-restaurant-gold" />
                </div>
                <div className="text-2xl font-bold text-restaurant-dark">30min</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-restaurant-red/10 rounded-full mx-auto mb-2">
                  <Star className="w-6 h-6 text-restaurant-red" />
                </div>
                <div className="text-2xl font-bold text-restaurant-dark">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-warm hover:opacity-90 text-lg px-8 shadow-warm"
              >
                Order Delivery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View Menu
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img
                src={heroImage}
                alt="Exquisite restaurant dish"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-warm animate-float">
              <Utensils className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-restaurant-gold text-restaurant-dark p-3 rounded-full shadow-elegant animate-float" style={{ animationDelay: "1s" }}>
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;