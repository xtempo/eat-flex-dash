import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { supabase } from '@/integrations/supabase/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LiveTrackingMapProps {
  orderId: string;
  deliveryPartnerId?: string | null;
  customerLocation: { lat: number; lng: number };
  restaurantLocation?: { lat: number; lng: number };
}

interface FitBoundsProps {
  bounds: L.LatLngBoundsExpression;
}

const FitBounds = ({ bounds }: FitBoundsProps) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
};

const LiveTrackingMap = ({
  orderId,
  deliveryPartnerId,
  customerLocation,
  restaurantLocation = { lat: 27.7172, lng: 85.324 } // Default restaurant location
}: LiveTrackingMapProps) => {
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!deliveryPartnerId) return;

    // Fetch initial delivery partner location
    const fetchDeliveryLocation = async () => {
      const { data } = await supabase
        .from('delivery_partners')
        .select('current_lat, current_lng')
        .eq('id', deliveryPartnerId)
        .single();

      if (data?.current_lat && data?.current_lng) {
        setDeliveryLocation({ lat: data.current_lat, lng: data.current_lng });
      }
    };

    fetchDeliveryLocation();

    // Subscribe to real-time location updates
    const channel = supabase
      .channel(`delivery-location-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_partners',
          filter: `id=eq.${deliveryPartnerId}`,
        },
        (payload) => {
          const { current_lat, current_lng } = payload.new as any;
          if (current_lat && current_lng) {
            setDeliveryLocation({ lat: current_lat, lng: current_lng });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deliveryPartnerId, orderId]);

  // Calculate bounds to fit all markers
  const allPoints: [number, number][] = [
    [customerLocation.lat, customerLocation.lng],
    [restaurantLocation.lat, restaurantLocation.lng],
  ];
  
  if (deliveryLocation) {
    allPoints.push([deliveryLocation.lat, deliveryLocation.lng]);
  }

  const bounds = L.latLngBounds(allPoints);

  // Create route line
  const routePoints: [number, number][] = deliveryLocation
    ? [
        [restaurantLocation.lat, restaurantLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng],
        [customerLocation.lat, customerLocation.lng],
      ]
    : [
        [restaurantLocation.lat, restaurantLocation.lng],
        [customerLocation.lat, customerLocation.lng],
      ];

  return (
    <div className="h-80 rounded-lg overflow-hidden border">
      <MapContainer
        center={[customerLocation.lat, customerLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds bounds={bounds} />
        
        {/* Restaurant Marker */}
        <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
          <Popup>
            <strong>Restaurant</strong>
            <br />
            Your order is being prepared here
          </Popup>
        </Marker>

        {/* Customer Location Marker */}
        <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
          <Popup>
            <strong>Delivery Location</strong>
            <br />
            Your order will be delivered here
          </Popup>
        </Marker>

        {/* Delivery Partner Marker */}
        {deliveryLocation && (
          <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
            <Popup>
              <strong>Delivery Partner</strong>
              <br />
              On the way!
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        <Polyline
          positions={routePoints}
          pathOptions={{ color: 'hsl(var(--primary))', weight: 3, dashArray: '10, 10' }}
        />
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
