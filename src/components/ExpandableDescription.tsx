import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableDescriptionProps {
  description: string;
  maxLength?: number;
  className?: string;
}

const ExpandableDescription = ({ description, maxLength = 70, className }: ExpandableDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description) return null;
  
  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? description 
    : `${description.slice(0, maxLength)}...`;

  return (
    <div className={cn("", className)}>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-1 font-medium transition-colors"
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Show more <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </div>
  );
};

export default ExpandableDescription;