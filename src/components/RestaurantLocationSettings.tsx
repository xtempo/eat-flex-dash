import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Locate, Search, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
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

interface MapEventsProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapEvents = ({ onLocationSelect }: MapEventsProps) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface RecenterProps {
  lat: number;
  lng: number;
}

const Recenter = ({ lat, lng }: RecenterProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

interface RestaurantLocation {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

const RestaurantLocationSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<RestaurantLocation>({
    lat: 27.7172,
    lng: 85.324,
    name: 'Our Restaurant',
    address: 'Kathmandu, Nepal'
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('value')
      .eq('key', 'restaurant_location')
      .single();

    if (!error && data?.value) {
      const val = data.value as unknown as RestaurantLocation;
      setLocation(val);
    }
    setLoading(false);
  };

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    setLocation(prev => ({ ...prev, lat, lng, address }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocation(prev => ({
          ...prev,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          address: display_name
        }));
      }
    } catch {
      // Silent fail
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // First check if record exists
    const { data: existing } = await supabase
      .from('restaurant_settings')
      .select('id')
      .eq('key', 'restaurant_location')
      .single();

    const jsonValue = JSON.parse(JSON.stringify(location));
    
    let error;
    if (existing) {
      const result = await supabase
        .from('restaurant_settings')
        .update({ value: jsonValue })
        .eq('key', 'restaurant_location');
      error = result.error;
    } else {
      const result = await supabase
        .from('restaurant_settings')
        .insert([{ key: 'restaurant_location', value: jsonValue }]);
      error = result.error;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving location",
        description: error.message
      });
    } else {
      toast({
        title: "Location saved",
        description: "Restaurant location has been updated successfully."
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Restaurant Location
        </CardTitle>
        <CardDescription>
          Set your restaurant's location for delivery tracking. This will be shown as the pickup point on customer maps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="restaurant-name">Restaurant Name</Label>
            <Input
              id="restaurant-name"
              value={location.name}
              onChange={(e) => setLocation(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your restaurant name"
            />
          </div>
          <div>
            <Label>Search Location</Label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for address..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label>Click on the map to set your restaurant location</Label>
          <div className="h-72 rounded-lg overflow-hidden border mt-2">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEvents onLocationSelect={handleMapClick} />
              <Marker position={[location.lat, location.lng]} icon={restaurantIcon} />
              <Recenter lat={location.lat} lng={location.lng} />
            </MapContainer>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{location.name}</p>
            <p className="text-sm text-muted-foreground">{location.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Location'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantLocationSettings;
