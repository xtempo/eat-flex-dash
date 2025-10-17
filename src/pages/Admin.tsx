import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Plus, Edit, Trash } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image_url: '',
    available: true,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchMenuItems();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchMenuItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('category');
    setMenuItems(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name),
        order_items (item_name, quantity, price)
      `)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleSaveItem = async () => {
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category as 'appetizers' | 'main_course' | 'desserts' | 'beverages' | 'specials',
      image_url: formData.image_url || null,
      available: formData.available,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ variant: "destructive", title: "Error updating item", description: error.message });
      } else {
        toast({ title: "Item updated successfully" });
        setEditingItem(null);
      }
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert(itemData);

      if (error) {
        toast({ variant: "destructive", title: "Error adding item", description: error.message });
      } else {
        toast({ title: "Item added successfully" });
        setShowAddItem(false);
      }
    }

    setFormData({ name: '', description: '', price: '', category: 'appetizers', image_url: '', available: true });
    fetchMenuItems();
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ variant: "destructive", title: "Error deleting item", description: error.message });
    } else {
      toast({ title: "Item deleted successfully" });
      fetchMenuItems();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: status as 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' })
      .eq('id', orderId);

    if (error) {
      toast({ variant: "destructive", title: "Error updating order", description: error.message });
    } else {
      toast({ title: "Order status updated" });
      fetchOrders();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage customer orders and update their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">{order.profiles?.full_name}</p>
                            <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                            <Select value={order.status} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                              <SelectTrigger className="w-40 mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Address:</strong> {order.delivery_address}</p>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                          <div className="mt-2">
                            <strong>Items:</strong>
                            {order.order_items.map((item: any, idx: number) => (
                              <div key={idx} className="ml-4">
                                {item.quantity}x {item.item_name} - ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>Add, edit, or remove items from your menu</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddItem(!showAddItem)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(showAddItem || editingItem) && (
                  <Card className="bg-secondary/20">
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appetizers">Appetizers</SelectItem>
                              <SelectItem value="main_course">Main Course</SelectItem>
                              <SelectItem value="desserts">Desserts</SelectItem>
                              <SelectItem value="beverages">Beverages</SelectItem>
                              <SelectItem value="specials">Specials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveItem}>
                          {editingItem ? 'Update' : 'Add'} Item
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setShowAddItem(false);
                          setEditingItem(null);
                          setFormData({ name: '', description: '', price: '', category: 'appetizers', image_url: '', available: true });
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {menuItems.map(item => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{item.category}</Badge>
                              <Badge variant={item.available ? "default" : "destructive"}>
                                {item.available ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item);
                                setFormData({
                                  name: item.name,
                                  description: item.description,
                                  price: item.price.toString(),
                                  category: item.category,
                                  image_url: item.image_url || '',
                                  available: item.available,
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;