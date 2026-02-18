import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie, Heart, Star } from "lucide-react";
import ExpandableDescription from "./ExpandableDescription";
import { useCurrency } from "@/contexts/CurrencyContext";

const Cookies = () => {
  const { formatPrice } = useCurrency();

  const cookieItems = [
    {
      name: "Chocolate Chip",
      description: "Classic cookies loaded with premium chocolate chips",
      priceUSD: 3.99,
      popular: true,
    },
    {
      name: "Double Chocolate",
      description: "Rich chocolate cookies with dark chocolate chunks",
      priceUSD: 4.49,
      popular: false,
    },
    {
      name: "Oatmeal Raisin",
      description: "Wholesome oats with sweet raisins and cinnamon",
      priceUSD: 3.49,
      popular: false,
    },
    {
      name: "White Chocolate Macadamia",
      description: "Buttery cookies with white chocolate and macadamia nuts",
      priceUSD: 4.99,
      popular: true,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">Freshly Baked Cookies</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Indulge in our handcrafted cookies, baked fresh daily with premium ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cookieItems.map((cookie, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  {cookie.popular && (
                    <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{cookie.name}</h3>
                <ExpandableDescription 
                  description={cookie.description} 
                  maxLength={50} 
                  className="text-sm text-muted-foreground mb-4"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{formatPrice(cookie.priceUSD)}</span>
                  <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/menu">
            <Button size="lg">
              View All Desserts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cookies;
