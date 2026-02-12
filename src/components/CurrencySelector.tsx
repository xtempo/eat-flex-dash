import { useCurrency, CURRENCIES } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

const CurrencySelector = () => {
  const { currency, setCurrencyCode, loading } = useCurrency();

  return (
    <Select value={currency.code} onValueChange={setCurrencyCode} disabled={loading}>
      <SelectTrigger className="w-[100px] h-8 text-xs border-primary/20">
        <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map(c => (
          <SelectItem key={c.code} value={c.code} className="text-xs">
            <span className="font-medium">{c.symbol}</span> {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
