import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Mountain } from "lucide-react";
import heroImage from "@/assets/hero-tibetan.jpg";

const Hero = () => {
  return (
    <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-subtle relative overflow-hidden">
      {/* Decorative Tibetan pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-tibetan-gold">࿕</div>
        <div className="absolute top-40 right-20 text-4xl text-tibetan-maroon">☸</div>
        <div className="absolute bottom-32 left-1/4 text-5xl text-tibetan-gold">࿐</div>
        <div className="absolute bottom-20 right-1/3 text-3xl text-tibetan-maroon">࿑</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-tibetan-gold">
                <Mountain className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wider uppercase">From the Roof of the World</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-tibetan-dark leading-tight">
                Authentic Himalayan
                <span className="text-primary block">Flavors & Traditions</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md font-light">
                Journey through the ancient culinary heritage of Tibet and Ladakh. 
                Each dish is a sacred offering of warmth, nourishment, and centuries-old wisdom.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-tibetan-gold/30">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <span className="text-xl">🥟</span>
                </div>
                <div className="text-2xl font-bold text-tibetan-dark">50+</div>
                <div className="text-sm text-muted-foreground">Traditional Dishes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-tibetan-gold/10 rounded-full mx-auto mb-2">
                  <Clock className="w-6 h-6 text-tibetan-gold" />
                </div>
                <div className="text-2xl font-bold text-tibetan-dark">30min</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-tibetan-dark">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-warm hover:opacity-90 text-lg px-8 shadow-warm"
              >
                Order Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-tibetan-gold text-tibetan-dark hover:bg-tibetan-gold hover:text-tibetan-dark"
              >
                Explore Menu
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up">
            <div className="shadow-elegant rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Authentic Tibetan cuisine"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tibetan-dark/40 to-transparent" />
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 bg-tibetan-gold text-tibetan-dark p-4 rounded-full shadow-warm animate-float">
              <span className="text-2xl">☸</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-3 rounded-full shadow-elegant animate-float" style={{ animationDelay: "1s" }}>
              <Mountain className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
