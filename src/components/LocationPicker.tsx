import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Locate, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

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

const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Default center (can be customized)
  const defaultCenter: [number, number] = [27.7172, 85.324]; // Kathmandu, Nepal

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
    setPosition({ lat, lng });
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    onLocationSelect({ lat, lng, address: addr });
  };

  const handleLocateMe = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          const addr = await reverseGeocode(latitude, longitude);
          setAddress(addr);
          onLocationSelect({ lat: latitude, lng: longitude, address: addr });
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);
        setPosition({ lat: latNum, lng: lngNum });
        setAddress(display_name);
        onLocationSelect({ lat: latNum, lng: lngNum, address: display_name });
      }
    } catch {
      // Silent fail
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button type="button" variant="outline" size="icon" onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={handleLocateMe} disabled={loading}>
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-64 rounded-lg overflow-hidden border">
        <MapContainer
          center={position ? [position.lat, position.lng] : defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationSelect={handleMapClick} />
          {position && (
            <>
              <Marker position={[position.lat, position.lng]} />
              <Recenter lat={position.lat} lng={position.lng} />
            </>
          )}
        </MapContainer>
      </div>

      {address && (
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm">{address}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
