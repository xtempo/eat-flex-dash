import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import FloatingCart from '@/components/FloatingCart';
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
}

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('category');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading menu",
        description: error.message,
      });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url || undefined,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const getCategoryLabel = (cat: string) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Category order for display
  const categoryOrder = ['appetizers', 'indian', 'continental', 'chinese', 'italian', 'thai', 'mexican', 'main_course', 'snacks', 'soups', 'salads', 'breads', 'rice_dishes', 'noodles', 'desserts', 'drinks', 'beverages', 'specials'];
  
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Get sorted categories based on defined order
  const sortedCategories = categoryOrder.filter(cat => groupedItems[cat]?.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Our Menu</h1>
        </div>

        {/* Quick navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sortedCategories.map(cat => (
            <Button
              key={cat}
              variant="outline"
              onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })}
              className="whitespace-nowrap"
            >
              {getCategoryLabel(cat)}
            </Button>
          ))}
        </div>

        {/* Menu sections by category */}
        {sortedCategories.map(category => (
          <section key={category} id={category} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">{getCategoryLabel(category)}</h2>
              <div className="flex-1 h-px bg-border" />
              <Badge variant="outline">{groupedItems[category].length} items</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedItems[category].map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full overflow-hidden bg-secondary/20">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleAddToCart(item)} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No menu items available.</p>
          </div>
        )}
      </main>
      
      {/* Floating Cart Button */}
      <FloatingCart />
    </div>
  );
};

export default Menu;
