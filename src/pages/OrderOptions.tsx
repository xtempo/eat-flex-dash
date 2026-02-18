import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Home, Store, UtensilsCrossed, MapPin, Phone, FileText,
  CreditCard, Banknote, Wallet, ShieldCheck, Loader2, ArrowLeft, ArrowRight, ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import LocationPicker from '@/components/LocationPicker';
import DeliveryRoutePreview from '@/components/DeliveryRoutePreview';

type OrderType = 'home_delivery' | 'pickup' | 'dine_in';
type PaymentMethod = 'online' | 'cod';

const orderTypeConfig = {
  home_delivery: {
    icon: Home,
    title: 'Home Delivery',
    description: 'Get your order delivered to your doorstep',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  pickup: {
    icon: Store,
    title: 'Pickup at Venue',
    description: 'Order ahead and pick up at our restaurant',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  dine_in: {
    icon: UtensilsCrossed,
    title: 'Dine In',
    description: "Already at our restaurant? Order from your table",
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
};

const OrderOptions = () => {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = orderType === 'home_delivery' ? 2.99 : 0;
  const tax = total * 0.08;
  const grandTotal = total + deliveryFee + tax;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    toast({ variant: 'destructive', title: 'Please sign in', description: 'You need to be signed in to place an order.' });
    navigate('/auth');
    return null;
  }

  const canProceedToStep2 = orderType !== null;

  const canPlaceOrder = () => {
    if (!phone) return false;
    if (orderType === 'home_delivery' && !deliveryCoords) return false;
    if (orderType === 'dine_in' && !tableNumber) return false;
    return true;
  };

  const getDeliveryAddressForOrder = () => {
    if (orderType === 'home_delivery') return deliveryAddress;
    if (orderType === 'pickup') return 'Pickup at restaurant';
    return `Dine-in - Table ${tableNumber}`;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: grandTotal,
          delivery_address: getDeliveryAddressForOrder(),
          delivery_lat: deliveryCoords?.lat ?? null,
          delivery_lng: deliveryCoords?.lng ?? null,
          phone,
          notes: notes || null,
          payment_status: paymentMethod === 'cod' ? 'cash_on_delivery' : 'pending',
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        item_name: item.name,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (paymentMethod === 'online') {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
          body: { orderId: order.id, amount: grandTotal },
        });
        if (paymentError) throw paymentError;
        clearCart();
        window.location.href = paymentData.url;
      } else {
        clearCart();
        toast({ title: 'Order placed successfully!', description: 'Your order has been confirmed. Pay with cash upon delivery.' });
        navigate('/orders');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error processing order', description: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <span>1</span>
            <span className="hidden sm:inline">Order Type</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <span>2</span>
            <span className="hidden sm:inline">Details & Payment</span>
          </div>
        </div>

        {/* Step 1: Order Type Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">How would you like your order?</h1>
              <p className="text-muted-foreground">Choose your preferred order type</p>
            </div>

            <div className="grid gap-4">
              {(Object.entries(orderTypeConfig) as [OrderType, typeof orderTypeConfig.home_delivery][]).map(([key, config]) => {
                const Icon = config.icon;
                const selected = orderType === key;
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selected ? 'ring-2 ring-primary shadow-md' : 'hover:border-primary/40'}`}
                    onClick={() => setOrderType(key)}
                  >
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className={`p-3 rounded-xl ${config.bg}`}>
                        <Icon className={`h-7 w-7 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{config.title}</p>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                        {selected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => navigate('/cart')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
              </Button>
              <Button
                disabled={!canProceedToStep2}
                onClick={() => setStep(2)}
                className="bg-gradient-warm hover:opacity-90"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details & Payment */}
        {step === 2 && orderType && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
              <p className="text-muted-foreground">
                {orderType === 'home_delivery' && 'Enter your delivery details'}
                {orderType === 'pickup' && 'Provide your contact info for pickup'}
                {orderType === 'dine_in' && 'Enter your table number'}
              </p>
            </div>

            {/* Order Type Badge */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center gap-3 p-4">
                {(() => {
                  const config = orderTypeConfig[orderType];
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{config.title}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change</Button>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Delivery Location (only for home delivery) */}
            {orderType === 'home_delivery' && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">Click on the map or search for your delivery address</p>
                  <LocationPicker
                    onLocationSelect={(location) => {
                      setDeliveryAddress(location.address);
                      setDeliveryCoords({ lat: location.lat, lng: location.lng });
                    }}
                  />
                  {deliveryCoords && (
                    <>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-sm font-medium">{deliveryAddress}</p>
                      </div>
                      <DeliveryRoutePreview customerLocation={deliveryCoords} />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dine-in Table Number */}
            {orderType === 'dine_in' && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    Table Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="table" className="mb-2 block">
                    Table Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="table"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. T-12"
                    className="h-11"
                  />
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
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
                  onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                  className="space-y-3"
                >
                  <label
                    htmlFor="pay-online"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                  >
                    <RadioGroupItem value="online" id="pay-online" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Pay Online</p>
                      <p className="text-xs text-muted-foreground">Secure payment via Stripe (Credit/Debit Card)</p>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </label>

                  <label
                    htmlFor="pay-cod"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                  >
                    <RadioGroupItem value="cod" id="pay-cod" />
                    <Banknote className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {orderType === 'dine_in' ? 'Pay at Counter' : orderType === 'pickup' ? 'Pay on Pickup' : 'Cash on Delivery'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {orderType === 'dine_in' ? 'Pay at the counter after your meal' : orderType === 'pickup' ? 'Pay when you pick up your order' : 'Pay with cash when your order arrives'}
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {orderType === 'home_delivery' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
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
                  onClick={handlePlaceOrder}
                  disabled={loading || !canPlaceOrder()}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : paymentMethod === 'online' ? (
                    <><CreditCard className="mr-2 h-5 w-5" /> Pay {formatPrice(grandTotal)}</>
                  ) : (
                    <><Banknote className="mr-2 h-5 w-5" /> Place Order — {formatPrice(grandTotal)}</>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{paymentMethod === 'online' ? 'Secure payment powered by Stripe' : 'Pay on arrival'}</span>
                </div>
              </CardFooter>
            </Card>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderOptions;
