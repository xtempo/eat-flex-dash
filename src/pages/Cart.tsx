import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ExpandableDescription from '@/components/ExpandableDescription';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const deliveryFee = 2.99;
  const tax = total * 0.08;
  const grandTotal = total + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some delicious items from our menu to get started!</p>
            <Button onClick={() => navigate('/menu')} size="lg" className="bg-gradient-warm hover:opacity-90">
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">Your Cart</h1>
          <Badge variant="secondary" className="ml-2">{items.length} items</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="font-semibold text-base">{item.name}</h3>
                            {item.description && (
                              <ExpandableDescription 
                                description={item.description} 
                                maxLength={60} 
                                className="mt-1"
                              />
                            )}
                          </div>
                          <p className="text-lg font-bold text-primary whitespace-nowrap">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 pt-0">
                <Button
                  className="w-full h-12 bg-gradient-warm hover:opacity-90 text-base font-semibold"
                  onClick={() => navigate('/order-options')}
                >
                  Proceed to Order <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>

            <Button 
              variant="ghost" 
              className="w-full mt-3" 
              onClick={() => navigate('/menu')}
            >
              ← Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
