import { Package, ChefHat, Truck, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusTrackerProps {
  currentStatus: string;
}

const steps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getStepIndex = (status: string) => {
  if (status === 'cancelled') return -1;
  const index = steps.findIndex(s => s.key === status);
  return index >= 0 ? index : 0;
};

const OrderStatusTracker = ({ currentStatus }: OrderStatusTrackerProps) => {
  const currentIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center gap-3 py-4 px-6 bg-destructive/10 rounded-lg border border-destructive/20">
        <XCircle className="h-6 w-6 text-destructive" />
        <span className="font-semibold text-destructive">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted-foreground/30 text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20 scale-110"
                )}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[80px] leading-tight",
                  isCompleted ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
