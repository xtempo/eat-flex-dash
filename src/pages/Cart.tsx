import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, Phone, FileText, CreditCard, Loader2, ShieldCheck, Banknote, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import LocationPicker from '@/components/LocationPicker';
import DeliveryRoutePreview from '@/components/DeliveryRoutePreview';
import ExpandableDescription from '@/components/ExpandableDescription';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  const deliveryFee = 2.99;
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please sign in",
        description: "You need to be signed in to place an order.",
      });
      navigate('/auth');
      return;
    }

    if (!deliveryAddress || !phone || !deliveryCoords) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a delivery location on the map and provide phone number.",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: grandTotal,
          delivery_address: deliveryAddress,
          delivery_lat: deliveryCoords.lat,
          delivery_lng: deliveryCoords.lng,
          phone,
          notes: notes || null,
          payment_status: paymentMethod === 'cod' ? 'cash_on_delivery' : 'pending',
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        item_name: item.name,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (paymentMethod === 'online') {
        // Create Stripe payment session
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
          'create-payment',
          {
            body: {
              orderId: order.id,
              amount: grandTotal,
            },
          }
        );

        if (paymentError) throw paymentError;

        clearCart();
        window.location.href = paymentData.url;
      } else {
        // Cash on Delivery - just confirm the order
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: "Your order has been confirmed. Pay with cash upon delivery.",
        });
        navigate('/orders');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error processing order",
        description: error.message,
      });
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
          <Badge variant="secondary" className="ml-2">{items.length} items</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Delivery Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Delivery Location <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Click on the map or search for your delivery address
                  </p>
                  <LocationPicker
                    onLocationSelect={(location) => {
                      setDeliveryAddress(location.address);
                      setDeliveryCoords({ lat: location.lat, lng: location.lng });
                    }}
                  />
                  
                  {deliveryCoords && (
                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm font-medium text-foreground">{deliveryAddress}</p>
                    </div>
                  )}
                </div>

                {/* Route Preview */}
                {deliveryCoords && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      Delivery Route Preview
                    </Label>
                    <DeliveryRoutePreview customerLocation={deliveryCoords} />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your contact number"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      Special Instructions
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests?"
                      className="min-h-[44px] resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as 'online' | 'cod')}
                  className="space-y-3"
                >
                  <label
                    htmlFor="online"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <RadioGroupItem value="online" id="online" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Pay Online</p>
                      <p className="text-xs text-muted-foreground">Secure payment via Stripe (Credit/Debit Card)</p>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </label>

                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay with cash when your order arrives</p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
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

                {!user && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Please sign in to complete your order
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3 pt-0">
                <Button
                  className="w-full h-12 bg-gradient-warm hover:opacity-90 text-base font-semibold"
                  onClick={handlePlaceOrder}
                  disabled={loading || !deliveryCoords || !phone}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay {formatPrice(grandTotal)}
                    </>
                  ) : (
                    <>
                      <Banknote className="mr-2 h-5 w-5" />
                      Place Order (COD) - {formatPrice(grandTotal)}
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{paymentMethod === 'online' ? 'Secure payment powered by Stripe' : 'Pay cash on delivery'}</span>
                </div>
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