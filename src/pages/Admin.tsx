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
import { Plus, Edit, Trash, UserPlus, Truck, Upload, X, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RestaurantLocationSettings from '@/components/RestaurantLocationSettings';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image_url: '',
    available: true,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [partnerForm, setPartnerForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicle_type: 'bike',
  });

  useEffect(() => {
    if (isAdmin) {
      fetchMenuItems();
      fetchOrders();
      fetchDeliveryPartners();
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
        order_items (item_name, quantity, price, menu_item_id, menu_items (image_url))
      `)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const fetchDeliveryPartners = async () => {
    const { data } = await supabase
      .from('delivery_partners')
      .select('*')
      .order('created_at', { ascending: false });
    setDeliveryPartners(data || []);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid file", description: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Image must be less than 5MB" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' });
    setImagePreview(null);
  };

  const handleSaveItem = async () => {
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category as any,
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
    setImagePreview(null);
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

  const handleAssignDeliveryPartner = async (orderId: string, partnerId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ delivery_partner_id: partnerId })
      .eq('id', orderId);

    if (error) {
      toast({ variant: "destructive", title: "Error assigning", description: error.message });
    } else {
      toast({ title: "Delivery partner assigned" });
      fetchOrders();
    }
  };

  const handleAddDeliveryPartner = async () => {
    if (!partnerForm.email || !partnerForm.password || !partnerForm.name || !partnerForm.phone) {
      toast({ variant: "destructive", title: "Missing info", description: "Fill all fields" });
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: partnerForm.email,
        password: partnerForm.password,
        options: { data: { full_name: partnerForm.name } },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      const { error: partnerError } = await supabase
        .from('delivery_partners')
        .insert({
          user_id: authData.user.id,
          name: partnerForm.name,
          phone: partnerForm.phone,
          vehicle_type: partnerForm.vehicle_type,
        });

      if (partnerError) throw partnerError;

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: authData.user.id, role: 'delivery_partner' });

      if (roleError) throw roleError;

      setShowPartnerForm(false);
      setPartnerForm({ email: '', password: '', name: '', phone: '', vehicle_type: 'bike' });
      fetchDeliveryPartners();
      toast({ title: "Partner added" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
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
            <TabsTrigger value="delivery">Delivery Partners</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
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
                          <div className="text-right space-y-2">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                            <Select value={order.status} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                              <SelectTrigger className="w-40">
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
                            <Select
                              value={order.delivery_partner_id || ""}
                              onValueChange={(value) => handleAssignDeliveryPartner(order.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Assign partner" />
                              </SelectTrigger>
                              <SelectContent>
                                {deliveryPartners.filter(p => p.is_available).map(partner => (
                                  <SelectItem key={partner.user_id} value={partner.user_id}>
                                    {partner.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Address:</strong> {order.delivery_address}</p>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                          <div className="mt-3">
                            <strong>Items:</strong>
                            <div className="mt-2 space-y-2">
                              {order.order_items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                                  {item.menu_items?.image_url ? (
                                    <img
                                      src={item.menu_items.image_url}
                                      alt={item.item_name}
                                      className="w-16 h-16 rounded-md object-cover flex-shrink-0 border border-border"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                                      <span className="text-xs text-muted-foreground">No img</span>
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.item_name}</p>
                                    <p className="text-muted-foreground text-xs">Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="continental">Continental</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="thai">Thai</SelectItem>
                              <SelectItem value="mexican">Mexican</SelectItem>
                              <SelectItem value="snacks">Snacks</SelectItem>
                              <SelectItem value="soups">Soups</SelectItem>
                              <SelectItem value="salads">Salads</SelectItem>
                              <SelectItem value="breads">Breads</SelectItem>
                              <SelectItem value="rice_dishes">Rice Dishes</SelectItem>
                              <SelectItem value="noodles">Noodles</SelectItem>
                              <SelectItem value="desserts">Desserts</SelectItem>
                              <SelectItem value="drinks">Drinks</SelectItem>
                              <SelectItem value="beverages">Beverages</SelectItem>
                              <SelectItem value="specials">Specials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Image</Label>
                          <div className="space-y-2">
                            {(imagePreview || formData.image_url) ? (
                              <div className="relative w-32 h-32">
                                <img
                                  src={imagePreview || formData.image_url}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={handleRemoveImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:border-primary transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  disabled={uploading}
                                />
                                <div className="text-center">
                                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {uploading ? 'Uploading...' : 'Upload'}
                                  </span>
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveItem} disabled={uploading}>
                          {editingItem ? 'Update' : 'Add'} Item
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setShowAddItem(false);
                          setEditingItem(null);
                          setFormData({ name: '', description: '', price: '', category: 'appetizers', image_url: '', available: true });
                          setImagePreview(null);
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
                                setImagePreview(item.image_url || null);
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

          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Delivery Partners</CardTitle>
                    <CardDescription>Manage your delivery team</CardDescription>
                  </div>
                  <Button onClick={() => setShowPartnerForm(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Partner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {deliveryPartners.map(partner => (
                    <Card key={partner.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{partner.name}</h3>
                            <p className="text-sm text-muted-foreground">{partner.phone}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Truck className="h-4 w-4" />
                              <span className="text-sm capitalize">{partner.vehicle_type}</span>
                            </div>
                          </div>
                          <Badge variant={partner.is_available ? "default" : "secondary"}>
                            {partner.is_available ? "Available" : "Offline"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <RestaurantLocationSettings />
          </TabsContent>
        </Tabs>

        <Dialog open={showPartnerForm} onOpenChange={setShowPartnerForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Delivery Partner</DialogTitle>
              <DialogDescription>Create new delivery partner account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={partnerForm.email} onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={partnerForm.password} onChange={(e) => setPartnerForm({ ...partnerForm, password: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Select value={partnerForm.vehicle_type} onValueChange={(value) => setPartnerForm({ ...partnerForm, vehicle_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPartnerForm(false)}>Cancel</Button>
              <Button onClick={handleAddDeliveryPartner}>Add Partner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;