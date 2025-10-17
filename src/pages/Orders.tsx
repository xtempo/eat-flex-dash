import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: string;
  delivery_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
  order_items: Array<{
    item_name: string;
    quantity: number;
    price: number;
  }>;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500' },
  preparing: { label: 'Preparing', icon: Package, color: 'bg-orange-500' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          item_name,
          quantity,
          price
        )
      `)
      .eq('user_id', user!.id)
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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">You haven't placed any orders yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-secondary/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Items</h3>
                        <div className="space-y-2">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.item_name}</span>
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-primary">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Delivery Details</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Address:</span>
                            <p className="mt-1">{order.delivery_address}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <p className="mt-1">{order.phone}</p>
                          </div>
                          {order.notes && (
                            <div>
                              <span className="text-muted-foreground">Notes:</span>
                              <p className="mt-1">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;