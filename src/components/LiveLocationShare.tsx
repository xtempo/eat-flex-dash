import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Radio, Link2 } from 'lucide-react';

interface LiveLocationShareProps {
  orderId: string;
  initialLat: number | null;
  initialLng: number | null;
}

// Extract lat,lng from common WhatsApp / Google / Apple Maps URLs
const parseLocationLink = (url: string): { lat: number; lng: number } | null => {
  const trimmed = url.trim();
  // Plain "lat,lng"
  const plain = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (plain) return { lat: parseFloat(plain[1]), lng: parseFloat(plain[2]) };

  // ?q=lat,lng or ?query=lat,lng or &ll=lat,lng
  const q = trimmed.match(/[?&](?:q|query|ll|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };

  // Google maps @lat,lng,zoom
  const at = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };

  // /maps/place/.../!3dLAT!4dLNG
  const place = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (place) return { lat: parseFloat(place[1]), lng: parseFloat(place[2]) };

  return null;
};

export const LiveLocationShare = ({ orderId, initialLat, initialLng }: LiveLocationShareProps) => {
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [currentLat, setCurrentLat] = useState<number | null>(initialLat);
  const [currentLng, setCurrentLng] = useState<number | null>(initialLng);
  const watchIdRef = useRef<number | null>(null);

  const updateOrderLocation = async (lat: number, lng: number) => {
    const { error } = await supabase
      .from('orders')
      .update({ delivery_lat: lat, delivery_lng: lng })
      .eq('id', orderId);
    if (error) {
      toast({ variant: 'destructive', title: 'Could not update location', description: error.message });
      return false;
    }
    setCurrentLat(lat);
    setCurrentLng(lng);
    return true;
  };

  const startSharing = () => {
    if (!('geolocation' in navigator)) {
      toast({ variant: 'destructive', title: 'Geolocation not supported on this device' });
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        updateOrderLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        toast({ variant: 'destructive', title: 'Location error', description: err.message });
        stopSharing();
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    watchIdRef.current = id;
    setSharing(true);
    toast({ title: 'Live location sharing started', description: 'Your driver can now see you in real-time.' });
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const handleSubmitLink = async () => {
    const parsed = parseLocationLink(linkInput);
    if (!parsed) {
      toast({
        variant: 'destructive',
        title: 'Could not read that link',
        description: 'Paste a WhatsApp/Google Maps link or "lat,lng" coordinates.',
      });
      return;
    }
    const ok = await updateOrderLocation(parsed.lat, parsed.lng);
    if (ok) {
      toast({ title: 'Location updated', description: 'Your driver has the new pin.' });
      setLinkInput('');
    }
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Share Your Live Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Live GPS toggle */}
        <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
          <div className="space-y-1">
            <Label htmlFor={`live-${orderId}`} className="flex items-center gap-2 font-semibold">
              <Radio className={`h-4 w-4 ${sharing ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
              Real-time GPS tracking
            </Label>
            <p className="text-xs text-muted-foreground">
              Streams your phone's location to the driver while you wait.
            </p>
          </div>
          <Switch
            id={`live-${orderId}`}
            checked={sharing}
            onCheckedChange={(v) => (v ? startSharing() : stopSharing())}
          />
        </div>

        {/* WhatsApp link paste */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Link2 className="h-4 w-4" />
            Or paste a WhatsApp / Google Maps link
          </Label>
          <p className="text-xs text-muted-foreground">
            On WhatsApp, share your live location → tap the message → "Copy link", then paste here.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://maps.google.com/?q=27.71,85.32"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
            />
            <Button onClick={handleSubmitLink} disabled={!linkInput.trim()}>
              Update
            </Button>
          </div>
        </div>

        {currentLat && currentLng && (
          <p className="text-xs text-muted-foreground">
            Current pin: {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLocationShare;
