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

interface DeliveryRoutePreviewProps {
  customerLocation: { lat: number; lng: number };
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

const DeliveryRoutePreview = ({ customerLocation }: DeliveryRoutePreviewProps) => {
  const [restaurantLocation, setRestaurantLocation] = useState<{ lat: number; lng: number }>({ 
    lat: 27.7172, 
    lng: 85.324 
  });

  useEffect(() => {
    const fetchRestaurantLocation = async () => {
      const { data } = await supabase
        .from('restaurant_settings')
        .select('value')
        .eq('key', 'restaurant_location')
        .single();

      if (data?.value) {
        const loc = data.value as unknown as { lat: number; lng: number };
        setRestaurantLocation({ lat: loc.lat, lng: loc.lng });
      }
    };
    fetchRestaurantLocation();
  }, []);

  const allPoints: [number, number][] = [
    [customerLocation.lat, customerLocation.lng],
    [restaurantLocation.lat, restaurantLocation.lng],
  ];

  const bounds = L.latLngBounds(allPoints);

  const routePoints: [number, number][] = [
    [restaurantLocation.lat, restaurantLocation.lng],
    [customerLocation.lat, customerLocation.lng],
  ];

  return (
    <div className="h-48 rounded-lg overflow-hidden border mt-3">
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
            Your order will be prepared here
          </Popup>
        </Marker>

        {/* Customer Location Marker */}
        <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
          <Popup>
            <strong>Delivery Location</strong>
            <br />
            Your order will arrive here
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline
          positions={routePoints}
          pathOptions={{ color: 'hsl(var(--primary))', weight: 3, dashArray: '10, 10' }}
        />
      </MapContainer>
    </div>
  );
};

export default DeliveryRoutePreview;
