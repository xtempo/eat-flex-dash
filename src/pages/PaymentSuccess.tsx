import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError('Invalid payment session');
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId, orderId },
        });

        if (error) throw error;

        if (!data.success) {
          throw new Error('Payment verification failed');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-lg">Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              {error ? (
                <>
                  <XCircle className="h-8 w-8 text-destructive" />
                  Payment Failed
                </>
              ) : (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  Payment Successful!
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error ? (
              <div>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => navigate('/cart')} className="w-full">
                  Return to Cart
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-4">
                  Thank you for your order! Your payment has been confirmed and we're preparing your food.
                </p>
                <p className="text-muted-foreground mb-6">
                  You can track your order status in the Orders page.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => navigate('/orders')} className="flex-1">
                    View My Orders
                  </Button>
                  <Button onClick={() => navigate('/menu')} variant="outline" className="flex-1">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PaymentSuccess;
