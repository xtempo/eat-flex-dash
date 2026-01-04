import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Mountain } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleClose = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-4xl mx-auto p-6 shadow-elegant border-tibetan-gold/30 bg-card/98 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-gradient-warm rounded-full shrink-0">
            <Mountain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-tibetan-dark">We value your privacy</h3>
            <p className="text-sm text-muted-foreground mb-4 font-light">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleAcceptAll} size="lg" className="bg-gradient-warm hover:opacity-90">
                Accept All
              </Button>
              <Button onClick={handleClose} variant="outline" size="lg" className="border-tibetan-gold text-tibetan-dark hover:bg-tibetan-gold">
                Decline
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
