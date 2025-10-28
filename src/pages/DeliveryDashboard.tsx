import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssignedOrder {
  id: string;
  total: number;
  status: string;
  delivery_address: string;
  phone: string;
  created_at: string;
}

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssignedOrders();
      checkAvailability();
    }
  }, [user]);

  const fetchAssignedOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('delivery_partner_id', user!.id)
      .in('status', ['confirmed', 'preparing', 'out_for_delivery'])
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading orders",
        description: error.message,
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const checkAvailability = async () => {
    const { data } = await supabase
      .from('delivery_partners')
      .select('is_available')
      .eq('user_id', user!.id)
      .single();

    if (data) setIsAvailable(data.is_available);
  };

  const toggleAvailability = async () => {
    const { error } = await supabase
      .from('delivery_partners')
      .update({ is_available: !isAvailable })
      .eq('user_id', user!.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    } else {
      setIsAvailable(!isAvailable);
      toast({
        title: isAvailable ? "You're now offline" : "You're now available",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus as any })
      .eq('id', orderId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating order",
        description: error.message,
      });
    } else {
      fetchAssignedOrders();
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    }
  };

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { error } = await supabase
          .from('delivery_partners')
          .update({
            current_lat: position.coords.latitude,
            current_lng: position.coords.longitude,
          })
          .eq('user_id', user!.id);

        if (error) {
          toast({
            variant: "destructive",
            title: "Error updating location",
            description: error.message,
          });
        } else {
          toast({
            title: "Location updated",
          });
        }
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Error getting location",
          description: error.message,
        });
      }
    );
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Delivery Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={updateLocation} variant="outline">
              <Navigation className="mr-2 h-4 w-4" />
              Update Location
            </Button>
            <Button
              onClick={toggleAvailability}
              variant={isAvailable ? "default" : "secondary"}
            >
              {isAvailable ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No assigned orders</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                    <Badge>{order.status.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{order.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Order Total</p>
                    <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'confirmed' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="flex-1"
                      >
                        Start Delivery
                      </Button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
