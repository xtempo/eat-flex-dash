import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Phone, User } from 'lucide-react';

interface DeliveryPartner {
  name: string;
  phone: string;
  vehicle_type: string;
  current_lat: number | null;
  current_lng: number | null;
}

interface DeliveryTrackingProps {
  orderId: string;
  deliveryPartnerId: string | null;
}

export const DeliveryTracking = ({ orderId, deliveryPartnerId }: DeliveryTrackingProps) => {
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);

  useEffect(() => {
    if (!deliveryPartnerId) return;

    const fetchPartner = async () => {
      const { data } = await supabase
        .from('delivery_partners')
        .select('name, phone, vehicle_type, current_lat, current_lng')
        .eq('user_id', deliveryPartnerId)
        .single();

      if (data) setPartner(data);
    };

    fetchPartner();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`delivery-${deliveryPartnerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_partners',
          filter: `user_id=eq.${deliveryPartnerId}`,
        },
        (payload) => {
          setPartner(payload.new as DeliveryPartner);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deliveryPartnerId]);

  if (!partner) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Delivery Partner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{partner.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{partner.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{partner.vehicle_type}</span>
        </div>
        {partner.current_lat && partner.current_lng && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Tracking location in real-time
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
